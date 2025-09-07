import PoweredBy from "../PoweredBy";
import React from "react";
import {renderBlocks} from "../page-builder/PageBuilder";
import AppHead from "../AppHead";

const OnePageIndex = ({onePage}) => {
    return (
        <>
            <AppHead
                title={onePage.meta_title}
                description={onePage.meta_description}
                bannerImage={onePage.meta_banner_path}
                faviconUrl={onePage.meta_favicon_path}
                contentUrl={onePage.meta_url}
            />

            {onePage && (
                renderBlocks(
                    JSON.parse(onePage.blocks).map((block) => {
                        if (block.id === "productCarousel") {
                            block = {
                                ...block,
                                children: block.children.map((child) => {
                                    if (child.id === "carouselWrapper") {
                                        return {
                                            ...child,
                                            props: {
                                                ...child.props,
                                                className: "carousel-container",
                                            },
                                        };
                                    }
                                    return child;
                                }),
                            };
                        }
                        return block;
                    })
                )
            )}

            <PoweredBy/>
        </>
    )
}

export default OnePageIndex;
