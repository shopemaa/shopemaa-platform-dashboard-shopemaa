// PageBuilder.jsx
import React, {
    useMemo,
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
    useRef,
} from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

/* ---------- Public helper (kept) ---------- */
export function renderBlocks(blocks) {
    return blocks.map((b) => (
        <Render key={b.id} block={b}>
            {isContainerish(b.type) ? renderBlocks(b.children) : null}
        </Render>
    ));
}

/* ---------- Autosave (kept) ---------- */
function useAutoSave(data, enabled, delay, onSave) {
    const first = useRef(true);
    useEffect(() => {
        if (!enabled || typeof onSave !== "function") return;
        if (first.current) {
            first.current = false;
            return;
        }
        const t = setTimeout(() => onSave(data), delay);
        return () => clearTimeout(t);
    }, [data, enabled, delay, onSave]);
}

/* ---------- Utils ---------- */
function getColClass(props = {}) {
    const {xs = 12, sm, md, lg, xl} = props;
    return [
        "col",
        xs != null ? `col-${xs}` : "",
        sm != null ? `col-sm-${sm}` : "",
        md != null ? `col-md-${md}` : "",
        lg != null ? `col-lg-${lg}` : "",
        xl != null ? `col-xl-${xl}` : "",
    ]
        .filter(Boolean)
        .join(" ");
}

function isEditableElement(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    return ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
}

function joinClasses(...parts) {
    return parts.filter(Boolean).join(" ");
}

/** Backward-compat: honor className but primary is classes[] */
function getBlockClasses(props = {}) {
    const {className, classes} = props || {};
    return joinClasses(className, ...(Array.isArray(classes) ? classes : []));
}

/** Convert props.data -> { 'data-*': value } attrs */
function toDataAttrs(data) {
    const src = data && typeof data === "object" ? data : {};
    const out = {};
    for (const [k, v] of Object.entries(src)) {
        if (!k) continue;
        out[`data-${k}`] = typeof v === "string" ? v : JSON.stringify(v);
    }
    return out;
}

/** Normalize props: merge legacy className -> classes[], ensure data object */
function normalizeProps(props = {}) {
    const out = {...props};

    // Merge className tokens + classes[]
    const tokens = [];
    if (out.className) {
        tokens.push(
            ...out.className
                .split(/[,\s]+/)
                .map((s) => s.trim())
                .filter(Boolean)
        );
    }
    if (Array.isArray(out.classes)) {
        tokens.push(...out.classes.map((s) => String(s).trim()).filter(Boolean));
    }
    const seen = new Set();
    out.classes = tokens.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));

    // Ensure data is object
    if (!out.data || typeof out.data !== "object" || Array.isArray(out.data)) {
        out.data = {};
    }

    return out;
}

/** Recursively normalize a block tree */
function normalizeTree(blocks = []) {
    return (Array.isArray(blocks) ? blocks : []).map((b) => ({
        ...b,
        props: normalizeProps(b.props || {}),
        children: normalizeTree(b.children || []),
    }));
}

