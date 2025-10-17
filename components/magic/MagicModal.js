import React, {useState, useEffect, useRef} from "react";
import {magicApi} from "../../qrcode_api";

const MagicModal = ({
                        organizationId,
                        showMagicPopup,
                        setShowMagicPopup,
                        accessToken,
                        successCallback,
                        failureCallback,
                        prevContent,
                        promptPlaceHolder = `Describe your request, and Subera will take care of it`,
                    }) => {
    const [magicQuery, setMagicQuery] = useState('');
    const [disableMagicBtn, setDisableMagicBtn] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const textareaRef = useRef(null);

    // Autofocus textarea when modal opens
    useEffect(() => {
        if (showMagicPopup && textareaRef.current) {
            textareaRef.current.focus();
        }

        // Clear input and error when closing
        if (!showMagicPopup) {
            setErrorMsg('');
        }
    }, [showMagicPopup]);

    // Escape closes modal
    useEffect(() => {
        if (!showMagicPopup) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowMagicPopup(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showMagicPopup, setShowMagicPopup]);

    const handleMagic = async () => {
        if (magicQuery.trim() === '') {
            setErrorMsg('Please enter your request.');
            return;
        }
        setDisableMagicBtn(true);
        setErrorMsg('');
        try {
            const magicClient = magicApi(accessToken);
            const response = await magicClient.magic(organizationId, {
                query: magicQuery,
                prev_content: prevContent ? JSON.stringify(prevContent) : null
            });
            if (response && response.data) {
                successCallback(response.data);
                setMagicQuery('');
                setShowMagicPopup(false);
            } else {
                setErrorMsg("No response from server. Please try again.");
            }
        } catch (error) {
            setErrorMsg("Sorry, something went wrong. Please try again.");
            failureCallback?.(error);
        } finally {
            setDisableMagicBtn(false);
        }
    };

    const handleCancel = () => {
        setShowMagicPopup(false);
        setErrorMsg('');
    };

    return (
        <div
            className={`modal modal-blur fade ${showMagicPopup ? 'show d-block' : ''}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!showMagicPopup}
            style={{backgroundColor: showMagicPopup ? 'rgba(0,0,0,0.5)' : 'transparent'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="modal-title h3 mb-3">Subera is Ready to Help!</div>
                        <div className="mb-3">
                            <label htmlFor="magic-query" className="form-label required">
                                How can Subera assist you today?
                            </label>
                            <textarea
                                ref={textareaRef}
                                id="magic-query"
                                name="magicQuery"
                                className="form-control"
                                value={magicQuery}
                                onChange={(e) => setMagicQuery(e.target.value)}
                                placeholder={promptPlaceHolder}
                                rows={5}
                                disabled={disableMagicBtn}
                            />
                            {errorMsg && (
                                <div className="text-danger small mt-2">{errorMsg}</div>
                            )}
                        </div>
                        <div className="modal-footer text-end">
                            <button
                                disabled={disableMagicBtn}
                                onClick={handleCancel}
                                className="btn btn-outline-secondary me-2 col-4"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={disableMagicBtn}
                                onClick={handleMagic}
                                className="btn btn-primary col-6"
                                type="button"
                            >
                                {disableMagicBtn ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm text-white me-2"
                                              role="status"/>
                                        Asking Subera...
                                    </>
                                ) : (
                                    <>Ask Subera</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MagicModal;
