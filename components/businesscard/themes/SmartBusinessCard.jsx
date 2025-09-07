import React from "react";
import {
    IconMail,
    IconPhone,
    IconWorld,
    IconMapPin,
    IconDownload,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandWhatsapp,
    IconLink,
} from "@tabler/icons-react";

// Map type to icon
const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
};

export default function SmartBusinessCard({
                                              firstName,
                                              lastName,
                                              jobTitle,
                                              companyName,
                                              companyTagline,
                                              email,
                                              phone,
                                              website,
                                              address,
                                              avatarUrl,
                                              socialLinks = [],
                                              onDownload, // optional, for vCard button
                                              primaryColor = "#214a3b",
                                              secondaryColor = "#13e183",
                                          }) {
    // Header fields with spacing
    const headerFields = [
        <div key="name" style={{
            fontWeight: 800, fontSize: 24, color: primaryColor, lineHeight: 1.08, letterSpacing: "-0.01em"
        }}>
            {firstName} <span style={{fontWeight: 700}}>{lastName}</span>
        </div>,
        jobTitle && (
            <div key="title" style={{
                color: "#8fa1b1", fontWeight: 600, fontSize: 15, lineHeight: 1.18, letterSpacing: "0.01em"
            }}>{jobTitle}</div>
        ),
        companyName && (
            <div key="company" style={{
                color: primaryColor, fontWeight: 700, fontSize: 15.2, letterSpacing: "0.01em"
            }}>{companyName}</div>
        ),
        companyTagline && (
            <div key="tagline" style={{
                color: secondaryColor, fontWeight: 600, fontSize: 15, lineHeight: 1.26, letterSpacing: "0.01em"
            }}>
                {companyTagline}
            </div>
        )
    ].filter(Boolean);

    return (
        <div
            style={{
                maxWidth: 410,
                margin: "40px auto",
                borderRadius: 22,
                boxShadow: "0 12px 36px 0 rgba(33,74,59,0.09)",
                background: "#fff",
                overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
                border: "none"
            }}
        >
            {/* Top Bar */}
            <div
                style={{
                    height: 7,
                    background: `linear-gradient(90deg,${secondaryColor} 0%,${primaryColor} 100%)`
                }}
            />
            {/* Header Section */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                    padding: "34px 30px 16px 30px",
                    background: secondaryColor + "10" // 10% opacity for subtle bg
                }}
            >
                <img
                    src={avatarUrl}
                    alt="Logo"
                    style={{
                        width: 62,
                        height: 62,
                        borderRadius: "50%",
                        background: "#fff",
                        border: `3px solid ${secondaryColor}30`, // 30% opacity
                        boxShadow: "0 2px 8px 0 rgba(33,74,59,0.09)",
                        marginRight: 0,
                        objectFit: "cover"
                    }}
                />
                <div style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 7
                }}>
                    {headerFields}
                </div>
            </div>
            {/* Divider */}
            <div style={{borderTop: "1.5px solid #eaf3f0", margin: 0}}></div>
            {/* Details */}
            <div className="px-4 pt-3 pb-2" style={{background: "#fff", padding: "22px 30px 16px 30px"}}>
                <div className="mb-2 d-flex align-items-center" style={{fontSize: 16}}>
                    <IconMail size={18} style={{marginRight: 10, color: primaryColor}}/>
                    <span style={{fontWeight: 600}}>{email}</span>
                </div>
                <div className="mb-2 d-flex align-items-center" style={{fontSize: 16}}>
                    <IconPhone size={18} style={{marginRight: 10, color: primaryColor}}/>
                    <span style={{fontWeight: 600}}>{phone}</span>
                </div>
                {website && (
                    <div className="mb-2 d-flex align-items-center" style={{fontSize: 16}}>
                        <IconWorld size={18} style={{marginRight: 10, color: primaryColor}}/>
                        <span style={{fontWeight: 600}}>{website}</span>
                    </div>
                )}
                {address && (
                    <div className="mb-1 d-flex align-items-center" style={{fontSize: 16}}>
                        <IconMapPin size={18} style={{marginRight: 10, color: primaryColor}}/>
                        <span style={{fontWeight: 600}}>{address}</span>
                    </div>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div style={{
                        margin: "20px 0 8px 0",
                        padding: "6px 0 0 0",
                        borderTop: "1px dashed #e7f6ee",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        justifyContent: "flex-start"
                    }}>
                        {socialLinks.slice(0, 5).map((link, i) => {
                            if (!link.url) return null;
                            const Icon = SOCIAL_ICON_MAP[link.type] || IconLink;
                            let url = link.url;
                            if (link.type === "whatsapp") {
                                url = `https://wa.me/${link.url}`
                            } else {
                                if (!/^https?:\/\//i.test(url)) url = "https://" + url;
                            }

                            let displayLabel =
                                link.type === "custom"
                                    ? (link.url.length > 18 ? link.url.slice(0, 18) + "…" : link.url)
                                    : link.type.charAt(0).toUpperCase() + link.type.slice(1);
                            return (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.type}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 7,
                                        background: secondaryColor + "18", // lighter accent
                                        color: primaryColor,
                                        borderRadius: 18,
                                        padding: "6px 14px 6px 11px",
                                        fontWeight: 500,
                                        fontSize: 15.2,
                                        textDecoration: "none",
                                        boxShadow: "0 1px 5px 0 #0001",
                                        border: `1.5px solid ${secondaryColor}22`,
                                        transition: "background .15s,border .15s",
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = secondaryColor + "28"}
                                    onMouseOut={e => e.currentTarget.style.background = secondaryColor + "18"}
                                >
                                    <Icon size={17}/>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 120
                                    }}>{displayLabel}</span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Download Button (optional) */}
            {onDownload && (
                <div className="pb-4 pt-2 px-4" style={{background: "transparent"}}>
                    <button
                        className="btn"
                        type="button"
                        style={{
                            width: "100%",
                            background: `linear-gradient(90deg,${secondaryColor} 0%,${primaryColor} 100%)`,
                            color: "white",
                            fontWeight: 700,
                            fontSize: 19,
                            borderRadius: 13,
                            boxShadow: `0 1.5px 8px 0 ${secondaryColor}22`,
                            padding: "13px 0",
                            letterSpacing: "-0.01em",
                            border: "none",
                            outline: "none",
                            marginTop: 8,
                            cursor: "pointer",
                            transition: "background .18s"
                        }}
                        onClick={onDownload}
                    >
                        <IconDownload size={19} className="me-2"/>
                        Download vCard
                    </button>
                </div>
            )}
        </div>
    );
}