/* ---------- Component ---------- */
const PageBuilder = forwardRef(function PageBuilder(
    {
        initialData = [],
        enabledBlocks = defaultEnabledBlocks,
        onChange,
        onSave,
        onAssetUpload,
        autoSave = false,
        autoSaveDelay = 800,
        mediaLibrary = [],
    },
    ref
) {
    const [tree, setTree] = useState(() => normalizeTree(initialData));
    const [selectedId, setSelectedId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [preview, setPreview] = useState(false);
    const [clipboard, setClipboard] = useState(null);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [libraryTarget, setLibraryTarget] = useState(null);
    const [disableSaveBtn, setDisableSaveBtn] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 4}})
    );

    // (Optional) If parent frequently swaps initialData, uncomment to rehydrate
    // useEffect(() => {
    //   setTree(normalizeTree(initialData));
    //   setSelectedId(null);
    //   setOverId(null);
    // }, [initialData]);

    useImperativeHandle(ref, () => ({
        load: (data) => {
            const arr = normalizeTree(Array.isArray(data) ? data : []);
            setTreeAndEmit(arr);
            setSelectedId(null);
            setOverId(null);
        },
        getData: () => tree,
        clear: () => {
            setTreeAndEmit([]);
            setSelectedId(null);
            setOverId(null);
        },
    }));

    const selectedBlock = useMemo(
        () => findBlock(tree, selectedId),
        [tree, selectedId]
    );

    /** Functional setter that always emits onChange */
    const setTreeAndEmit = (updater) => {
        setTree((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            onChange?.(next);
            return next;
        });
    };

    useAutoSave(tree, autoSave, autoSaveDelay, onSave);

    const addBlock = (type, parentId) => {
        const newBlock = makeBlock(type);
        setTreeAndEmit((prev) => {
            if (!parentId) return [...prev, newBlock];

            const info = findWithParent(prev, parentId);
            if (!info) return prev;

            const idx = info.block?.children?.length ?? 0;
            return insertBlock(prev, parentId, idx, newBlock);
        });
        setSelectedId(newBlock.id);
    };

    const updateProps = (id, props) => {
        setTreeAndEmit((prev) =>
            mapBlocks(prev, (b) => (b.id === id ? {...b, props: {...b.props, ...props}} : b))
        );
    };

    const deleteBlock = (id) => {
        setSelectedId((sid) => (sid === id ? null : sid));
        setTreeAndEmit((prev) => removeBlock(prev, id));
    };

    const duplicateBlock = (id) => {
        setTreeAndEmit((prev) => {
            const info = findWithParent(prev, id);
            if (!info) return prev;
            const copy = deepClone(info.block);
            reassignIds(copy);
            const next = insertBlock(prev, info.parentId, info.index + 1, copy);
            setSelectedId(copy.id);
            return next;
        });
    };

    const copySelected = () => {
        if (!selectedId) return;
        const b = findBlock(tree, selectedId);
        if (!b) return;
        setClipboard(deepClone(b));
    };

    const pasteToSelected = () => {
        if (!clipboard) return;
        setTreeAndEmit((prev) => {
            const copy = deepClone(clipboard);
            reassignIds(copy);

            if (!selectedId) {
                const next = [...prev, copy];
                setSelectedId(copy.id);
                return next;
            }

            const targetInfo = findWithParent(prev, selectedId);
            if (!targetInfo) return prev;

            const target = targetInfo.block;

            if (isContainerish(target.type)) {
                const next = mapBlocks(prev, (b) =>
                    b.id === selectedId ? {...b, children: [...b.children, copy]} : b
                );
                setSelectedId(copy.id);
                return next;
            } else {
                const next = insertBlock(prev, targetInfo.parentId, targetInfo.index + 1, copy);
                setSelectedId(copy.id);
                return next;
            }
        });
    };

    const handleDragEnd = ({active, over}) => {
        setOverId(null);
        if (!over) return;
        const dropMeta = parseDropZoneId(over.id);
        if (!dropMeta) return;
        setTreeAndEmit((prev) => moveBlock(prev, active.id, dropMeta.parentId, dropMeta.index));
    };

    const handleDragOver = ({over}) => setOverId(over?.id ?? null);

    const openLibrary = (blockId, prop) => {
        setLibraryTarget({id: blockId, prop});
        setLibraryOpen(true);
    };

    // Shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (preview) return;
            const meta = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();
            if (isEditableElement(document.activeElement)) return;

            if (meta && key === "c") {
                e.preventDefault();
                copySelected();
            } else if (meta && key === "v") {
                e.preventDefault();
                pasteToSelected();
            } else if (meta && key === "d") {
                e.preventDefault();
                if (selectedId) duplicateBlock(selectedId);
            } else if (key === "delete" || key === "backspace") {
                if (selectedId) {
                    e.preventDefault();
                    deleteBlock(selectedId);
                }
            }
        };
        window.addEventListener("keydown", handler, {capture: true});
        return () => window.removeEventListener("keydown", handler, {capture: true});
    }, [preview, selectedId, tree, clipboard]);

    /* -------- Export static HTML -------- */
    const copyHtml = async () => {
        const html = blocksToHtml(tree);
        try {
            await navigator.clipboard.writeText(html);
        } catch {
            window.prompt("Copy the HTML:", html);
        }
    };

    return (
        <>
            <div className="container-fluid">
                {/* ---------- Top Toolbar / Palette ---------- */}
                <div className="row my-2">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className={'row d-flex flex-wrap align-items-center gap-2'}>
                                    <strong className="me-2">Palettes:</strong>
                                    <div className="d-flex flex-wrap gap-2 me-auto">
                                        {enabledBlocks.map((t) => (
                                            <button
                                                key={t}
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addBlock(t)}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={'row d-flex flex-wrap align-items-center gap-2 pt-2'}>
                                    <strong className="me-2">Actions:</strong>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            className="btn btn-dark rounded-3 ps-3 pe-3"
                                            onClick={() => setPreview((p) => !p)}>
                                            {preview ? "Edit Mode" : "Preview Mode"}
                                        </button>
                                        <button
                                            disabled={disableSaveBtn}
                                            className="btn btn-qrc rounded-3 ps-3 pe-3"
                                            onClick={() =>
                                                typeof onSave === "function" && onSave(tree, setDisableSaveBtn)
                                            }>
                                            Save Changes
                                            &nbsp;
                                            {disableSaveBtn && (
                                                <span
                                                    className="ms-2 spinner-border spinner-border-sm text-white"
                                                    role="status"
                                                ></span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- Canvas + Inspector ---------- */}
                <div className="row g-3 my-2">
                    {/* Canvas / Preview (wider) */}
                    <div className="col-12 col-lg-9">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">{preview ? "Preview" : "Canvas"}</h3>
                            </div>
                            <div
                                className="card-body"
                                onClick={(e) => {
                                    if (!preview && e.target === e.currentTarget) setSelectedId(null);
                                }}>
                                {preview ? (
                                    <StaticGroup blocks={tree}/>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                    >
                                        <Group
                                            parentId={null}
                                            parentType={null}
                                            blocks={tree}
                                            selectedId={selectedId}
                                            onSelect={setSelectedId}
                                            onDelete={deleteBlock}
                                            onDuplicate={duplicateBlock}
                                            overId={overId}
                                        />
                                    </DndContext>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Inspector (right) */}
                    <div className="col-12 col-lg-3">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">Inspector</h3>
                            </div>
                            <div className="card-body">
                                {!selectedBlock ? (
                                    <p className="text-muted">Select a block to edit</p>
                                ) : (
                                    <>
                                        <BlockMeta block={selectedBlock}/>
                                        <Inspector
                                            block={selectedBlock}
                                            onChange={(props) => updateProps(selectedBlock.id, props)}
                                            onAssetUpload={onAssetUpload}
                                            openLibrary={(prop) => openLibrary(selectedBlock.id, prop)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MediaLibraryModal
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                assets={mediaLibrary || []}
                onSelect={(asset) => {
                    if (libraryTarget) {
                        const {id, prop} = libraryTarget;
                        updateProps(id, {[prop]: asset.url});
                        setLibraryOpen(false);
                    }
                }}
            />
        </>
    );
});

export default PageBuilder;

/* ---------- Default enabled blocks ---------- */
const defaultEnabledBlocks = [
    "navbar",
    "heading",
    "text",
    "image",
    "video",
    "button",
    "product",
    "form",
    "container",
    "section",
    "card",
    "hero",
    "row",
    "col",
    "alert",
    "divider",
    "spacer",
];

/* ---------- Canvas (edit mode) components ---------- */
function Group({
                   parentId,
                   parentType,
                   blocks,
                   selectedId,
                   onSelect,
                   onDelete,
                   onDuplicate,
                   overId,
               }) {
    const beforeAllId = dropZoneId(parentId, 0);
    const inRow = parentType === "row";

    return (
        <>
            <DropZone id={beforeAllId} highlighted={overId === beforeAllId} inRow={inRow}/>
            {blocks.map((b, idx) => {
                const beforeId = dropZoneId(parentId, idx);
                const afterId = dropZoneId(parentId, idx + 1);

                const content = (
                    <DraggableBlock
                        key={b.id}
                        block={b}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    >
                        {isContainerish(b.type) && (
                            <Group
                                parentId={b.id}
                                parentType={b.type}
                                blocks={b.children}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                onDelete={onDelete}
                                onDuplicate={onDuplicate}
                                overId={overId}
                            />
                        )}
                    </DraggableBlock>
                );

                return (
                    <React.Fragment key={b.id}>
                        {idx > 0 && (
                            <DropZone id={beforeId} highlighted={overId === beforeId} inRow={inRow}/>
                        )}

                        {/* Keep .row > .col-* in edit mode, include custom classes */}
                        {b.type === "col" ? (
                            <div className={joinClasses(getColClass(b.props), getBlockClasses(b.props))}>
                                {content}
                            </div>
                        ) : (
                            content
                        )}

                        <DropZone id={afterId} highlighted={overId === afterId} inRow={inRow}/>
                    </React.Fragment>
                );
            })}
            {blocks.length === 0 && (
                <DropZone
                    id={dropZoneId(parentId, 0)}
                    highlighted={overId === dropZoneId(parentId, 0)}
                    inRow={inRow}
                />
            )}
        </>
    );
}

function DraggableBlock({
                            block,
                            selectedId,
                            onSelect,
                            onDelete,
                            onDuplicate,
                            children,
                        }) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
        useDraggable({id: block.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isSelected = block.id === selectedId;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={joinClasses(
                "qrc-draggable position-relative p-2 mb-2",
                isSelected ? "border border-primary" : "border border-dashed"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
            {...attributes}
            {...listeners}
        >
            <Toolbar
                onDelete={() => onDelete(block.id)}
                onDuplicate={() => onDuplicate(block.id)}
            />
            {/* editable=true so `col` won't re-wrap (Group already wrapped it) */}
            <Render block={block} editable>
                {children}
            </Render>
        </div>
    );
}

function DropZone({id, highlighted, inRow}) {
    const {setNodeRef} = useDroppable({id});

    const base = {
        height: 8,
        margin: "4px 0",
        borderRadius: 2,
        background: highlighted ? "rgba(14,165,233,0.4)" : "transparent",
        border: highlighted ? "2px solid #0ea5e9" : "2px dashed transparent",
    };

    const style = inRow
        ? {
            ...base,
            position: "relative",
            width: 0,
            flex: "0 0 0",
            overflow: "visible",
        }
        : base;

    return <div ref={setNodeRef} style={style}/>;
}

function Toolbar({onDelete, onDuplicate}) {
    return (
        <div className="position-absolute top-0 end-0 m-1 d-flex gap-1" style={{zIndex: 9999}}>
            <button
                type="button"
                className="btn btn-sm btn-secondary"
                title="Duplicate (Ctrl/Cmd + D)"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDuplicate();
                }}
            >
                ⧉
            </button>
            <button
                type="button"
                className="btn btn-sm btn-danger"
                title="Delete (Del/Backspace)"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                }}
            >
                ✕
            </button>
        </div>
    );
}

/* ---------- Preview (static render) ---------- */
function StaticGroup({blocks}) {
    return (
        <>
            {blocks.map((b) => (
                <Render key={b.id} block={b}>
                    {isContainerish(b.type) && <StaticGroup blocks={b.children}/>}
                </Render>
            ))}
        </>
    );
}

/* ---------- Renderers ---------- */
function Render({block, children, editable = false}) {
    const cls = getBlockClasses(block.props);
    const dataAttrs = toDataAttrs(block.props?.data);

    switch (block.type) {
        case "navbar": {
            const {brand, menu, sticky, background} = block.props;
            const collapseId = `navbar-${block.id}`;
            return (
                <nav
                    id={block.id}
                    className={joinClasses("navbar navbar-expand-lg", sticky ? "sticky-top" : "", cls)}
                    style={{background}}
                    {...dataAttrs}
                >
                    <div className="container">
                        <a className="navbar-brand" href="#">
                            {brand}
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${collapseId}`}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id={collapseId}>
                            <ul className="navbar-nav ms-auto">
                                {(menu || []).map((item, idx) =>
                                    item.dropdown ? (
                                        <li className="nav-item dropdown" key={idx}>
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href={item.href}
                                                role="button"
                                                data-bs-toggle="dropdown"
                                            >
                                                {item.label}
                                            </a>
                                            <ul className="dropdown-menu">
                                                {item.dropdown.map((d, di) => (
                                                    <li key={di}>
                                                        <a className="dropdown-item" href={d.href}>
                                                            {d.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ) : (
                                        <li className="nav-item" key={idx}>
                                            <a className="nav-link" href={item.href}>
                                                {item.label}
                                            </a>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            );
        }

        case "heading": {
            const {text, level, align} = block.props;
            const Tag = `h${level}`;
            return React.createElement(
                Tag,
                {style: {textAlign: align}, className: cls, id: block.id, ...dataAttrs},
                text
            );
        }

        case "text": {
            const {text, align} = block.props;
            return (
                <p
                    id={block.id}
                    className={cls}
                    style={{textAlign: align}}
                    dangerouslySetInnerHTML={{__html: text}}
                    {...dataAttrs}
                />
            );
        }

        case "image": {
            const {src, alt, width} = block.props;
            return (
                <img
                    src={src}
                    alt={alt || ""}
                    style={{width}}
                    className={cls}
                    id={block.id}
                    {...dataAttrs}
                />
            );
        }

        case "video": {
            const {src, poster, controls, autoplay, loop, muted, width} = block.props;
            return (
                <video
                    id={block.id}
                    src={src}
                    poster={poster}
                    controls={!!controls}
                    autoPlay={!!autoplay}
                    loop={!!loop}
                    muted={!!muted}
                    style={{width: width || "100%"}}
                    className={cls}
                    {...dataAttrs}
                />
            );
        }

        case "button": {
            const {label, href} = block.props;
            return (
                <a id={block.id} href={href} className={joinClasses("btn btn-primary", cls)} {...dataAttrs}>
                    {label}
                </a>
            );
        }

        case "container": {
            const {padding, background} = block.props;
            return (
                <div id={block.id} className={cls} style={{padding, background}} {...dataAttrs}>
                    {children}
                </div>
            );
        }

        case "product": {
            const {title, price, oldPrice, rating, imgUrl, buyLabel, buyHref} = block.props;
            const stars = Math.min(Math.max(Number(rating) || 0, 0), 5);
            return (
                <div id={block.id} className={joinClasses("card text-center h-100", cls)} {...dataAttrs}>
                    {imgUrl && <img src={imgUrl} alt={title} className="card-img-top"/>}
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <div className="mb-2">
                            <span className="fw-bold me-2">${price}</span>
                            {oldPrice && (
                                <span className="text-muted text-decoration-line-through">${oldPrice}</span>
                            )}
                        </div>
                        {stars > 0 && (
                            <div className="mb-2">
                                {"★".repeat(stars)}
                                {"☆".repeat(5 - stars)}
                            </div>
                        )}
                        <a href={buyHref} className="btn btn-primary">
                            {buyLabel}
                        </a>
                    </div>
                </div>
            );
        }

        case "form": {
            const {title, buttonLabel, placeholder, action, method} = block.props;
            return (
                <form
                    id={block.id}
                    action={action}
                    method={method}
                    className={joinClasses("d-flex flex-column align-items-center", cls)}
                    {...dataAttrs}
                >
                    {title && <h5 className="mb-3">{title}</h5>}
                    <div className="input-group mb-3" style={{maxWidth: 400}}>
                        <input type="email" className="form-control" placeholder={placeholder} required/>
                        <button className="btn btn-primary" type="submit">
                            {buttonLabel}
                        </button>
                    </div>
                </form>
            );
        }

        case "section": {
            const {container, paddingY, background} = block.props;
            if (container) {
                return (
                    <section
                        id={block.id}
                        className={joinClasses(paddingY, cls)}
                        style={{background}}
                        {...dataAttrs}
                    >
                        <div className="container">{children}</div>
                    </section>
                );
            }
            return (
                <section
                    id={block.id}
                    className={joinClasses(paddingY, cls)}
                    style={{background}}
                    {...dataAttrs}
                >
                    {children}
                </section>
            );
        }

        case "row": {
            const {gutter} = block.props;
            return (
                <div id={block.id} className={joinClasses("row", gutter || "", cls)} {...dataAttrs}>
                    {children}
                </div>
            );
        }

        case "col": {
            // In edit mode we already wrapped cols properly in Group
            if (editable) return <>{children}</>;
            return (
                <div id={block.id} className={joinClasses(getColClass(block.props), cls)} {...dataAttrs}>
                    {children}
                </div>
            );
        }

        case "card": {
            const {title, subtitle, showHeader, showFooter, footerText, shadow} = block.props;
            return (
                <div
                    id={block.id}
                    className={joinClasses("card", shadow ? "shadow-sm" : "", cls)}
                    {...dataAttrs}
                >
                    {showHeader && (
                        <div className="card-header">
                            <h3 className="card-title mb-0">{title}</h3>
                            {subtitle && <div className="card-subtitle">{subtitle}</div>}
                        </div>
                    )}
                    <div className="card-body">{children}</div>
                    {showFooter && <div className="card-footer">{footerText}</div>}
                </div>
            );
        }

        case "hero": {
            const {title, subtitle, bgUrl, height, overlay, align, textColor} = block.props;
            return (
                <div
                    id={block.id}
                    className={joinClasses("position-relative d-flex align-items-center", cls)}
                    style={{
                        minHeight: height,
                        backgroundImage: `url(${bgUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: textColor,
                        textAlign: align,
                    }}
                    {...dataAttrs}
                >
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{backgroundColor: `rgba(0,0,0,${overlay})`}}
                    />
                    <div className="container position-relative">
                        <h1 className="mb-2">{title}</h1>
                        {subtitle && <p className="lead mb-3">{subtitle}</p>}
                        {children}
                    </div>
                </div>
            );
        }

        case "alert": {
            const {variant, text, dismissible} = block.props;
            return (
                <div
                    id={block.id}
                    className={joinClasses(
                        `alert alert-${variant}`,
                        dismissible ? "alert-dismissible" : "",
                        cls
                    )}
                    role="alert"
                    {...dataAttrs}
                >
                    {text}
                    {dismissible && (
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
                    )}
                    {children}
                </div>
            );
        }

        case "divider": {
            const {style, thickness, color, marginY} = block.props;
            return (
                <hr
                    className={cls}
                    style={{
                        borderTopStyle: style,
                        borderTopWidth: thickness,
                        borderTopColor: color,
                        margin: `${marginY}px 0`,
                    }}
                    id={block.id}
                    {...dataAttrs}
                />
            );
        }

        case "spacer": {
            return (
                <div
                    className={cls}
                    style={{height: block.props.height}}
                    id={block.id}
                    {...dataAttrs}
                />
            );
        }

        default:
            return null;
    }
}

function BlockMeta({block}) {
    return (
        <div className="mb-3">
            <span className="badge bg-secondary me-2 text-uppercase">{block.type}</span>
            <code className="text-muted">id: {block.id}</code>
        </div>
    );
}

/* ---------- Inspector ---------- */
function Inspector({block, onChange, onAssetUpload, openLibrary}) {
    let content = null;

    switch (block.type) {
        case "navbar": {
            const {brand, menu, sticky, background} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Brand" value={brand} onChange={(v) => onChange({brand: v})}/>
                    <LabeledSelect
                        label="Sticky"
                        value={sticky ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({sticky: v === "true"})}
                    />
                    <LabeledInput label="Background" value={background} onChange={(v) => onChange({background: v})}/>
                    <label className="form-label">Menu Items (JSON)</label>
                    <textarea
                        className="form-control"
                        rows={8}
                        defaultValue={JSON.stringify(menu, null, 2)}
                        onBlur={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                onChange({menu: parsed});
                            } catch {
                                /* ignore */
                            }
                        }}
                    />
                </form>
            );
            break;
        }

        case "heading": {
            const {text, level, align} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Text" value={text} onChange={(v) => onChange({text: v})}/>
                    <LabeledSelect
                        label="Level"
                        value={level}
                        options={[1, 2, 3, 4, 5, 6]}
                        onChange={(v) => onChange({level: Number(v)})}
                    />
                    <LabeledSelect
                        label="Align"
                        value={align}
                        options={["left", "center", "right"]}
                        onChange={(v) => onChange({align: v})}
                    />
                </form>
            );
            break;
        }

        case "text": {
            const {text, align} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledTextarea label="Text (HTML allowed)" value={text} onChange={(v) => onChange({text: v})}
                                     rows={5}/>
                    <LabeledSelect
                        label="Align"
                        value={align}
                        options={["left", "center", "right"]}
                        onChange={(v) => onChange({align: v})}
                    />
                </form>
            );
            break;
        }

        case "image": {
            const {src, alt, width} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => openLibrary("src")}>
                        Pick from Library
                    </button>
                    <UploadField
                        label="Upload image"
                        accept="image/*"
                        disabled={!onAssetUpload}
                        onFile={async (file, setState) => {
                            if (!onAssetUpload) return;
                            try {
                                setState({uploading: true});
                                const {url} = await onAssetUpload(file, {kind: "image"});
                                onChange({src: url});
                            } catch (e) {
                                setState({error: e.message || "Upload failed"});
                            } finally {
                                setState({uploading: false});
                            }
                        }}
                    />
                    <LabeledInput label="Src" value={src} onChange={(v) => onChange({src: v})}/>
                    <LabeledInput label="Alt" value={alt} onChange={(v) => onChange({alt: v})}/>
                    <LabeledInput label="Width" value={width} onChange={(v) => onChange({width: v})}/>
                </form>
            );
            break;
        }

        case "video": {
            const {src, poster, controls = true, autoplay = false, loop = false, muted = false, width} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => openLibrary("src")}>
                        Pick from Library
                    </button>
                    <UploadField
                        label="Upload video"
                        accept="video/*"
                        disabled={!onAssetUpload}
                        onFile={async (file, setState) => {
                            if (!onAssetUpload) return;
                            try {
                                setState({uploading: true});
                                const {url} = await onAssetUpload(file, {kind: "video"});
                                onChange({src: url});
                            } catch (e) {
                                setState({error: e.message || "Upload failed"});
                            } finally {
                                setState({uploading: false});
                            }
                        }}
                    />
                    <UploadField
                        label="Upload poster"
                        accept="image/*"
                        disabled={!onAssetUpload}
                        onFile={async (file, setState) => {
                            if (!onAssetUpload) return;
                            try {
                                setState({uploading: true});
                                const {url} = await onAssetUpload(file, {kind: "poster"});
                                onChange({poster: url});
                            } catch (e) {
                                setState({error: e.message || "Upload failed"});
                            } finally {
                                setState({uploading: false});
                            }
                        }}
                    />
                    <LabeledInput label="Src" value={src} onChange={(v) => onChange({src: v})}/>
                    <LabeledInput label="Poster" value={poster} onChange={(v) => onChange({poster: v})}/>
                    <LabeledInput label="Width" value={width || ""} onChange={(v) => onChange({width: v})}/>
                    <LabeledSelect
                        label="Controls"
                        value={controls ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({controls: v === "true"})}
                    />
                    <LabeledSelect
                        label="Autoplay"
                        value={autoplay ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({autoplay: v === "true"})}
                    />
                    <LabeledSelect
                        label="Loop"
                        value={loop ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({loop: v === "true"})}
                    />
                    <LabeledSelect
                        label="Muted"
                        value={muted ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({muted: v === "true"})}
                    />
                </form>
            );
            break;
        }

        case "button": {
            const {label, href} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Label" value={label} onChange={(v) => onChange({label: v})}/>
                    <LabeledInput label="Href" value={href} onChange={(v) => onChange({href: v})}/>
                </form>
            );
            break;
        }

        case "product": {
            const {title, price, oldPrice, rating, imgUrl, buyLabel, buyHref} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm" type="button"
                            onClick={() => openLibrary("imgUrl")}>
                        Pick Image from Library
                    </button>
                    <UploadField
                        label="Upload Image"
                        accept="image/*"
                        disabled={!onAssetUpload}
                        onFile={async (file, setState) => {
                            if (!onAssetUpload) return;
                            try {
                                setState({uploading: true});
                                const {url} = await onAssetUpload(file, {kind: "productImg"});
                                onChange({imgUrl: url});
                            } catch (e) {
                                setState({error: e.message || "Upload failed"});
                            } finally {
                                setState({uploading: false});
                            }
                        }}
                    />
                    <LabeledInput label="Image URL" value={imgUrl} onChange={(v) => onChange({imgUrl: v})}/>
                    <LabeledInput label="Title" value={title} onChange={(v) => onChange({title: v})}/>
                    <LabeledInput label="Price" value={price} onChange={(v) => onChange({price: v})}/>
                    <LabeledInput label="Old Price" value={oldPrice} onChange={(v) => onChange({oldPrice: v})}/>
                    <LabeledInput label="Rating (0-5)" value={rating} onChange={(v) => onChange({rating: Number(v)})}/>
                    <LabeledInput label="Buy Button Label" value={buyLabel} onChange={(v) => onChange({buyLabel: v})}/>
                    <LabeledInput label="Buy Button Href" value={buyHref} onChange={(v) => onChange({buyHref: v})}/>
                </form>
            );
            break;
        }

        case "form": {
            const {title, buttonLabel, placeholder, action, method} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Title" value={title} onChange={(v) => onChange({title: v})}/>
                    <LabeledInput label="Button Label" value={buttonLabel}
                                  onChange={(v) => onChange({buttonLabel: v})}/>
                    <LabeledInput label="Placeholder" value={placeholder} onChange={(v) => onChange({placeholder: v})}/>
                    <LabeledInput label="Action URL" value={action} onChange={(v) => onChange({action: v})}/>
                    <LabeledSelect label="Method" value={method} options={["POST", "GET"]}
                                   onChange={(v) => onChange({method: v})}/>
                </form>
            );
            break;
        }

        case "container": {
            const {padding, background} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Padding" value={padding} onChange={(v) => onChange({padding: v})}/>
                    <LabeledInput label="Background" value={background} onChange={(v) => onChange({background: v})}/>
                </form>
            );
            break;
        }

        case "hero": {
            const {title, subtitle, bgUrl, height, overlay, align, textColor} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm" type="button"
                            onClick={() => openLibrary("bgUrl")}>
                        Pick BG from Library
                    </button>
                    <UploadField
                        label="Upload background"
                        accept="image/*"
                        disabled={!onAssetUpload}
                        onFile={async (file, setState) => {
                            if (!onAssetUpload) return;
                            try {
                                setState({uploading: true});
                                const {url} = await onAssetUpload(file, {kind: "heroBg"});
                                onChange({bgUrl: url});
                            } catch (e) {
                                setState({error: e.message || "Upload failed"});
                            } finally {
                                setState({uploading: false});
                            }
                        }}
                    />
                    <LabeledInput label="Background URL" value={bgUrl} onChange={(v) => onChange({bgUrl: v})}/>
                    <LabeledInput label="Title" value={title} onChange={(v) => onChange({title: v})}/>
                    <LabeledInput label="Subtitle" value={subtitle} onChange={(v) => onChange({subtitle: v})}/>
                    <LabeledInput label="Min Height (px)" value={height}
                                  onChange={(v) => onChange({height: Number(v)})}/>
                    <LabeledInput label="Overlay (0-1)" value={overlay}
                                  onChange={(v) => onChange({overlay: Number(v)})}/>
                    <LabeledSelect
                        label="Align"
                        value={align}
                        options={["left", "center", "right"]}
                        onChange={(v) => onChange({align: v})}
                    />
                    <LabeledInput label="Text Color" value={textColor} onChange={(v) => onChange({textColor: v})}/>
                </form>
            );
            break;
        }

        case "section": {
            const {container, paddingY, background} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledSelect
                        label="Padding Y"
                        value={paddingY}
                        options={["py-0", "py-2", "py-3", "py-4", "py-5"]}
                        onChange={(v) => onChange({paddingY: v})}
                    />
                    <LabeledInput label="Background" value={background} onChange={(v) => onChange({background: v})}/>
                    <LabeledSelect
                        label="Use .container"
                        value={container ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({container: v === "true"})}
                    />
                </form>
            );
            break;
        }

        case "card": {
            const {title, subtitle, showHeader, showFooter, footerText, shadow} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Title" value={title} onChange={(v) => onChange({title: v})}/>
                    <LabeledInput label="Subtitle" value={subtitle} onChange={(v) => onChange({subtitle: v})}/>
                    <LabeledSelect
                        label="Show Header"
                        value={showHeader ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({showHeader: v === "true"})}
                    />
                    <LabeledSelect
                        label="Show Footer"
                        value={showFooter ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({showFooter: v === "true"})}
                    />
                    {showFooter && (
                        <LabeledInput label="Footer Text" value={footerText}
                                      onChange={(v) => onChange({footerText: v})}/>
                    )}
                    <LabeledSelect
                        label="Shadow"
                        value={shadow ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({shadow: v === "true"})}
                    />
                </form>
            );
            break;
        }

        case "row": {
            const {gutter} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledSelect
                        label="Gutter"
                        value={gutter}
                        options={["g-0", "g-1", "g-2", "g-3", "g-4", "g-5"]}
                        onChange={(v) => onChange({gutter: v})}
                    />
                </form>
            );
            break;
        }

        case "col": {
            const {xs = 12, sm, md, lg, xl} = block.props || {};
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="xs" value={xs} onChange={(v) => onChange({xs: Number(v)})}/>
                    <LabeledInput label="sm" value={sm} onChange={(v) => onChange({sm: Number(v)})}/>
                    <LabeledInput label="md" value={md} onChange={(v) => onChange({md: Number(v)})}/>
                    <LabeledInput label="lg" value={lg} onChange={(v) => onChange({lg: Number(v)})}/>
                    <LabeledInput label="xl" value={xl} onChange={(v) => onChange({xl: Number(v)})}/>
                </form>
            );
            break;
        }

        case "alert": {
            const {variant, text, dismissible} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledSelect
                        label="Variant"
                        value={variant}
                        options={[
                            "primary",
                            "secondary",
                            "success",
                            "warning",
                            "danger",
                            "info",
                            "light",
                            "dark",
                        ]}
                        onChange={(v) => onChange({variant: v})}
                    />
                    <LabeledTextarea label="Text" value={text} onChange={(v) => onChange({text: v})} rows={3}/>
                    <LabeledSelect
                        label="Dismissible"
                        value={dismissible ? "true" : "false"}
                        options={["true", "false"]}
                        onChange={(v) => onChange({dismissible: v === "true"})}
                    />
                </form>
            );
            break;
        }

        case "divider": {
            const {style, thickness, color, marginY} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledSelect label="Style" value={style} options={["solid", "dashed", "dotted"]}
                                   onChange={(v) => onChange({style: v})}/>
                    <LabeledInput label="Thickness (px)" value={thickness}
                                  onChange={(v) => onChange({thickness: Number(v)})}/>
                    <LabeledInput label="Color" value={color} onChange={(v) => onChange({color: v})}/>
                    <LabeledInput label="Margin Y (px)" value={marginY}
                                  onChange={(v) => onChange({marginY: Number(v)})}/>
                </form>
            );
            break;
        }

        case "spacer": {
            const {height} = block.props;
            content = (
                <form className="d-grid gap-2">
                    <LabeledInput label="Height (px)" value={height} onChange={(v) => onChange({height: Number(v)})}/>
                </form>
            );
            break;
        }

        default:
            content = null;
    }

    return (
        <>
            {content}
            <CommonProps props={block.props} onChange={onChange}/>
        </>
    );
}

