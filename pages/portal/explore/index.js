import React, {useEffect, useState} from "react";
import {renderBlocks} from "../../../components/page-builder/PageBuilder";
import AppHead from "../../../components/AppHead";
import {
    pageBuilderCourseCreatorTemplate,
    pageBuilderLinkTreeTemplate,
    pageBuilderRealStateTemplate,
    pageBuilderRestaurantTemplate, pageBuilderShopTemplate
} from "../../../helpers/page_builder_template";
import BaseSelect from "../../../components/base/BaseSelect";

export default function DemoIndex({blocks, title, selectedTheme}) {
    const [exploreOptions, setExploreOptions] = useState([
        {label: 'Restaurant Owner', value: 'restaurant'},
        {label: 'Influencer', value: 'influencer'},
        {label: 'Product Seller', value: 'product'},
        {label: 'Real State Agent', value: 'realstate'},
        {label: 'Course creator', value: 'course'}
    ]);

    // Auto-scroll effect
    useEffect(() => {
        const container = document.querySelector(".carousel-container");
        if (!container) return;
        let scrollAmount = 0;
        const scrollStep = 2;
        const interval = setInterval(() => {
            container.scrollLeft += scrollStep;
            scrollAmount += scrollStep;
            if (scrollAmount >= container.scrollWidth / 2) {
                container.scrollLeft = 0;
                scrollAmount = 0;
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const onExploreChange = (e) => {
        window.location.href = `?theme=${e.target.value}`;
    }

    return (
        <>
            <Head
                title={'QrCentraal | ' + title}
            />

            <div className="row justify-content-center align-items-center text-center pt-2 pb-2">
                <div className="col-auto">
                    <label htmlFor="explore-select" className="mb-0 text-qrc">Explore as</label>
                </div>
                <div className="col-auto mx-2">
                    <BaseSelect
                        id="explore-select"
                        required
                        value={selectedTheme} // use a state variable here
                        options={exploreOptions}
                        onChange={onExploreChange} // assumes this is a handler function
                        className="form-control"
                    />
                </div>
            </div>

            {renderBlocks(
                blocks.map((block) => {
                    // Add carousel-container class to product row
                    if (block.id === "productCarousel") {
                        block.children = block.children.map((child) => {
                            if (child.id === "carouselWrapper") {
                                child.props = {...child.props, className: "carousel-container"};
                            }
                            return child;
                        });
                    }
                    return block;
                })
            )}
        </>
    );
}

export const getServerSideProps = async ({query}) => {
    const theme = query.theme || "influencer"

    let themeBlocks = []
    let themeTitle = ""

    switch (theme) {
        case "restaurant":
            themeBlocks = pageBuilderRestaurantTemplate()
            themeTitle = "XYX Cafe"
            break
        case "influencer":
            themeBlocks = pageBuilderLinkTreeTemplate()
            themeTitle = "I am Influencer"
            break
        case "product":
            themeBlocks = pageBuilderShopTemplate()
            themeTitle = "I a Product seller"
            break
        case "realstate":
            themeBlocks = pageBuilderRealStateTemplate()
            themeTitle = "I a Real State agent"
            break
        case "course":
            themeBlocks = pageBuilderCourseCreatorTemplate()
            themeTitle = "I a Course creator"
            break
        default:
            themeBlocks = pageBuilderLinkTreeTemplate()
            themeTitle = "I am Influencer"
    }

    return {
        props: {
            blocks: themeBlocks,
            title: themeTitle,
            selectedTheme: theme,
        }
    }
};
