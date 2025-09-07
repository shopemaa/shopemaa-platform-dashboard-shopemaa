import React from "react";
import SmartBusinessCard from "../components/businesscard/themes/SmartBusinessCard";
import GlassBusinessCard from "../components/businesscard/themes/GlassBusinessCard";
import LinkTreeBusinessCard from "../components/businesscard/themes/LinkTreeBusinessCard";
import LuxeBusinessCard from "../components/businesscard/themes/LuxeBusinessCard";
import SignatureBusinessCard from "../components/businesscard/themes/SignatureBusinessCard";
import SpotlightBusinessCard from "../components/businesscard/themes/SpotlightBusinessCard";
import SplitBusinessCard from "../components/businesscard/themes/SplitBusinessCard";

// Supported template keys (case-insensitive)
const TEMPLATE_MAP = {
    default: SmartBusinessCard,
    glass: GlassBusinessCard,
    linktree: LinkTreeBusinessCard,
    luxe: LuxeBusinessCard,
    signature: SignatureBusinessCard,
    split: SplitBusinessCard,
    spotlight: SpotlightBusinessCard,
};

export default function BusinessCardTemplateRenderer(props) {
    const {template = "Default", ...cardProps} = props;
    // Normalize and fallback
    const key = (template || "default").toLowerCase().replace(/\s+/g, "");
    const CardComponent = TEMPLATE_MAP[key] || SmartBusinessCard;
    return <CardComponent {...cardProps} />;
}
