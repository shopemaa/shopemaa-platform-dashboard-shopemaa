import React, {useRef, useEffect} from "react";
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

const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
};

export default function LuxeBusinessCard({
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
    // Add animated glowing effect under avatar with CSS
    return (
        <div
            style={{
                maxWidth: 430,
                margin: "64px auto",
                borderRadius: 30,
                boxShadow: "0 14px 40px 0 rgba(33,74,59,0.14)",
                background: "#fff",
                position: "relative",
                padding: "0",
                overflow: "visible",
                fontFamily: "'Inter',sans-serif",
                border: "none"
            }}
        >
            {/* Floating avatar with animated glow */}
            <div style={{
                position: "absolute",
                top: -52,
                left: 34,
                zIndex: 10,
                background: "transparent",
            }}>
                {/* Glow */}
                <span
                    style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 50% 50%, ${secondaryColor}33 0%, transparent 65%)`,
                        filter: `blur(8px)`,
                        zIndex: 0,
                        animation: "luxeglow 2.6s infinite cubic-bezier(.77,0,.18,1) alternate"
                    }}
                />
                {/* Avatar */}
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3.5px solid ${secondaryColor}`,
                        boxShadow: "0 1.5px 14px 0 #214a3b1a",
                        background: "#fff",
                        position: "relative",
                        zIndex: 1
                    }}
                />
            </div>
            {/* Card body */}
            <div
                style={{
                    padding: "60px 38px 38px 38px",
                    borderRadius: "30px",
                    background: "#fff",
                    minHeight: 240,
                    boxSizing: "border-box",
                    boxShadow: "none",
                    position: "relative",
                    zIndex: 2
                }}
            >
                {/* Name & headline */}
                <div style={{marginLeft: 120, marginBottom: 8}}>
                    <div
                        style={{
                            fontWeight: 900,
                            fontSize: 27,
                            color: primaryColor,
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                            display: "inline-block",
                            position: "relative",
                        }}
                    >
                        <span>{firstName}</span>{" "}
                        <span style={{fontWeight: 700, color: "#192b1f"}}>{lastName}</span>
                        {/* Subtle gradient accent under name */}
                        <span
                            style={{
                                display: "block",
                                height: 6,
                                width: 60,
                                borderRadius: 8,
                                background: `linear-gradient(90deg,${secondaryColor} 0%,${primaryColor} 80%)`,
                                marginTop: 6,
                                opacity: 0.13
                            }}
                        />
                    </div>
                    {jobTitle && (
                        <div style={{
                            fontWeight: 600,
                            fontSize: 15.5,
                            color: "#7c9189",
                            marginTop: 2,
                            letterSpacing: "0.01em"
                        }}>{jobTitle}</div>
                    )}
                </div>
                {/* Company and tagline */}
                <div style={{
                    marginLeft: 120,
                    marginBottom: 22,
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4
                }}>
                    {companyName && (
                        <div style={{
                            fontWeight: 700,
                            color: primaryColor,
                            fontSize: 16.2,
                        }}>{companyName}</div>
                    )}
                    {companyTagline && (
                        <div style={{
                            color: secondaryColor,
                            fontWeight: 500,
                            fontSize: 14.6,
                            marginTop: 0
                        }}>
                            {companyTagline}
                        </div>
                    )}
                </div>
                {/* Contact details */}
                <div style={{
                    marginLeft: 120,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    fontSize: 15.4
                }}>
                    {email && (
                        <div style={{color: primaryColor, display: "flex", alignItems: "center", gap: 9}}>
                            <IconMail size={17}/>
                            <span style={{fontWeight: 600}}>{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div style={{color: primaryColor, display: "flex", alignItems: "center", gap: 9}}>
                            <IconPhone size={17}/>
                            <span style={{fontWeight: 600}}>{phone}</span>
                        </div>
                    )}
                    {website && (
                        <div style={{color: primaryColor, display: "flex", alignItems: "center", gap: 9}}>
                            <IconWorld size={17}/>
                            <span style={{fontWeight: 600}}>{website}</span>
                        </div>
                    )}
                    {address && (
                        <div style={{color: primaryColor, display: "flex", alignItems: "center", gap: 9}}>
                            <IconMapPin size={17}/>
                            <span style={{fontWeight: 600}}>{address}</span>
                        </div>
                    )}
                </div>
                {/* Social links (icon row) */}
                {socialLinks.length > 0 && (
                    <div style={{
                        marginLeft: 120,
                        marginTop: 26,
                        display: "flex",
                        gap: 19,
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
                                        justifyContent: "center",
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "#f5f9f8",
                                        color: primaryColor,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        textDecoration: "none",
                                        boxShadow: "0 2px 6px 0 #214a3b07",
                                        border: `1.7px solid ${secondaryColor}22`,
                                        transition: "box-shadow .15s,border .15s"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 18px 0 #13e18333"}
                                    onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 6px 0 #214a3b07"}
                                >
                                    <Icon size={19}/>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Animation Keyframes */}
            <style>{`
                @keyframes luxeglow {
                    0%   { opacity: 0.76; transform: scale(1);}
                    100% { opacity: 0.39; transform: scale(1.15);}
                }
            `}</style>
        </div>
    );
}
