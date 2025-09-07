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

const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
};

export default function SplitBusinessCard({
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
                maxWidth: 600,
                minHeight: 195,
                margin: "48px auto",
                borderRadius: 28,
                background: `linear-gradient(97deg,#fcfefd 60%,${secondaryColor}11 100%)`,
                boxShadow: "0 10px 40px 0 rgba(33,74,59,0.10)",
                display: "flex",
                overflow: "hidden",
                fontFamily: "'Inter',sans-serif",
                border: "none",
                position: "relative"
            }}
        >
            {/* Left: Accent bar and avatar */}
            <div
                style={{
                    width: 120,
                    minWidth: 120,
                    background: `linear-gradient(152deg,${primaryColor} 65%,${secondaryColor} 130%)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "22px 0",
                    position: "relative",
                }}
            >
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{
                        width: 74,
                        height: 74,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3.5px solid #fff`,
                        marginBottom: 15,
                        boxShadow: "0 3px 22px 0 #0002"
                    }}
                />
                <div style={{
                    fontWeight: 900,
                    fontSize: 16.5,
                    color: "#fff",
                    textAlign: "center",
                    lineHeight: 1.13,
                    letterSpacing: "-0.01em",
                }}>
                    {firstName}
                    <div style={{fontWeight: 700, marginTop: -2}}>{lastName}</div>
                </div>
                {companyName && (
                    <div style={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 12.7,
                        marginTop: 6,
                        opacity: 0.85,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}>
                        {companyName}
                    </div>
                )}
            </div>
            {/* Center Divider */}
            <div
                style={{
                    width: 1,
                    background: "#eaf3f0",
                    margin: "32px 0",
                    alignSelf: "stretch",
                }}
            />
            {/* Right: Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "38px 34px 34px 32px",
                    background: "transparent",
                    minWidth: 0
                }}
            >
                {/* Headline / tagline */}
                <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                    {companyTagline && (
                        <div style={{
                            color: secondaryColor,
                            fontWeight: 700,
                            fontSize: 16,
                            marginBottom: 2,
                            letterSpacing: "0.01em"
                        }}>{companyTagline}</div>
                    )}
                    {jobTitle && (
                        <div style={{
                            color: primaryColor,
                            fontWeight: 600,
                            fontSize: 15,
                            marginBottom: 0,
                            letterSpacing: "0.01em"
                        }}>{jobTitle}</div>
                    )}
                </div>
                {/* Details, vertical stack */}
                <div style={{
                    margin: "18px 0 2px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                }}>
                    {email && (
                        <div style={{fontSize: 15, color: primaryColor, display: "flex", alignItems: "center", gap: 8}}>
                            <IconMail size={15}/>
                            <span style={{fontWeight: 600}}>{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div style={{fontSize: 15, color: primaryColor, display: "flex", alignItems: "center", gap: 8}}>
                            <IconPhone size={15}/>
                            <span style={{fontWeight: 600}}>{phone}</span>
                        </div>
                    )}
                    {website && (
                        <div style={{fontSize: 15, color: primaryColor, display: "flex", alignItems: "center", gap: 8}}>
                            <IconWorld size={15}/>
                            <span style={{fontWeight: 600}}>{website}</span>
                        </div>
                    )}
                    {address && (
                        <div style={{fontSize: 15, color: primaryColor, display: "flex", alignItems: "center", gap: 8}}>
                            <IconMapPin size={15}/>
                            <span style={{fontWeight: 600}}>{address}</span>
                        </div>
                    )}
                </div>
                {/* Social links */}
                {socialLinks.length > 0 && (
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginTop: 22,
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
                                    ? (link.url.length > 15 ? link.url.slice(0, 15) + "…" : link.url)
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
                                        background: secondaryColor + "18",
                                        color: primaryColor,
                                        borderRadius: 14,
                                        padding: "6px 14px 6px 10px",
                                        fontWeight: 500,
                                        fontSize: 14,
                                        textDecoration: "none",
                                        border: `1.3px solid ${secondaryColor}25`,
                                        transition: "background .15s,border .15s"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = secondaryColor + "28"}
                                    onMouseOut={e => e.currentTarget.style.background = secondaryColor + "18"}
                                >
                                    <Icon size={14}/>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 90
                                    }}>{displayLabel}</span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
