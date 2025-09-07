import CampaignSettingsTab from "./CampaignSettingsTab";
import CampaignActionDataTab from "./CampaignActionDataTab";
import {useEffect, useRef, useState} from "react";
import {IconSettings, IconDatabase, IconChevronRight, IconChevronLeft} from "@tabler/icons-react";

const TABS = [
    {
        key: "settings",
        label: (
            <>
                <IconSettings size={18} className="me-2"/> Settings
            </>
        ),
        render: (project) => <CampaignSettingsTab project={project}/>,
    },
    {
        key: "action-event-data",
        label: (
            <>
                <IconDatabase size={18} className="me-2"/> Action Event Data
            </>
        ),
        render: (project) => <CampaignActionDataTab project={project}/>,
    },
    {
        key: "post-action-event-data",
        label: (
            <>
                <IconDatabase size={18} className="me-2"/> Post Action Event Data
            </>
        ),
        render: (project) => <CampaignActionDataTab/>,
    },
    // Add more tabs for testing!
];

const CampaignOverviewTab = ({project}) => {
    const [activeTab, setActiveTab] = useState("settings");
    const [isClient, setIsClient] = useState(false);

    // For edge fades and scroll arrows
    const scrollRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        canScrollLeft: false,
        canScrollRight: false,
    });

    // Helper to check scroll state and update fades/arrows
    const updateScrollState = () => {
        const node = scrollRef.current;
        if (!node) return;
        setScrollState({
            canScrollLeft: node.scrollLeft > 2,
            canScrollRight: node.scrollLeft + node.offsetWidth < node.scrollWidth - 2,
        });
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        updateScrollState();
        if (!scrollRef.current) return;
        const node = scrollRef.current;
        node.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);
        return () => {
            node.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [isClient]);

    // Optional: Helper label on mobile for 2 seconds
    const [showScrollHint, setShowScrollHint] = useState(false);
    useEffect(() => {
        if (!isClient) return;
        if (window.innerWidth < 768 && scrollState.canScrollRight) {
            setShowScrollHint(true);
            const t = setTimeout(() => setShowScrollHint(false), 2200);
            return () => clearTimeout(t);
        }
        setShowScrollHint(false);
    }, [scrollState.canScrollRight, isClient]);

    if (!isClient) {
        return (
            <div className="card-body text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Optional: manual scroll on chevron click
    const scrollBy = (offset) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({left: offset, behavior: "smooth"});
    };

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="row row-cards">
                        <div className="col-12">
                            <div className="card shadow border-0" style={{borderRadius: 16}}>
                                <div className="card-header bg-white border-bottom-0">
                  <span className="h2 mb-0" style={{color: "#214a3b", fontWeight: 700}}>
                    {project.name}'s Overview
                  </span>
                                </div>
                                <div className="card-body position-relative">
                                    {/* Fade left/right overlays for scrollable tabs */}
                                    {scrollState.canScrollLeft && (
                                        <div
                                            className="custom-tabs-fade custom-tabs-fade-left"
                                            style={{
                                                left: 0,
                                                background: "linear-gradient(90deg, #fff 75%, #fff0 100%)",
                                            }}
                                        />
                                    )}
                                    {scrollState.canScrollRight && (
                                        <div
                                            className="custom-tabs-fade custom-tabs-fade-right"
                                            style={{
                                                right: 0,
                                                background: "linear-gradient(-90deg, #fff 75%, #fff0 100%)",
                                            }}
                                        />
                                    )}
                                    {/* Chevron arrows for mobile */}
                                    {scrollState.canScrollLeft && (
                                        <button
                                            className="custom-tabs-chevron custom-tabs-chevron-left"
                                            aria-label="Scroll tabs left"
                                            onClick={() => scrollBy(-120)}
                                        >
                                            <IconChevronLeft size={20}/>
                                        </button>
                                    )}
                                    {scrollState.canScrollRight && (
                                        <button
                                            className="custom-tabs-chevron custom-tabs-chevron-right"
                                            aria-label="Scroll tabs right"
                                            onClick={() => scrollBy(120)}
                                        >
                                            <IconChevronRight size={20}/>
                                        </button>
                                    )}

                                    {/* Tabs row (scrollable) */}
                                    <div
                                        ref={scrollRef}
                                        className="custom-tabs-scroll mb-4"
                                        style={{
                                            display: "flex",
                                            overflowX: "auto",
                                            gap: 4,
                                            borderBottom: "1px solid #eaeaea",
                                            scrollbarWidth: "thin",
                                            position: "relative",
                                            zIndex: 2,
                                            paddingBottom: 2,
                                            scrollBehavior: "smooth",
                                        }}
                                    >
                                        {TABS.map((tab) => (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                className={`btn btn-link px-4 py-2 fw-semibold border-0 border-bottom ${
                                                    activeTab === tab.key
                                                        ? "text-primary border-primary border-3"
                                                        : "text-secondary"
                                                }`}
                                                style={{
                                                    background: "none",
                                                    fontSize: "1.08rem",
                                                    borderRadius: 0,
                                                    outline: "none",
                                                    minWidth: 120,
                                                    whiteSpace: "nowrap",
                                                    flex: "0 0 auto",
                                                    transition: "color 0.16s",
                                                }}
                                                onClick={() => setActiveTab(tab.key)}
                                                tabIndex={0}
                                                aria-current={activeTab === tab.key}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Hint label (mobile only, fade out) */}
                                    {showScrollHint && (
                                        <div
                                            className="small"
                                            style={{
                                                position: "absolute",
                                                right: 8,
                                                top: 6,
                                                background: "#214a3be0",
                                                color: "#fff",
                                                borderRadius: 14,
                                                padding: "2px 12px",
                                                fontSize: "0.93rem",
                                                opacity: 0.97,
                                                pointerEvents: "none",
                                                zIndex: 15,
                                                boxShadow: "0 2px 8px #214a3b22",
                                            }}
                                        >
                                            <IconChevronRight size={16} style={{verticalAlign: "-2px"}}/> Scroll for
                                            more tabs
                                        </div>
                                    )}

                                    <div className="tab-content mt-3">
                                        {TABS.map(
                                            (tab) =>
                                                tab.key === activeTab && (
                                                    <div key={tab.key} className="tab-pane active show">
                                                        {tab.render(project)}
                                                    </div>
                                                )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .btn-link.text-primary {
                    color: #214a3b !important;
                }

                .btn-link.text-secondary {
                    color: #6c757d !important;
                }

                .btn-link:focus {
                    outline: 2px solid #214a3b2c;
                }

                .custom-tabs-scroll {
                    scrollbar-width: thin;
                }

                .custom-tabs-scroll::-webkit-scrollbar {
                    height: 6px;
                }

                .custom-tabs-scroll::-webkit-scrollbar-thumb {
                    background: #eaeaea;
                    border-radius: 3px;
                }

                /* Fading overlays for scroll edges */
                .custom-tabs-fade {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 36px;
                    z-index: 10;
                    pointer-events: none;
                }

                .custom-tabs-fade-left {
                    left: 0;
                }

                .custom-tabs-fade-right {
                    right: 0;
                }

                /* Chevron arrows */
                .custom-tabs-chevron {
                    position: absolute;
                    top: 6px;
                    background: #fff;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 1px 8px #214a3b10;
                    z-index: 12;
                    color: #214a3b;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.92;
                    cursor: pointer;
                }

                .custom-tabs-chevron-left {
                    left: 6px;
                }

                .custom-tabs-chevron-right {
                    right: 6px;
                }

                @media (max-width: 768px) {
                    .custom-tabs-scroll {
                        gap: 0.25rem;
                    }

                    .btn-link {
                        font-size: 1rem !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }

                    .custom-tabs-chevron,
                    .custom-tabs-fade {
                        top: 2px;
                        height: 36px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CampaignOverviewTab;