/* ---------- Common (advanced) props ---------- */

/* ClassesEditor: tokenizes on comma / space / Enter; shows chips; dedupes */
function ClassesEditor({value, onChange}) {
    const [tokens, setTokens] = useState(
        Array.isArray(value) ? value.filter(Boolean) : []
    );
    const [input, setInput] = useState("");

    useEffect(() => {
        const arr = Array.isArray(value) ? value.filter(Boolean) : [];
        setTokens(arr);
    }, [JSON.stringify(value)]);

    const commitToken = (raw) => {
        const parts = String(raw)
            .split(/[,\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (!parts.length) return;
        const set = new Set(tokens);
        parts.forEach((p) => set.add(p));
        const next = Array.from(set);
        setTokens(next);
        onChange(next);
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault();
            commitToken(input);
        } else if (e.key === "Backspace" && !input && tokens.length) {
            const next = tokens.slice(0, -1);
            setTokens(next);
            onChange(next);
        }
    };

    const remove = (t) => {
        const next = tokens.filter((x) => x !== t);
        setTokens(next);
        onChange(next);
    };

    const onPaste = (e) => {
        const text = e.clipboardData.getData("text");
        if (text && /[,\s]/.test(text)) {
            e.preventDefault();
            commitToken(text);
        }
    };

    return (
        <div className="mb-2">
            <label className="form-label">classes</label>
            <div className="border rounded p-2 d-flex flex-wrap gap-2">
                {tokens.map((t) => (
                    <span key={t} className="badge bg-secondary d-flex align-items-center gap-1">
            {t}
                        <button
                            type="button"
                            className="btn btn-sm btn-link text-white p-0 ms-1"
                            onClick={() => remove(t)}
                            aria-label={`remove ${t}`}
                            title="remove"
                        >
              ×
            </button>
          </span>
                ))}
                <input
                    className="form-control border-0 flex-grow-1"
                    placeholder="type a class and press comma/space/Enter"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onPaste={onPaste}
                    style={{minWidth: 160, boxShadow: "none"}}
                />
            </div>
        </div>
    );
}

/* DataEditor: key/value to props.data */
function DataEditor({value, onChange}) {
    const rows = Object.entries(value && typeof value === "object" ? value : {}).map(
        ([k, v]) => ({k, v: typeof v === "string" ? v : JSON.stringify(v)})
    );
    const [items, setItems] = useState(rows.length ? rows : [{k: "", v: ""}]);

    useEffect(() => {
        const next = Object.entries(value && typeof value === "object" ? value : {}).map(
            ([k, v]) => ({k, v: typeof v === "string" ? v : JSON.stringify(v)})
        );
        setItems(next.length ? next : [{k: "", v: ""}]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(value)]);

    const commit = (list) => {
        const out = {};
        for (const {k, v} of list) {
            const key = (k || "").trim();
            if (!key || key in out) continue;
            let parsed = v;
            try {
                parsed = JSON.parse(v);
            } catch {
                parsed = v;
            }
            out[key] = parsed;
        }
        onChange(out);
    };

    const update = (idx, patch) => {
        const next = items.map((r, i) => (i === idx ? {...r, ...patch} : r));
        setItems(next);
        commit(next);
    };

    const addRow = () => {
        const next = [...items, {k: "", v: ""}];
        setItems(next);
    };

    const removeRow = (idx) => {
        const next = items.filter((_, i) => i !== idx);
        setItems(next.length ? next : [{k: "", v: ""}]);
        commit(next);
    };

    return (
        <div className="mb-2">
            <label className="form-label">data-* attributes</label>
            <div className="border rounded p-2">
                {items.map((row, i) => (
                    <div className="d-flex gap-2 align-items-center mb-2" key={i}>
                        <input
                            className="form-control"
                            placeholder="key (e.g. tid)"
                            value={row.k}
                            onChange={(e) => update(i, {k: e.target.value})}
                            style={{maxWidth: 220}}
                        />
                        <input
                            className="form-control"
                            placeholder='value (string or JSON, e.g. "hero-1" or {"a":1})'
                            value={row.v}
                            onChange={(e) => update(i, {v: e.target.value})}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeRow(i)}
                            title="Remove"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addRow}>
                    + Add data attribute
                </button>
            </div>
        </div>
    );
}

function CommonProps({props, onChange}) {
    const {classes = [], data = {}} = props || {};
    return (
        <fieldset className="mt-3">
            <legend className="fs-6 text-muted">Advanced</legend>
            <ClassesEditor
                value={Array.isArray(classes) ? classes : []}
                onChange={(arr) => onChange({classes: arr})}
            />
            <DataEditor value={data} onChange={(obj) => onChange({data: obj})}/>
        </fieldset>
    );
}

/* ---------- Media Library Modal ---------- */
function MediaLibraryModal({open, onClose, assets, onSelect}) {
    if (!open) return null;
    return (
        <div className="modal d-block" tabIndex="-1" style={{background: "rgba(0,0,0,0.4)"}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Media Library</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {assets.length === 0 ? (
                            <p>No assets available.</p>
                        ) : (
                            <div className="row g-2">
                                {assets.map((asset, i) => (
                                    <div className="col-4" key={i}>
                                        <div
                                            className="border rounded p-1 text-center"
                                            style={{cursor: "pointer"}}
                                            onClick={() => onSelect(asset)}
                                        >
                                            {asset.type === "image" ? (
                                                <img src={asset.url} className="img-fluid" alt="asset"/>
                                            ) : (
                                                <video src={asset.url} className="img-fluid"/>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- UploadField ---------- */
function UploadField({label, accept, onFile, disabled}) {
    const inputRef = useRef(null);
    const [state, setState] = useState({
        uploading: false,
        error: null,
        drag: false,
    });

    const onChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await onFile?.(file, (s) => setState((prev) => ({...prev, ...s})));
        e.target.value = "";
    };

    const onDrop = async (e) => {
        e.preventDefault();
        if (disabled) return;
        setState((s) => ({...s, drag: false}));
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await onFile?.(file, (s) => setState((prev) => ({...prev, ...s})));
    };

    const onDragOver = (e) => {
        e.preventDefault();
        if (disabled) return;
        if (!state.drag) setState((s) => ({...s, drag: true}));
    };

    const onDragLeave = () => {
        if (state.drag) setState((s) => ({...s, drag: false}));
    };

    return (
        <div className="mb-2">
            <label className="form-label">{label}</label>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`border rounded p-3 text-center ${
                    state.drag ? "border-primary bg-light" : "border-dashed"
                }`}
                style={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                {state.uploading ? (
                    <span>Uploading…</span>
                ) : (
                    <>
                        <div>Drop file here or click to browse</div>
                        {state.error && <div className="text-danger small mt-1">{state.error}</div>}
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    disabled={disabled}
                    style={{display: "none"}}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

/* ---------- Form helpers ---------- */
function LabeledInput({label, value, onChange}) {
    return (
        <div className="mb-2">
            <label className="form-label">{label}</label>
            <input className="form-control" value={value ?? ""} onChange={(e) => onChange(e.target.value)}/>
        </div>
    );
}

function LabeledTextarea({label, value, onChange, rows = 3}) {
    return (
        <div className="mb-2">
            <label className="form-label">{label}</label>
            <textarea
                className="form-control"
                rows={rows}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function LabeledSelect({label, value, options, onChange}) {
    return (
        <div className="mb-2">
            <label className="form-label">{label}</label>
            <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* ---------- Tree utils ---------- */
function isContainerish(type) {
    return ["container", "section", "card", "hero", "row", "col", "navbar"].includes(
        type
    );
}

function findBlock(blocks, id) {
    if (!id) return null;
    for (const b of blocks) {
        if (b.id === id) return b;
        const child = findBlock(b.children, id);
        if (child) return child;
    }
    return null;
}

function findWithParent(blocks, id, parentId = null) {
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id === id) return {block: b, parentId, index: i};
        const deep = findWithParent(b.children, id, b.id);
        if (deep) return deep;
    }
    return null;
}

function mapBlocks(blocks, fn) {
    return (blocks || []).map((b) => {
        const mapped = fn(b) || b;
        const srcChildren = Array.isArray(mapped.children)
            ? mapped.children
            : (b.children || []);
        return {...mapped, children: mapBlocks(srcChildren, fn)};
    });
}

function removeBlock(blocks, id) {
    return (blocks || [])
        .filter((b) => b.id !== id)
        .map((b) => ({...b, children: removeBlock(b.children, id)}));
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function reassignIds(block) {
    block.id = randId();
    block.children.forEach(reassignIds);
}

function randId() {
    return Math.random().toString(36).slice(2);
}

/* ---------- DnD helpers ---------- */
function dropZoneId(parentId, index) {
    return `dz|${parentId ?? "root"}|${index}`;
}

function parseDropZoneId(id) {
    if (!id?.startsWith("dz|")) return null;
    const [, parentRaw, indexStr] = id.split("|");
    const parentId = parentRaw === "root" ? null : parentRaw;
    const index = Number(indexStr);
    if (Number.isNaN(index)) return null;
    return {parentId, index};
}

function moveBlock(tree, blockId, destParentId, destIndex) {
    const {block: moving, without} = extractBlock(tree, blockId);
    if (!moving) return tree;
    return insertBlock(without, destParentId, destIndex, moving);
}

function extractBlock(blocks, id) {
    let extracted = null;

    function helper(list) {
        const res = [];
        for (const b of list) {
            if (b.id === id) {
                extracted = b;
            } else {
                res.push({...b, children: helper(b.children)});
            }
        }
        return res;
    }

    const without = helper(blocks || []);
    return {block: extracted, without};
}

function insertBlock(blocks, parentId, idx, block) {
    if (parentId === null) {
        const res = [...(blocks || [])];
        res.splice(clamp(idx, 0, res.length), 0, block);
        return res;
    }

    function helper(list) {
        return (list || []).map((b) => {
            if (b.id !== parentId) {
                return {...b, children: helper(b.children)};
            }
            const children = [...(b.children || [])];
            children.splice(clamp(idx, 0, children.length), 0, block);
            return {...b, children};
        });
    }

    return helper(blocks || []);
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

/* ---------- Block factory ---------- */
function makeBlock(type) {
    const id = randId();
    switch (type) {
        case "navbar":
            return {
                id,
                type,
                props: {
                    brand: "MySite",
                    menu: [
                        {label: "Home", href: "#"},
                        {
                            label: "Products",
                            href: "#",
                            dropdown: [
                                {label: "Category 1", href: "#cat1"},
                                {label: "Category 2", href: "#cat2"},
                            ],
                        },
                        {label: "Contact", href: "#contact"},
                    ],
                    sticky: false,
                    background: "#ffffff",
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "heading":
            return {
                id,
                type,
                props: {text: "Heading", level: 2, align: "left", data: {}, classes: []},
                children: [],
            };
        case "text":
            return {
                id,
                type,
                props: {text: "Lorem ipsum dolor sit amet.", align: "left", data: {}, classes: []},
                children: [],
            };
        case "image":
            return {
                id,
                type,
                props: {src: "https://placehold.co/600x200", alt: "", width: "100%", data: {}, classes: []},
                children: [],
            };
        case "video":
            return {
                id,
                type,
                props: {
                    src: "",
                    poster: "",
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    width: "100%",
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "button":
            return {id, type, props: {label: "Click me", href: "#", data: {}, classes: []}, children: []};
        case "product":
            return {
                id,
                type,
                props: {
                    title: "Product Name",
                    price: "29.99",
                    oldPrice: "",
                    rating: 4,
                    imgUrl: "https://placehold.co/300x200?text=Product",
                    buyLabel: "Buy Now",
                    buyHref: "#",
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "form":
            return {
                id,
                type,
                props: {
                    title: "Subscribe to our newsletter",
                    buttonLabel: "Sign Up",
                    placeholder: "Enter your email",
                    action: "#",
                    method: "POST",
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "container":
            return {
                id,
                type,
                props: {padding: "16px", background: "#f7f7f7", data: {}, classes: []},
                children: [],
            };
        case "section":
            return {
                id,
                type,
                props: {container: true, paddingY: "py-5", background: "#ffffff", data: {}, classes: []},
                children: [],
            };
        case "card":
            return {
                id,
                type,
                props: {
                    title: "Card title",
                    subtitle: "Card subtitle",
                    showHeader: true,
                    showFooter: false,
                    footerText: "",
                    shadow: true,
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "hero":
            return {
                id,
                type,
                props: {
                    title: "Hero title",
                    subtitle: "Hero subtitle",
                    bgUrl: "https://placehold.co/1600x600",
                    height: 360,
                    overlay: 0.35,
                    align: "center",
                    textColor: "#ffffff",
                    data: {},
                    classes: [],
                },
                children: [],
            };
        case "row":
            return {id, type, props: {gutter: "g-3", data: {}, classes: []}, children: []};
        case "col":
            return {
                id,
                type,
                props: {xs: 12, sm: 6, md: 4, lg: 3, xl: 3, data: {}, classes: []},
                children: [],
            };
        case "alert":
            return {
                id,
                type,
                props: {variant: "primary", text: "This is an alert", dismissible: false, data: {}, classes: []},
                children: [],
            };
        case "divider":
            return {
                id,
                type,
                props: {style: "solid", thickness: 1, color: "#e5e5e5", marginY: 16, data: {}, classes: []},
                children: [],
            };
        case "spacer":
            return {id, type, props: {height: 32, data: {}, classes: []}, children: []};
        default:
            return null;
    }
}

/* ---------- HTML Export Serializer ---------- */
function blocksToHtml(blocks = []) {
    return (blocks || []).map(blockToHtml).join("");
}

function blockToHtml(b) {
    if (!b) return "";
    const cls = escAttr(getBlockClasses(b.props));
    const dataAttrs = dataAttrsToString(b.props?.data);
    const idAttr = ` id="${escAttr(b.id)}"`;
    const classAttr = cls ? ` class="${cls}"` : "";
    const common = `${idAttr}${classAttr}${dataAttrs}`;

    const childrenHtml = (b.children || []).map(blockToHtml).join("");

    switch (b.type) {
        case "navbar": {
            const {brand, menu, sticky, background} = b.props;
            const collapseId = `navbar-${b.id}`;
            return `
<nav${common} class="${joinClasses("navbar navbar-expand-lg", sticky ? "sticky-top" : "", cls)}" style="background:${escAttr(
                background || ""
            )}">
  <div class="container">
    <a class="navbar-brand" href="#">${escHtml(brand)}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#${escAttr(
                collapseId
            )}">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="${escAttr(collapseId)}">
      <ul class="navbar-nav ms-auto">
        ${(menu || [])
                .map((item) =>
                    item.dropdown
                        ? `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="${escAttr(item.href)}" role="button" data-bs-toggle="dropdown">${escHtml(
                            item.label
                        )}</a>
          <ul class="dropdown-menu">
            ${item.dropdown
                            .map(
                                (d) =>
                                    `<li><a class="dropdown-item" href="${escAttr(d.href)}">${escHtml(
                                        d.label
                                    )}</a></li>`
                            )
                            .join("")}
          </ul>
        </li>`
                        : `<li class="nav-item"><a class="nav-link" href="${escAttr(
                            item.href
                        )}">${escHtml(item.label)}</a></li>`
                )
                .join("")}
      </ul>
    </div>
  </div>
</nav>`;
        }
        case "heading": {
            const {text, level, align} = b.props;
            const tag = `h${Number(level) || 2}`;
            const style = align ? ` style="text-align:${escAttr(align)}"` : "";
            return `<${tag}${idAttr}${classAttr}${dataAttrs}${style}>${escHtml(text)}</${tag}>`;
        }
        case "text": {
            const {text, align} = b.props;
            const style = align ? ` style="text-align:${escAttr(align)}"` : "";
            return `<p${idAttr}${classAttr}${dataAttrs}${style}>${text ?? ""}</p>`;
        }
        case "image": {
            const {src, alt, width} = b.props;
            const style = width ? ` style="width:${escAttr(width)}"` : "";
            return `<img${idAttr}${classAttr}${dataAttrs} src="${escAttr(src)}" alt="${escAttr(
                alt || ""
            )}"${style}/>`;
        }
        case "video": {
            const {src, poster, controls, autoplay, loop, muted, width} = b.props;
            const style = ` style="width:${escAttr(width || "100%")}"`;
            return `<video${idAttr}${classAttr}${dataAttrs} src="${escAttr(src)}"${
                poster ? ` poster="${escAttr(poster)}"` : ""
            }${controls ? " controls" : ""}${autoplay ? " autoplay" : ""}${
                loop ? " loop" : ""
            }${muted ? " muted" : ""}${style}></video>`;
        }
        case "button": {
            const {label, href} = b.props;
            const btnCls = joinClasses("btn btn-primary", cls);
            return `<a${idAttr} class="${escAttr(btnCls)}"${dataAttrs} href="${escAttr(href)}">${escHtml(
                label
            )}</a>`;
        }
        case "container": {
            const {padding, background} = b.props;
            const style = ` style="${padding ? `padding:${escAttr(padding)};` : ""}${
                background ? `background:${escAttr(background)};` : ""
            }"`;
            return `<div${idAttr}${classAttr}${dataAttrs}${style}>${childrenHtml}</div>`;
        }
        case "product": {
            const {title, price, oldPrice, rating, imgUrl, buyLabel, buyHref} = b.props;
            const stars = clamp(Number(rating) || 0, 0, 5);
            return `<div${idAttr} class="${escAttr(
                joinClasses("card text-center h-100", cls)
            )}"${dataAttrs}>
  ${imgUrl ? `<img src="${escAttr(imgUrl)}" alt="${escAttr(title)}" class="card-img-top"/>` : ""}
  <div class="card-body">
    <h5 class="card-title">${escHtml(title)}</h5>
    <div class="mb-2">
      <span class="fw-bold me-2">$${escHtml(price)}</span>
      ${oldPrice ? `<span class="text-muted text-decoration-line-through">$${escHtml(oldPrice)}</span>` : ""}
    </div>
    ${stars > 0 ? `<div class="mb-2">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</div>` : ""}
    <a href="${escAttr(buyHref)}" class="btn btn-primary">${escHtml(buyLabel)}</a>
  </div>
</div>`;
        }
        case "form": {
            const {title, buttonLabel, placeholder, action, method} = b.props;
            return `<form${idAttr} action="${escAttr(action)}" method="${escAttr(
                method
            )}" class="${escAttr(
                joinClasses("d-flex flex-column align-items-center", cls)
            )}"${dataAttrs}>
  ${title ? `<h5 class="mb-3">${escHtml(title)}</h5>` : ""}
  <div class="input-group mb-3" style="max-width:400px">
    <input type="email" class="form-control" placeholder="${escAttr(placeholder)}" required />
    <button class="btn btn-primary" type="submit">${escHtml(buttonLabel)}</button>
  </div>
</form>`;
        }
        case "section": {
            const {container, paddingY, background} = b.props;
            const sectionCls = joinClasses(paddingY, cls);
            const style = background ? ` style="background:${escAttr(background)}"` : "";
            if (container) {
                return `<section${idAttr} class="${escAttr(sectionCls)}"${dataAttrs}${style}><div class="container">${childrenHtml}</div></section>`;
            }
            return `<section${idAttr} class="${escAttr(sectionCls)}"${dataAttrs}${style}>${childrenHtml}</section>`;
        }
        case "row": {
            const {gutter} = b.props;
            const rowCls = joinClasses("row", gutter || "", cls);
            return `<div${idAttr} class="${escAttr(rowCls)}"${dataAttrs}>${childrenHtml}</div>`;
        }
        case "col": {
            const colCls = joinClasses(getColClass(b.props), cls);
            return `<div${idAttr} class="${escAttr(colCls)}"${dataAttrs}>${childrenHtml}</div>`;
        }
        case "card": {
            const {title, subtitle, showHeader, showFooter, footerText, shadow} = b.props;
            const cardCls = joinClasses("card", shadow ? "shadow-sm" : "", cls);
            return `<div${idAttr} class="${escAttr(cardCls)}"${dataAttrs}>
  ${showHeader ? `<div class="card-header"><h3 class="card-title mb-0">${escHtml(title)}</h3>${subtitle ? `<div class="card-subtitle">${escHtml(subtitle)}</div>` : ""}</div>` : ""}
  <div class="card-body">${childrenHtml}</div>
  ${showFooter ? `<div class="card-footer">${escHtml(footerText || "")}</div>` : ""}
</div>`;
        }
        case "hero": {
            const {title, subtitle, bgUrl, height, overlay, align, textColor} = b.props;
            const style = [
                height ? `min-height:${escAttr(height)}px` : "",
                bgUrl ? `background-image:url(${escAttr(bgUrl)})` : "",
                `background-size:cover`,
                `background-position:center`,
                textColor ? `color:${escAttr(textColor)}` : "",
                align ? `text-align:${escAttr(align)}` : "",
            ]
                .filter(Boolean)
                .join(";");
            return `<div${idAttr} class="${escAttr(
                joinClasses("position-relative d-flex align-items-center", cls)
            )}"${dataAttrs} style="${style}">
  <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color:rgba(0,0,0,${Number(
                overlay || 0
            )})"></div>
  <div class="container position-relative">
    <h1 class="mb-2">${escHtml(title)}</h1>
    ${subtitle ? `<p class="lead mb-3">${escHtml(subtitle)}</p>` : ""}
    ${childrenHtml}
  </div>
</div>`;
        }
        case "alert": {
            const {variant, text, dismissible} = b.props;
            const alertCls = joinClasses(
                `alert alert-${variant}`,
                dismissible ? "alert-dismissible" : "",
                cls
            );
            return `<div${idAttr} class="${escAttr(alertCls)}" role="alert"${dataAttrs}>${escHtml(
                text
            )}${childrenHtml}</div>`;
        }
        case "divider": {
            const {style, thickness, color, marginY} = b.props;
            const hrStyle = [
                style ? `border-top-style:${escAttr(style)}` : "",
                Number.isFinite(thickness) ? `border-top-width:${thickness}px` : "",
                color ? `border-top-color:${escAttr(color)}` : "",
                Number.isFinite(marginY) ? `margin:${marginY}px 0` : "",
            ]
                .filter(Boolean)
                .join(";");
            return `<hr${idAttr}${classAttr}${dataAttrs} style="${hrStyle}"/>`;
        }
        case "spacer": {
            const h = b.props?.height;
            return `<div${idAttr}${classAttr}${dataAttrs} style="height:${escAttr(h)}px"></div>`;
        }
        default:
            return "";
    }
}

/* ---- small helpers for serializer ---- */
function escHtml(s = "") {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function escAttr(s = "") {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;");
}

function dataAttrsToString(data) {
    const src = data && typeof data === "object" ? data : {};
    return Object.entries(src)
        .map(([k, v]) => ` data-${escAttr(k)}="${escAttr(typeof v === "string" ? v : JSON.stringify(v))}"`)
        .join("");
}
