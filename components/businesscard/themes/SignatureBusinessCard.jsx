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

const SOCIAL_ICON_MAP = {
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    whatsapp: IconBrandWhatsapp,
    website: IconWorld,
    custom: IconLink,
};

export default function SignatureBusinessCard({
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
                                                  onDownload, // optional
                                                  primaryColor = "#214a3b",
                                                  secondaryColor = "#13e183",
                                              }) {
    // Combined header
    return (
        <div
            style={{
                maxWidth: 380,
                margin: "42px auto",
                background: "#f4faf9",
                borderRadius: 26,
                boxShadow: "0 8px 38px 0 rgba(33,74,59,0.12)",
                padding: 0,
                position: "relative"
            }}
        >
            {/* Accent bar */}
            <div
                style={{
                    height: 19,
                    borderRadius: "26px 26px 0 0",
                    background: `linear-gradient(90deg,${primaryColor} 0%,${secondaryColor} 100%)`
                }}
            />
            <div
                style={{
                    padding: "0 0 32px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: "0 0 26px 26px"
                }}
            >
                {/* Avatar in an elevated circle */}
                <div
                    style={{
                        marginTop: -38,
                        background: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 14px 0 #214a3b12",
                        padding: 7,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2.5px solid ${secondaryColor}`
                        }}
                    />
                </div>
                {/* Name & headline */}
                <div style={{marginTop: 20, marginBottom: 7, textAlign: "center"}}>
                    <div
                        style={{
                            fontWeight: 900,
                            fontSize: 23.5,
                            color: primaryColor,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.11,
                        }}
                    >
                        {firstName}{" "}
                        <span style={{fontWeight: 700, color: "#132820"}}>{lastName}</span>
                    </div>
                    {jobTitle && (
                        <div style={{
                            fontWeight: 600,
                            fontSize: 15.8,
                            color: "#5e7271",
                            letterSpacing: "0.02em"
                        }}>{jobTitle}</div>
                    )}
                </div>
                {/* Company */}
                {companyName && (
                    <div style={{
                        fontWeight: 700,
                        color: primaryColor,
                        fontSize: 16.7,
                        marginBottom: 3,
                        textAlign: "center"
                    }}>
                        {companyName}
                    </div>
                )}
                {/* Tagline */}
                {companyTagline && (
                    <div style={{
                        color: secondaryColor,
                        fontWeight: 500,
                        fontSize: 14.8,
                        marginBottom: 12,
                        marginTop: 0,
                        textAlign: "center"
                    }}>
                        {companyTagline}
                    </div>
                )}

                {/* Details */}
                <div style={{
                    margin: "13px 0 0 0",
                    width: "84%",
                    borderRadius: 14,
                    background: "#f7faf8",
                    padding: "16px 14px",
                    boxShadow: "0 0.5px 5px 0 #1328200e",
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    alignItems: "flex-start"
                }}>
                    {email && (
                        <div className="d-flex align-items-center" style={{fontSize: 15.2, color: primaryColor}}>
                            <IconMail size={17} style={{marginRight: 9}}/>
                            <span style={{fontWeight: 600}}>{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="d-flex align-items-center" style={{fontSize: 15.2, color: primaryColor}}>
                            <IconPhone size={17} style={{marginRight: 9}}/>
                            <span style={{fontWeight: 600}}>{phone}</span>
                        </div>
                    )}
                    {website && (
                        <div className="d-flex align-items-center" style={{fontSize: 15.2, color: primaryColor}}>
                            <IconWorld size={17} style={{marginRight: 9}}/>
                            <span style={{fontWeight: 600}}>{website}</span>
                        </div>
                    )}
                    {address && (
                        <div className="d-flex align-items-center" style={{fontSize: 15.2, color: primaryColor}}>
                            <IconMapPin size={17} style={{marginRight: 9}}/>
                            <span style={{fontWeight: 600}}>{address}</span>
                        </div>
                    )}
                </div>

                {/* Social links */}
                {socialLinks.length > 0 && (
                    <div style={{
                        margin: "22px 0 5px 0",
                        width: "86%",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        justifyContent: "center"
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
                                        background: secondaryColor + "18",
                                        color: primaryColor,
                                        borderRadius: 15,
                                        padding: "6px 14px 6px 11px",
                                        fontWeight: 500,
                                        fontSize: 14.8,
                                        textDecoration: "none",
                                        boxShadow: "0 1px 5px 0 #0001",
                                        border: `1.3px solid ${secondaryColor}22`,
                                        transition: "background .15s,border .15s"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = secondaryColor + "28"}
                                    onMouseOut={e => e.currentTarget.style.background = secondaryColor + "18"}
                                >
                                    <Icon size={16}/>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 110
                                    }}>{displayLabel}</span>
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Download button, if needed */}
                {onDownload && (
                    <div className="pt-2" style={{width: "84%"}}>
                        <button
                            className="btn"
                            type="button"
                            style={{
                                width: "100%",
                                background: `linear-gradient(90deg,${secondaryColor} 0%,${primaryColor} 100%)`,
                                color: "white",
                                fontWeight: 700,
                                fontSize: 17,
                                borderRadius: 12,
                                boxShadow: `0 1.5px 8px 0 ${secondaryColor}22`,
                                padding: "12px 0",
                                letterSpacing: "-0.01em",
                                border: "none",
                                outline: "none",
                                marginTop: 14,
                                cursor: "pointer",
                                transition: "background .18s"
                            }}
                            onClick={onDownload}
                        >
                            <IconDownload size={17} className="me-2"/>
                            Download vCard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
