import {useRouter} from "next/router";
import {mapProjectTypeToResourceUrl} from "../../helpers/helpers";
import {useState} from "react";
import CreateProjectModal from "../project/CreateProjectModal";

const BRAND_COLOR = "#214a3b";

const FEATURES = [
    {
        name: "Website",
        type: "UniText",
        sub_type: "URL",
        description: "Link to any website.",
        icon: "/svgs/link.svg",
    },
    {
        name: "WhatsApp",
        type: "UniText",
        sub_type: "WHATSAPP",
        description: "Connect to your WhatsApp.",
        icon: "/svgs/whatsapp.svg",
    },
    {
        name: "Business Card",
        type: "BusinessCard",
        sub_type: "",
        description: "Share a digital business card.",
        icon: "/svgs/vcard.svg",
    },
    {
        name: "Campaign",
        type: "Campaign",
        sub_type: "",
        description: "Run campaigns with redeemable offers or actions.",
        icon: "/svgs/megaphone.svg",
    },
    {
        name: "One Page",
        type: "OnePage",
        description: "Build a beautiful, mobile-first landing page.",
        icon: "/svgs/paintbrush.svg"
    },
    {
        name: "Restaurant Menu",
        type: "RestaurantMenu",
        description: "Mobile-first menu for restaurants.",
        icon: "/svgs/utensils.svg"
    },
    {
        name: "Facebook",
        type: "UniText",
        sub_type: "FACEBOOK",
        description: "Link to your Facebook page.",
        icon: "/svgs/facebook.svg"
    },
    {
        name: "X",
        type: "UniText",
        sub_type: "TWITTER",
        description: "Link to your Twitter profile.",
        icon: "/svgs/x.svg"
    },
    {
        name: "Instagram",
        type: "UniText",
        sub_type: "INSTAGRAM",
        description: "Link to your Instagram profile.",
        icon: "/svgs/instagram.svg"
    },
    {
        name: "TikTok",
        type: "UniText",
        sub_type: "TIKTOK",
        description: "Link to your TikTok profile.",
        icon: "/svgs/tiktok.svg"
    },
    {
        name: "Youtube",
        type: "UniText",
        sub_type: "YOUTUBE",
        description: "Link to your Youtube profile.",
        icon: "/svgs/youtube.svg"
    },
    {
        name: "Pinterest",
        type: "UniText",
        sub_type: "PINTEREST",
        description: "Link to your Pinterest profile.",
        icon: "/svgs/pinterest.svg"
    }
];

export default function QrCodeCreate() {
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [projectType, setProjectType] = useState(null);
    const router = useRouter();

    const onTypeSelect = (selectedType) => {
        setProjectType(selectedType);
        setShowCreateProjectModal(true);
    };

    const onProjectCreateSuccess = (resp) => {
        let projectId = resp.data.id;
        let navigationUrl = `/${mapProjectTypeToResourceUrl(projectType.type)}/${projectId}`;
        if (projectType.sub_type && projectType.sub_type !== "") {
            navigationUrl += `?type=${projectType.sub_type}`;
        }
        router.push(navigationUrl);
    };

    return (
        <>
            <CreateProjectModal
                show={showCreateProjectModal}
                onClose={() => setShowCreateProjectModal(false)}
                projectType={projectType}
                onSuccess={onProjectCreateSuccess}
                onFailure={(err) => console.log(err)}
            />

            <div
                style={{
                    background: "#f7f8fa",
                    minHeight: "100vh",
                    fontFamily: "Segoe UI, sans-serif",
                }}>
                <div className="container-xl py-5">
                    <div className="mb-4">
                        <h1
                            className="fw-bold mb-1">
                            What kind of QR Code do you need?
                        </h1>
                        <div className="text-muted">
                            Select based on your use-case.
                        </div>
                    </div>

                    <div className="row g-4 align-items-stretch">
                        <div className="col-12 col-lg-8">
                            <div className="row g-4">
                                {FEATURES.map((feature) => (
                                    <div
                                        className="col-12 col-md-6 col-xl-4 d-flex"
                                        key={feature.type + feature.sub_type}>
                                        <button
                                            className="feature-card flex-grow-1"
                                            style={{
                                                background: "#fff",
                                                border: "none",
                                                boxShadow: "0 3px 18px #dbf3e31a",
                                                borderRadius: 18,
                                                width: "100%",
                                                padding: "28px 18px 22px 18px",
                                                cursor: "pointer",
                                                transition: "box-shadow .16s, transform .14s",
                                                textAlign: "left",
                                                minHeight: 148,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                outline: "none",
                                            }}
                                            onClick={() => onTypeSelect(feature)}>
                                            <div
                                                style={{
                                                    background: "#eafaf1",
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 12,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginBottom: 18,
                                                }}>
                                                <img
                                                    src={feature.icon}
                                                    alt={feature.name}
                                                    style={{
                                                        width: 26,
                                                        height: 26,
                                                        objectFit: "contain",
                                                    }}
                                                />
                                            </div>
                                            <div className={'h3 text-primary'}>
                                                {feature.name}
                                            </div>
                                            <div>
                                                {feature.description}
                                            </div>
                                            <div style={{flexGrow: 1}}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-4 d-none d-lg-flex align-items-center">
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: 18,
                                    boxShadow: "0 3px 18px #dbf3e326",
                                    minHeight: 380,
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <div
                                    style={{
                                        width: 280,
                                        height: 520,
                                        backgroundImage: "url(/static/dummy_mobile_mockup.png)",
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Card/hover styles */}
            <style jsx>{`
                .feature-card:focus,
                .feature-card:hover {
                    box-shadow: 0 8px 32px #7cdfb820 !important;
                    transform: translateY(-2px) scale(1.012);
                    border-color: #214a3b22 !important;
                }

                @media (max-width: 991px) {
                    .feature-card {
                        min-height: 108px !important;
                        padding: 20px 10px 16px 10px !important;
                    }
                }

                @media (max-width: 600px) {
                    .feature-card {
                        font-size: 1em !important;
                    }
                }
            `}</style>
        </>
    );
}
