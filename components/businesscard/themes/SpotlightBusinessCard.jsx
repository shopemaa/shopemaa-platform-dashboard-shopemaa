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

export default function SpotlightBusinessCard({
                                                  firstName,
                                                  lastName,
                                                  jobTitle,
                                                  companyName,
                                                  companyTagline,
                                                  avatarUrl,
                                                  socialLinks = [],
                                                  email,
                                                  phone,
                                                  website,
                                                  address,
                                                  primaryColor = "#214a3b",
                                                  secondaryColor = "#13e183",
                                              }) {
    // Layout variables
    const cardMaxWidth = 420;

    return (
        <div style={{
            maxWidth: cardMaxWidth,
            minWidth: 320,
            width: "100%",
            background: "#fff",
            borderRadius: 28,
            boxShadow: "0 8px 36px 0 rgba(33,74,59,0.15), 0 1.5px 8px 0 #13e18319",
            display: "flex",
            position: "relative",
            overflow: "visible",
            transition: "box-shadow .18s",
        }}
             className="pro-card"
        >
            {/* Vertical Accent Bar */}
            <div style={{
                width: 7,
                background: `linear-gradient(160deg,${secondaryColor} 0%,${primaryColor} 100%)`,
                borderRadius: "28px 0 0 28px",
                minHeight: 280,
                marginRight: 0,
                boxShadow: "0 0 16px 0 #13e1831a"
            }}/>

            {/* Card Content */}
            <div style={{
                flex: 1,
                padding: "36px 36px 28px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start"
            }}>
                {/* Header */}
                <div style={{display: "flex", alignItems: "center", gap: 20, marginBottom: 18}}>
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `3.5px solid ${secondaryColor}`,
                            background: "#fff",
                            boxShadow: "0 4px 20px 0 #13e18323"
                        }}
                    />
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <span style={{
                            fontWeight: 700,
                            fontSize: 24,
                            color: primaryColor,
                            lineHeight: 1.13,
                            letterSpacing: "-0.01em",
                        }}>
                            {firstName} {lastName}
                        </span>
                        {jobTitle && (
                            <span style={{
                                color: "#839392",
                                fontWeight: 500,
                                fontSize: 15.6,
                                marginTop: 2
                            }}>{jobTitle}</span>
                        )}
                    </div>
                </div>
                {/* Company Name & Tagline */}
                {(companyName || companyTagline) && (
                    <div style={{marginBottom: 18}}>
                        {companyName && (
                            <div style={{
                                fontWeight: 600,
                                color: primaryColor,
                                fontSize: 16.2,
                            }}>{companyName}</div>
                        )}
                        {companyTagline && (
                            <div style={{
                                color: secondaryColor,
                                fontWeight: 500,
                                fontSize: 14.8,
                                marginTop: 2,
                                marginBottom: 0,
                                opacity: 0.94,
                            }}>{companyTagline}</div>
                        )}
                    </div>
                )}
                {/* Contact */}
                <div style={{
                    display: "flex",
                    gap: 24,
                    flexWrap: "wrap",
                    marginBottom: 10,
                    fontWeight: 500,
                    fontSize: 15.5
                }}>
                    {email && (
                        <span style={{color: primaryColor, display: "flex", alignItems: "center", gap: 7}}>
                            <IconMail size={17}/>
                            <span>{email}</span>
                        </span>
                    )}
                    {phone && (
                        <span style={{color: primaryColor, display: "flex", alignItems: "center", gap: 7}}>
                            <IconPhone size={17}/>
                            <span>{phone}</span>
                        </span>
                    )}
                    {website && (
                        <span style={{color: primaryColor, display: "flex", alignItems: "center", gap: 7}}>
                            <IconWorld size={17}/>
                            <span>{website}</span>
                        </span>
                    )}
                </div>
                {address && (
                    <div style={{
                        color: "#7a8b82",
                        fontWeight: 400,
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 7,
                        opacity: 0.92
                    }}>
                        <IconLink size={16} style={{opacity: .6}}/>
                        <span>{address}</span>
                    </div>
                )}
                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        margin: "15px 0 6px 0"
                    }}>
                        {socialLinks.slice(0, 5).map((link, i) => {
                            if (!link.url) return null;
                            const Icon = SOCIAL_ICON_MAP[link.type] || IconLink;
                            let url = link.url;
                            if (link.type === "whatsapp") {
                                url = `https://wa.me/${link.url}`;
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
                                    ? (link.url.length > 15 ? link.url.slice(0, 15) + "…" : link.url)
                                    : link.type.charAt(0).toUpperCase() + link.type.slice(1));
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
                                        background: "#f7fbf9",
                                        color: primaryColor,
                                        borderRadius: 16,
                                        padding: "8px 17px 8px 13px",
                                        fontWeight: 600,
                                        fontSize: 15.2,
                                        textDecoration: "none",
                                        border: `1.5px solid ${secondaryColor}30`,
                                        boxShadow: "0 2px 12px 0 #13e1830a",
                                        transition: "background .15s,box-shadow .17s",
                                        willChange: "background,box-shadow"
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = secondaryColor + "21";
                                        e.currentTarget.style.boxShadow = `0 6px 22px 0 ${secondaryColor}29`;
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = "#f7fbf9";
                                        e.currentTarget.style.boxShadow = "0 2px 12px 0 #13e1830a";
                                    }}
                                >
                                    <Icon size={17}/>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 95
                                    }}>{displayLabel}</span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`
                .pro-card:hover {
                    box-shadow: 0 16px 52px 0 #214a3b23, 0 5px 14px 0 #13e18322;
                }
            `}</style>
        </div>
    );
}
