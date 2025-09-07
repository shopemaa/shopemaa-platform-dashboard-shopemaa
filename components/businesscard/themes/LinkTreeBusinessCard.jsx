import React from "react";
import {
    IconMail,
    IconPhone,
    IconWorld,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandWhatsapp,
    IconLink,
} from "@tabler/icons-react";

const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
    email: IconMail,
    phone: IconPhone,
};

export default function LinkTreeBusinessCard({
                                               firstName,
                                               lastName,
                                               jobTitle,
                                               companyName,
                                               companyTagline,
                                               avatarUrl,
                                               socialLinks = [],         // [{type, url, label?}]
                                               primaryColor = "#214a3b", // Text/accent color
                                               secondaryColor = "#13e183", // Buttons, backgrounds
                                           }) {
    // Extra: handle empty state
    const fullLinks = [...socialLinks];

    return (
        <div style={{
            maxWidth: 430,
            margin: "65px auto",
            borderRadius: 28,
            background: "#fff",
            padding: "0",
            fontFamily: "'Inter',sans-serif",
            border: "none",
            boxShadow: "0 10px 44px 0 rgba(33,74,59,0.12)",
            position: "relative",
            overflow: "visible",
            transition: "box-shadow .22s, transform .19s",
        }}
             className="catchy-linktree-card"
        >
            {/* Gradient “halo” border */}
            <span
                style={{
                    position: "absolute",
                    inset: -5,
                    borderRadius: 33,
                    zIndex: 1,
                    background: `linear-gradient(120deg,${secondaryColor}55 8%,${primaryColor}38 96%)`,
                    filter: "blur(8px)",
                    opacity: 0.34,
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 40,
                paddingBottom: 18,
                position: "relative",
                zIndex: 2,
            }}>
                {/* Animated gradient behind avatar */}
                <div style={{
                    position: "relative",
                    marginBottom: 9,
                    width: 90, height: 90,
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <span style={{
                        position: "absolute",
                        top: -8, left: -8,
                        width: 106, height: 106,
                        borderRadius: "50%",
                        background: `conic-gradient(from 90deg at 50% 50%, ${secondaryColor}22 0%, ${primaryColor}19 65%, ${secondaryColor}15 100%)`,
                        filter: "blur(2.5px)",
                        zIndex: 1,
                        animation: "halo-spin 4.2s linear infinite"
                    }}/>
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{
                            width: 82,
                            height: 82,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `3.5px solid ${secondaryColor}`,
                            background: "#fff",
                            zIndex: 2,
                            boxShadow: "0 6px 28px 0 #13e18320"
                        }}
                    />
                </div>
                <div style={{
                    fontWeight: 900,
                    fontSize: 25,
                    color: primaryColor,
                    lineHeight: 1.09,
                    letterSpacing: "-0.01em",
                    marginBottom: 2,
                }}>
                    {firstName} <span style={{fontWeight: 700}}>{lastName}</span>
                </div>
                {jobTitle && (
                    <div style={{
                        fontWeight: 600,
                        color: "#8fa1b1",
                        fontSize: 14.5,
                        marginBottom: 0
                    }}>{jobTitle}</div>
                )}
                {companyName && (
                    <div style={{
                        fontWeight: 700,
                        color: primaryColor,
                        fontSize: 15.4,
                        marginTop: 7,
                    }}>{companyName}</div>
                )}
                {companyTagline && (
                    <div style={{
                        color: secondaryColor,
                        fontWeight: 600,
                        fontSize: 15.6,
                        marginTop: 3,
                        marginBottom: 2,
                        letterSpacing: "0.01em",
                        textShadow: `0 2px 6px ${secondaryColor}33`
                    }}>{companyTagline}</div>
                )}
            </div>
            {/* Link Buttons */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 21,
                padding: "33px 26px 38px 26px",
                background: "#f6fbf9",
                borderRadius: "0 0 28px 28px",
                position: "relative",
                zIndex: 2,
            }}>
                {fullLinks.length === 0 && (
                    <div style={{color: "#a8b5ad", fontWeight: 500, fontSize: 16, textAlign: "center", margin: "44px 0"}}>
                        No links added yet.
                    </div>
                )}
                {fullLinks.slice(0, 5).map((link, idx) => {
                    if (!link.url) return null;
                    const Icon = SOCIAL_ICON_MAP[link.type] || IconLink;
                    let url = link.url;
                    if (link.type === "whatsapp") {
                        url = `https://wa.me/${link.url}`
                    } else if (link.type === "phone") {
                        url = `tel:${link.url}`;
                    } else if (link.type === "email") {
                        url = `mailto:${link.url}`;
                    } else {
                        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
                    }

                    let displayLabel =
                        link.label ||
                        (link.type === "custom"
                            ? (link.url.length > 18 ? link.url.slice(0, 18) + "…" : link.url)
                            : link.type.charAt(0).toUpperCase() + link.type.slice(1));
                    return (
                        <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 15,
                                background: `linear-gradient(92deg,${secondaryColor}23 0%,${primaryColor}0a 100%)`,
                                color: primaryColor,
                                borderRadius: 17,
                                padding: "18px 20px",
                                fontWeight: 800,
                                fontSize: 19,
                                textDecoration: "none",
                                boxShadow: "0 5px 19px 0 #214a3b12, 0 2px 8px 0 #13e18319",
                                border: `1.8px solid ${secondaryColor}28`,
                                transition: "transform .16s, background .18s, box-shadow .18s",
                                minHeight: 56,
                                letterSpacing: "-0.005em",
                                cursor: "pointer",
                                willChange: "transform,background"
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = `linear-gradient(90deg,${secondaryColor}28 0%,${primaryColor}19 100%)`
                                e.currentTarget.style.transform = "translateY(-3px) scale(1.035)"
                                e.currentTarget.style.boxShadow = "0 11px 30px 0 #13e18322, 0 3px 13px 0 #214a3b12";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = `linear-gradient(92deg,${secondaryColor}23 0%,${primaryColor}0a 100%)`
                                e.currentTarget.style.transform = "none"
                                e.currentTarget.style.boxShadow = "0 5px 19px 0 #214a3b12, 0 2px 8px 0 #13e18319";
                            }}
                        >
                            <Icon size={23}/>
                            <span style={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}>{displayLabel}</span>
                        </a>
                    );
                })}
            </div>
            {/* Animation keyframes */}
            <style>{`
                @keyframes halo-spin {
                    0% { transform: rotate(0deg);}
                    100% {transform: rotate(360deg);}
                }
                .catchy-linktree-card:hover {
                    box-shadow: 0 22px 44px 0 #214a3b21, 0 8px 40px 0 #13e18322;
                    transform: translateY(-4px) scale(1.022);
                }
            `}</style>
        </div>
    );
}
