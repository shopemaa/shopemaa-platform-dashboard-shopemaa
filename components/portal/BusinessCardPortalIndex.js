import AppHead from "../AppHead";
import SmartBusinessCard from "../businesscard/themes/SmartBusinessCard";
import {getSpaceUrl} from "../../core_api";
import {getQrCodeSvcPublicUrl} from "../../qrcode_api";
import PoweredBy from "../PoweredBy";
import {IconDownload} from "@tabler/icons-react";
import React, {useEffect} from "react";
import SignatureBusinessCard from "../businesscard/themes/SignatureBusinessCard";
import GlassBusinessCard from "../businesscard/themes/GlassBusinessCard";
import SplitBusinessCard from "../businesscard/themes/SplitBusinessCard";
import LuxeBusinessCard from "../businesscard/themes/LuxeBusinessCard";
import LinkTreeBusinessCard from "../businesscard/themes/LinkTreeBusinessCard";
import SpotlightBusinessCard from "../businesscard/themes/SpotlightBusinessCard";
import BusinessCardTemplateRenderer from "../../helpers/business_card_template_renderer";

// Util: Compose full address string cleanly
function formatAddress({street, city, state, postcode, country}) {
    let parts = [street, city, state, postcode, country?.label].filter(Boolean);
    return parts.join(", ");
}

const BusinessCardPortalIndex = ({businessCard}) => {
    useEffect(() => {
        if (businessCard) {
            console.log("BusinessCardPortalIndex", businessCard);
        }
    }, [businessCard])

    if (!businessCard) {
        return (
            <div
                style={{
                    minHeight: "75vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f9fafb"
                }}
            >
                <div className="w-100 text-center text-muted" style={{fontSize: 20}}>
                    Business Card not found
                </div>
                <PoweredBy/>
            </div>
        );
    }

    // Prepare address for display (single line)
    const addressStr = formatAddress({
        street: businessCard.address?.street,
        city: businessCard.address?.city,
        state: businessCard.address?.state,
        postcode: businessCard.address?.postal_code,
        country: businessCard.address?.country,
    });

    return (
        <>
            <AppHead title={`${businessCard.first_name} ${businessCard.last_name} | ${businessCard.current_company}`}/>
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f9fafb",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 32,
                    paddingBottom: 32,
                }}
            >
                <div style={{
                    width: "100%",
                    maxWidth: 440,
                    margin: "0 auto",
                    padding: "0 8px"
                }}>
                    <BusinessCardTemplateRenderer
                        firstName={businessCard.first_name}
                        lastName={businessCard.last_name}
                        phone={businessCard.phone}
                        email={businessCard.email}
                        jobTitle={businessCard.job_title}
                        companyName={businessCard.current_company}
                        companyTagline={businessCard.company_tagline}
                        department={businessCard.department}
                        website={businessCard.website}
                        address={addressStr}
                        avatarUrl={getSpaceUrl() + '/' + businessCard.company_logo_path}
                        socialLinks={businessCard.social_links}
                        primaryColor={businessCard.primary_color || "#214a3b"}
                        secondaryColor={businessCard.secondary_color || "#13e183"}
                        template={businessCard.selected_template}
                    />

                    {/* Save Contact button */}
                    <div className="w-100 text-center mt-4 mb-4">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={getQrCodeSvcPublicUrl() + '/business-cards/' + businessCard.id + '/download'}
                            className="btn"
                            style={{
                                width: "80%",
                                maxWidth: 310,
                                background: `linear-gradient(90deg, ${businessCard.primary_color || "#214a3b"} 0%, ${businessCard.secondary_color || "#13e183"} 100%)`,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 19,
                                borderRadius: 14,
                                boxShadow: "0 1.5px 10px 0 #214a3b17",
                                padding: "14px 0",
                                letterSpacing: "-0.01em",
                                border: "none",
                                outline: "none",
                                transition: "background .18s"
                            }}
                        >
                            <IconDownload size={20} style={{marginBottom: 3, marginRight: 10}}/>
                            Save Contact
                        </a>
                    </div>
                </div>

                {/* Branding */}
                <div className="mt-1" style={{opacity: 0.82}}>
                    <PoweredBy dark={true}/>
                </div>
            </div>
        </>
    );
};

export default BusinessCardPortalIndex;
