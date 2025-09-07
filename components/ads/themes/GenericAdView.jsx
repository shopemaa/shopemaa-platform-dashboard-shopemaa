import React, {useState} from "react";
import PropTypes from "prop-types";
import ShowSubscriptionForm from "../ShowSubscriptionForm";
import {Toaster} from "react-hot-toast";
import MarkdownIt from "markdown-it";
import markdownItAttrs from 'markdown-it-attrs';
import 'react-markdown-editor-lite/lib/index.css';

// Initialize a markdown parser
const mdParser = new MarkdownIt().use(markdownItAttrs);

const GenericAdView = ({
                           campaign,
                           projectName,
                           subtitle,
                           description,
                       }) => {
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
                    <div className="col-md-12 col-12 p-5">
                        {/* Header */}
                        <header className={'text-center'}>
                            <h1 className="h1 fw-bold mb-1">{projectName}</h1>

                            {subtitle && (
                                <p className="text-muted small mb-0">{subtitle}</p>
                            )}
                        </header>

                        {/* Description */}
                        <div className="section sec-html mt-3">
                            <div className="section-container html-wrap">
                                <div
                                    dangerouslySetInnerHTML={{
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

GenericAdView.propTypes = {
    projectName: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default GenericAdView;