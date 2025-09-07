import {useEffect} from "react";

export function OffCanvas({open, onClose, title, children}) {
    useEffect(() => {
        if (!open) return;

        function handleEsc(e) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    return (
        <>
            <div
                className={`offcanvas-backdrop${open ? " show" : ""}`}
                onClick={onClose}
                tabIndex={-1}
                aria-hidden={!open}
            />
            <aside
                className={`offcanvas-drawer${open ? " open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="offcanvas-title"
                onClick={e => e.stopPropagation()}
            >
                <div className="offcanvas-header" style={{background: "#214a3b", color: "#fff"}}>
                    <div id="offcanvas-title" className="fw-bold">{title}</div>
                    <button
                        aria-label="Close"
                        className="offcanvas-close"
                        onClick={onClose}
                        style={{
                            border: "none", background: "transparent", color: "#fff", fontSize: "2em", marginLeft: 8
                        }}
                    >&times;</button>
                </div>
                <div className="offcanvas-body">{children}</div>
            </aside>
            <style jsx global>{`
                .offcanvas-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.13);
                    z-index: 1050;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.21s;
                }

                .offcanvas-backdrop.show {
                    opacity: 1;
                    pointer-events: auto;
                }

                .offcanvas-drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 96vw;
                    max-width: 420px;
                    height: 100vh;
                    background: #fff;
                    z-index: 11000;
                    box-shadow: -2px 0 40px rgba(33, 74, 59, 0.13);
                    border-top-left-radius: 18px;
                    border-bottom-left-radius: 18px;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(100%);
                    transition: transform 0.26s cubic-bezier(0.55, 0, 0.45, 1);
                }

                .offcanvas-drawer.open {
                    transform: translateX(0);
                }

                .offcanvas-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.1em 1.5em 1.1em 1.3em;
                    font-size: 1.25em;
                    border-top-left-radius: 18px;
                }

                .offcanvas-close {
                    cursor: pointer;
                }

                .offcanvas-body {
                    padding: 1.5em;
                    overflow-y: auto;
                    flex: 1;
                }

                @media (max-width: 600px) {
                    .offcanvas-drawer {
                        max-width: 99vw;
                        border-radius: 0;
                    }

                    .offcanvas-header {
                        font-size: 1.1em;
                        padding: 1em 1em 1em 1em;
                    }

                    .offcanvas-body {
                        padding: 1em;
                    }
                }
            `}</style>
        </>
    );
}
