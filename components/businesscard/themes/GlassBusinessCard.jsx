import React from "react";
import {
    IconMail,
    IconPhone,
    IconWorld,
    IconMapPin,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandWhatsapp,
    IconLink,
} from "@tabler/icons-react";

// Map social type to icon
const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
};

export default function GlassBusinessCard({
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
                                              primaryColor = "#214a3b",
                                              secondaryColor = "#13e183",
                                          }) {
    return (
        <div
            style={{
                maxWidth: 400,
                margin: "44px auto",
                borderRadius: 24,
                boxShadow: "0 14px 50px 0 rgba(33,74,59,0.14)",
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(13px)",
                border: "1.7px solid #e8ecec",
                padding: "0 0 20px 0",
                position: "relative",
                overflow: "visible",
            }}
        >
            {/* Floating Avatar */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: -44,
                    transform: "translateX(-50%)",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: 6,
                    boxShadow: `0 6px 30px 0 ${primaryColor}19`,
                    zIndex: 2,
                }}
            >
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{
                        width: 84,
                        height: 84,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2.5px solid ${secondaryColor}`,
                    }}
                />
            </div>
            {/* Header */}
            <div
                style={{
                    textAlign: "center",
                    paddingTop: 60,
                    paddingBottom: 14,
                    borderRadius: "24px 24px 0 0",
                    background: `linear-gradient(90deg,${primaryColor}0F 0%,${secondaryColor}08 100%)`
                }}
            >
                <div
                    style={{
                        fontWeight: 900,
                        fontSize: 23.5,
                        color: primaryColor,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.11,
                        marginBottom: 2
                    }}
                >
                    {firstName} <span style={{fontWeight: 700, color: "#192b1f"}}>{lastName}</span>
                </div>
                {jobTitle && (
                    <div style={{
                        fontWeight: 600,
                        fontSize: 15.7,
                        color: "#4b625e",
                        letterSpacing: "0.02em"
                    }}>{jobTitle}</div>
                )}
                {companyName && (
                    <div style={{
                        fontWeight: 700,
                        color: primaryColor,
                        fontSize: 15.7,
                        marginBottom: 3,
                    }}>
                        {companyName}
                    </div>
                )}
                {companyTagline && (
                    <div style={{
                        color: secondaryColor,
                        fontWeight: 500,
                        fontSize: 13.9,
                        marginBottom: 2,
                        marginTop: 3,
                    }}>
                        {companyTagline}
                    </div>
                )}
            </div>
            {/* Details */}
            <div style={{
                padding: "18px 25px 10px 25px",
                display: "flex",
                flexDirection: "column",
                gap: 9,
                alignItems: "flex-start"
            }}>
                {email && (
                    <div style={{fontSize: 15.2, color: primaryColor, display: "flex", alignItems: "center"}}>
                        <IconMail size={17} style={{marginRight: 9}}/>
                        <span style={{fontWeight: 600}}>{email}</span>
                    </div>
                )}
                {phone && (
                    <div style={{fontSize: 15.2, color: primaryColor, display: "flex", alignItems: "center"}}>
                        <IconPhone size={17} style={{marginRight: 9}}/>
                        <span style={{fontWeight: 600}}>{phone}</span>
                    </div>
                )}
                {website && (
                    <div style={{fontSize: 15.2, color: primaryColor, display: "flex", alignItems: "center"}}>
                        <IconWorld size={17} style={{marginRight: 9}}/>
                        <span style={{fontWeight: 600}}>{website}</span>
                    </div>
                )}
                {address && (
                    <div style={{fontSize: 15.2, color: primaryColor, display: "flex", alignItems: "center"}}>
                        <IconMapPin size={17} style={{marginRight: 9}}/>
                        <span style={{fontWeight: 600}}>{address}</span>
                    </div>
                )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
                <div style={{
                    margin: "15px 0 0 0",
                    width: "92%",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 11,
                    justifyContent: "center",
                    alignItems: "center"
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
                                    background: secondaryColor + "1A",
                                    color: primaryColor,
                                    borderRadius: 13,
                                    padding: "5.5px 13px 5.5px 10px",
                                    fontWeight: 500,
                                    fontSize: 14.2,
                                    textDecoration: "none",
                                    border: `1.2px solid ${secondaryColor}2A`,
                                    transition: "background .15s,border .15s"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = secondaryColor + "26"}
                                onMouseOut={e => e.currentTarget.style.background = secondaryColor + "1A"}
                            >
                                <Icon size={15}/>
                                <span style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: 108
                                }}>{displayLabel}</span>
                            </a>
                        );
                    })}
                </div>
            )}
            {/* Optional padding at bottom */}
            <div style={{height: 20}}/>
        </div>
    );
}
