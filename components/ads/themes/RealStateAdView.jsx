import React, {useState} from "react";
import PropTypes from "prop-types";
import ShowSubscriptionForm from "../ShowSubscriptionForm";
import {Toaster} from "react-hot-toast";
import MarkdownIt from "markdown-it";
import markdownItAttrs from 'markdown-it-attrs';
import 'react-markdown-editor-lite/lib/index.css';
import {getSpaceUrl} from "../../../core_api";

// Initialize a markdown parser
const mdParser = new MarkdownIt().use(markdownItAttrs);

const RealStateAdView = ({
                             campaign,
                             projectName,
                             mainImage,
                             thumbnails,
                             subtitle,
                             description,
                         }) => {
    const [previewImage, setPreviewImage] = useState(mainImage);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);

    const handleOnSubscribe = () => {
        setShowSubscribeModal(true);
    }

    const handleCampaignAction = () => {
        if (campaign.campaign_action === 'SUBSCRIBE') {
            handleOnSubscribe();
        }
    }

    return (
        <main className="container-xl py-6">
            <article className="card shadow-md overflow-hidden">
                {showSubscribeModal && (
                    <ShowSubscriptionForm
                        show={showSubscribeModal}
                        campaign={campaign}
                        hideFormCallback={setShowSubscribeModal}
                    />
                )}

                <div className="row g-0 custom-html-style">
                    <div className="col-md-6 position-relative">
                        <img
                            src={getSpaceUrl() + '/' + previewImage}
                            alt={`${projectName} hero`}
                            className="w-100 h-100 object-fit-cover"
                            style={{transition: "transform .5s"}}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                        />

                        {thumbnails.length > 0 && (
                            <div className="d-md-flex position-absolute bottom-0 start-0 m-4">
                                {thumbnails.slice(0, 3).map((src, i) => (
                                    <img
                                        key={i}
                                        src={getSpaceUrl() + '/' + src + '?width=150&height=150'}
                                        alt="thumb"
                                        onClick={(e) => {
                                            setPreviewImage(src)
                                        }}
                                        className="rounded border border-white me-2"
                                        style={{width: "4rem", height: "4rem", objectFit: "cover"}}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 p-5 d-flex flex-column">
                        {/* Header */}
                        <header>
                            <h1 className="h1 fw-bold mb-1">{projectName}</h1>
                            {subtitle && (
                                <p className="text-muted small mb-0">{subtitle}</p>
                            )}
                        </header>

                        {/* Description */}
                        <div className="section sec-html mt-3">
                            <div className="section-container html-wrap">
                                <div dangerouslySetInnerHTML={{
                                    __html: mdParser
                                        .render(description)
                                }}/>
                            </div>
                        </div>

                        {/* CTA */}
                        <footer className="mt-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div className={'text-center col-12'}>
                                {campaign.campaign_action !== 'NONE' && (
                                    <button
                                        onClick={() => handleCampaignAction()}
                                        className="btn btn-qrc text-white shadow"
                                        role="button">
                                        {campaign.campaign_action_btn_label ? campaign.campaign_action_btn_label : campaign.campaign_action}
                                    </button>
                                )}
                            </div>
                        </footer>
                    </div>
                </div>

                <Toaster/>
            </article>
        </main>
    );
}

RealStateAdView.propTypes = {
    projectName: PropTypes.string.isRequired,
    mainImage: PropTypes.string.isRequired,
    thumbnails: PropTypes.arrayOf(PropTypes.string),
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default RealStateAdView;
