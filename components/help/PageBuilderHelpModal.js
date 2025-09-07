import React, {useEffect} from "react";

const PageBuilderHelpModal = ({showHelperPopup, setShowHelperPopup}) => {
    useEffect(() => {
        if (!showHelperPopup) return;
        const handleKeyDown = (e) => e.key === "Escape" && setShowHelperPopup(false);
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showHelperPopup, setShowHelperPopup]);

    const close = () => setShowHelperPopup(false);

    /* --- small helpers for consistent styling --- */
    const CodeBlock = ({code}) => (
        <div className="card bg-light border mb-2">
            <div className="card-body p-2">
        <pre className="m-0" style={{whiteSpace: "pre-wrap"}}>
{code}
        </pre>
            </div>
        </div>
    );

    const SnippetCard = ({title, subtitle, children}) => (
        <div className="card mb-3">
            <div className="card-header">
                <h6 className="card-title mb-0">{title}</h6>
                {subtitle && <div className="card-subtitle text-secondary small">{subtitle}</div>}
            </div>
            <div className="card-body">{children}</div>
        </div>
    );

    const SectionTitle = ({n, children}) => (
        <h4 className="h5 d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-qrc">{n}</span> {children}
        </h4>
    );

    return (
        <div
            className={`modal modal-blur fade ${showHelperPopup ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!showHelperPopup}
            style={{backgroundColor: showHelperPopup ? "rgba(0,0,0,0.5)" : "transparent"}}
            onClick={(e) => e.target === e.currentTarget && close()}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title h3">Instructions</div>
                        <button type="button" className="btn-close" aria-label="Close" onClick={close}/>
                    </div>

                    <div className="modal-body">
                        <p className="text-muted mb-3">
                            Build pages by dragging blocks onto the canvas, then fine-tune each block in the
                            <strong> Inspector</strong>. Use shortcuts to work faster.
                        </p>

                        {/* 1. Quick start */}
                        <section className="mb-4">
                            <SectionTitle n="1">Quick start</SectionTitle>
                            <ol className="ps-3 mb-0">
                                <li className="mb-1"><strong>Add blocks:</strong> Use <em>Palettes</em> to insert
                                    blocks.
                                </li>
                                <li className="mb-1"><strong>Arrange:</strong> Drag blocks; blue bars show drop zones.
                                </li>
                                <li className="mb-1"><strong>Select:</strong> Click a block to open its props
                                    in <em>Inspector</em>.
                                </li>
                                <li className="mb-1"><strong>Edit:</strong> Use block props
                                    and <em>Advanced</em> (classes &amp; data-*).
                                </li>
                                <li className="mb-1"><strong>Preview:</strong> Toggle <em>Preview Mode</em>.</li>
                                <li className="mb-1"><strong>Save:</strong> Click <em>Save Changes</em> (or autosave if
                                    enabled).
                                </li>
                            </ol>
                        </section>

                        {/* 2. Drag & Drop */}
                        <section className="mb-4">
                            <SectionTitle n="2">Drag &amp; drop rules</SectionTitle>
                            <ul className="mb-0">
                                <li className="mb-1"><strong>Containers:</strong>
                                    <code>navbar</code>, <code>section</code>, <code>container</code>, <code>card</code>, <code>hero</code>, <code>row</code>, <code>col</code> accept
                                    children.
                                </li>
                                <li className="mb-1"><strong>Grid:</strong> Place <code>col</code> blocks inside
                                    a <code>row</code>; adjust <code>xs/sm/md/lg/xl</code> widths in Inspector.
                                </li>
                            </ul>
                        </section>

                        {/* 3. Inspector */}
                        <section className="mb-4">
                            <SectionTitle n="3">Inspector overview</SectionTitle>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h6 className="card-title mb-0">Block-specific props</h6>
                                        </div>
                                        <div className="card-body">
                                            <ul className="mb-0">
                                                <li className="mb-1"><code>hero</code>: background, overlay (0–1), min
                                                    height, align, text color.
                                                </li>
                                                <li className="mb-1"><code>navbar</code>: brand, sticky, background,
                                                    menu JSON.
                                                </li>
                                                <li className="mb-1"><code>row</code>: gutter <code>g-0…g-5</code>.</li>
                                                <li className="mb-1"><code>col</code>: responsive
                                                    widths <code>xs/sm/md/lg/xl</code>.
                                                </li>
                                                <li className="mb-1"><code>product</code>: image, title, price(s),
                                                    rating, buy button.
                                                </li>
                                                <li className="mb-1"><code>video</code>: src, poster, controls,
                                                    autoplay, loop, muted, width.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h6 className="card-title mb-0">Advanced</h6>
                                            <div className="card-subtitle text-secondary small">Consistent surface &
                                                spacing
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <ul className="mb-0">
                                                <li className="mb-1"><strong>classes:</strong> Add utility classes
                                                    (space/comma/Enter to add; × to remove).
                                                </li>
                                                <li className="mb-1"><strong>data-*:</strong> Key/value serialized
                                                    as <code>data-*</code> (strings or JSON).
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Media */}
                        <section className="mb-4">
                            <SectionTitle n="4">Media library &amp; uploads</SectionTitle>
                            <div className="card">
                                <div className="card-body">
                                    <ul className="mb-0">
                                        <li className="mb-1"><em>Pick from Library</em> to use an existing asset.</li>
                                        <li className="mb-1">Drag-drop or browse to upload; on success, the relevant URL
                                            prop is set.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 5. Shortcuts */}
                        <section className="mb-4">
                            <SectionTitle n="5">Keyboard shortcuts</SectionTitle>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-sm align-middle mb-0">
                                            <thead>
                                            <tr>
                                                <th style={{width: 220}}>Shortcut</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td><kbd>Ctrl/Cmd</kbd> + <kbd>C</kbd></td>
                                                <td>Copy selected block</td>
                                            </tr>
                                            <tr>
                                                <td><kbd>Ctrl/Cmd</kbd> + <kbd>V</kbd></td>
                                                <td>Paste (as child if container; otherwise after)</td>
                                            </tr>
                                            <tr>
                                                <td><kbd>Ctrl/Cmd</kbd> + <kbd>D</kbd></td>
                                                <td>Duplicate selected</td>
                                            </tr>
                                            <tr>
                                                <td><kbd>Delete</kbd>/<kbd>Backspace</kbd></td>
                                                <td>Delete selected</td>
                                            </tr>
                                            <tr>
                                                <td><kbd>Esc</kbd></td>
                                                <td>Close this help</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="small text-muted mt-2 mb-0">
                                        Shortcuts are disabled in Preview Mode and while typing.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Preview & Save */}
                        <section className="mb-4">
                            <SectionTitle n="6">Preview &amp; Save</SectionTitle>
                            <div className="card">
                                <div className="card-body">
                                    <ul className="mb-0">
                                        <li className="mb-1"><strong>Preview Mode</strong> hides editor chrome and
                                            disables editing.
                                        </li>
                                        <li className="mb-1"><strong>Save Changes</strong> calls the API to persist your
                                            changes.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 8. Block Catalog */}
                        <section className="mb-4">
                            <SectionTitle n="8">Block catalog</SectionTitle>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row g-2">
                                        {[
                                            "navbar", "heading", "text", "image", "video", "button", "product", "form",
                                            "container", "section", "card", "hero", "row", "col", "alert", "divider", "spacer",
                                        ].map((b) => (
                                            <div key={b} className="col-auto">
                                                <span className="badge bg-light border text-body">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="small text-muted mt-2 mb-0">Limit available blocks
                                        via <code>enabledBlocks</code>.</p>
                                </div>
                            </div>
                        </section>

                        {/* 9. Component patterns (ready to paste) */}
                        <section className="mb-2">
                            <h4 className="h5 d-flex align-items-center gap-2 mb-3">
                                Component patterns (ready to paste)
                            </h4>

                            <SnippetCard
                                title="Carousel (required pattern)"
                                subtitle="IDs must match; one active indicator and one active item; images use .d-block .w-100; add data-bs-ride='carousel' to auto-cycle."
                            >
                                <ul className="small text-muted mb-2">
                                    <li><strong>ID pairing:</strong> wrapper <code>id</code> matches
                                        all <code>data-bs-target</code> values.
                                    </li>
                                    <li><strong>Single active:</strong> exactly one <code>.active</code> on an indicator
                                        and the matching <code>.carousel-item</code>.
                                    </li>
                                    <li><strong>Aspect ratio (optional):</strong> wrap
                                        in <code>div.ratio.ratio-21x9</code> to lock height.
                                    </li>
                                </ul>
                                <CodeBlock code={`<div id="carousel-indicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carousel-indicators" data-bs-slide-to="0"></button>
    <button type="button" data-bs-target="#carousel-indicators" data-bs-slide-to="1"></button>
    <button type="button" data-bs-target="#carousel-indicators" data-bs-slide-to="2"></button>
    <button type="button" data-bs-target="#carousel-indicators" data-bs-slide-to="3" class="active" aria-current="true"></button>
    <button type="button" data-bs-target="#carousel-indicators" data-bs-slide-to="4"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item">
      <img class="d-block w-100" alt="" src="./static/photos/home-office-desk-with-macbook-iphone-calendar-watch-and-organizer.jpg">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" alt="" src="./static/photos/young-woman-working-in-a-cafe.jpg">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" alt="" src="./static/photos/everything-you-need-to-work-from-your-bed.jpg">
    </div>
    <div class="carousel-item active">
      <img class="d-block w-100" alt="" src="./static/photos/young-entrepreneur-working-from-a-modern-cafe.jpg">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" alt="" src="./static/photos/finances-us-dollars-and-bitcoins-currency-money-2.jpg">
    </div>
  </div>
</div>`}/>
                                <p className="small text-muted mb-0">
                                    <strong>How to insert:</strong> Add a <code>section</code> (optional)
                                    → <code>row</code> → <code>col</code> → a <code>text</code> block, then paste this
                                    HTML.
                                </p>
                            </SnippetCard>

                            <SnippetCard
                                title="Banner / Hero"
                                subtitle="Background image + overlay using utilities; pairs well with the Hero block props."
                            >
                                <CodeBlock code={`<div class="position-relative d-flex align-items-center text-white"
     style="min-height:420px;background-image:url(…);background-size:cover;background-position:center;">
  <div class="position-absolute top-0 start-0 w-100 h-100" style="background:rgba(0,0,0,.4)"></div>
  <div class="container position-relative text-center">
    <h1 class="mb-2">Your headline</h1>
    <p class="lead mb-3">Supporting copy</p>
    <div class="btn-list">
      <a class="btn btn-primary">Get started</a>
      <a class="btn">Learn more</a>
    </div>
  </div>
</div>`}/>
                                <p className="small text-muted mb-0">
                                    <strong>How to insert:</strong> Use the <code>hero</code> block (preferred) or paste
                                    this into a <code>text</code> block.
                                </p>
                            </SnippetCard>

                            <SnippetCard
                                title="Buttons (groups & variants)"
                                subtitle='Use ".btn" color variants; group with ".btn-list" for neat spacing.'
                            >
                                <CodeBlock code={`<div class="btn-list">
  <a class="btn btn-primary">Primary</a>
  <a class="btn btn-success">Confirm</a>
  <a class="btn btn-danger">Delete</a>
</div>`}/>
                                <p className="small text-muted mb-0">
                                    <strong>How to insert:</strong> Use the <code>button</code> block for single
                                    buttons, or paste this into a <code>text</code> block for grouped actions.
                                </p>
                            </SnippetCard>

                            <SnippetCard
                                title="Alerts (dismissible)"
                                subtitle='Add ".alert-dismissible" and a ".btn-close" button to allow closing.'
                            >
                                <CodeBlock code={`<div class="alert alert-success alert-dismissible" role="alert">
  Saved successfully!
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`}/>
                                <p className="small text-muted mb-0">
                                    <strong>How to insert:</strong> Use the <code>alert</code> block (configure
                                    variant), or paste this HTML into a <code>text</code> block.
                                </p>
                            </SnippetCard>

                            <SnippetCard
                                title="Images (responsive & selectable)"
                                subtitle='Use ".img-fluid" for responsive images. Optional "image check" pattern for selectable grids.'
                            >
                                <CodeBlock code={`<img src="..." class="img-fluid rounded" alt="">

<!-- Selectable image pattern -->
<label class="form-imagecheck">
  <input class="form-imagecheck-input" type="checkbox" />
  <span class="form-imagecheck-figure">
    <img src="..." class="form-imagecheck-image" alt="">
  </span>
</label>`}/>
                                <p className="small text-muted mb-0">
                                    <strong>How to insert:</strong> Use the <code>image</code> block (preferred) or
                                    paste markup in a <code>text</code> block.
                                </p>
                            </SnippetCard>
                        </section>

                        {/* FAQ */}
                        <section className="mt-3">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0"><span
                                        className="badge bg-secondary me-2">FAQ</span> Troubleshooting</h6>
                                </div>
                                <div className="card-body">
                                    <ul className="mb-0">
                                        <li className="mb-1"><strong>Can’t drop?</strong> Ensure the target is a
                                            container; for grid, use <code>row</code> → <code>col</code>.
                                        </li>
                                        <li className="mb-1"><strong>Classes not sticking?</strong> In <em>classes</em>,
                                            press space/comma/Enter to commit tokens.
                                        </li>
                                        <li className="mb-1"><strong>Navbar menu invalid?</strong> Fix JSON in the
                                            textarea; invalid JSON is ignored.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={close}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageBuilderHelpModal;
