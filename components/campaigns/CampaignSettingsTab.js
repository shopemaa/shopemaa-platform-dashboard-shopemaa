import React, {useEffect, useState} from "react";
import ProcessingRequestMsgModal from "../modals/ProcessingRequestMsgModal";
import MagicModal from "../magic/MagicModal";
import BaseSelect from "../base/BaseSelect";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import markdownItAttrs from 'markdown-it-attrs';
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {campaignApi} from "../../qrcode_api";
import {getQrcnUrl, handleApi} from "../../common_api";
import {QrCentraalCooKieAccessToken, QrCentraalOrgId} from "../../utils/cookie";
import {getSpaceUrl, multimediaApi} from "../../core_api";
import {hasValue} from "../../helpers/helpers";
import {showErrorMessage} from "../../helpers/errors";

import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt().use(markdownItAttrs);
const BRAND_COLOR = "#214a3b";

const CampaignSettingsTab = ({project}) => {
    // Modals
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showProcessingModalTitle, setShowProcessingModalTitle] = useState('');
    const [showProcessingModalMessage, setShowProcessingModalMessage] = useState('');
    const [showMagicPopup, setShowMagicPopup] = useState(false);

    // Main state
    const [orgId] = useState(Cookies.get(QrCentraalOrgId));
    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);

    // Fields
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('**Hello world!!!**');

    const [campaignTypes] = useState([
        {label: 'GENERIC', value: 'GENERIC'},
        {label: 'REAL_ESTATE', value: 'REAL_ESTATE'},
    ]);
    const [selectedCampaignType, setSelectedCampaignType] = useState({label: 'GENERIC', value: 'GENERIC'});

    const [campaignStatues] = useState([
        {label: 'ACTIVE', value: 'ACTIVE'},
        {label: 'INACTIVE', value: 'INACTIVE'}
    ]);
    const [selectedCampaignStatus, setSelectedCampaignStatus] = useState({label: 'ACTIVE', value: 'ACTIVE'});

    const [campaignActionEvents] = useState([
        {label: 'SUBSCRIBE', value: 'SUBSCRIBE'},
        {label: 'FEEDBACK', value: 'FEEDBACK'},
        {label: 'NONE', value: 'NONE'}
    ]);
    const [selectedCampaignActionEvent, setSelectedCampaignActionEvent] = useState({label: 'NONE', value: 'NONE'});

    const [campaignPostActionEvents] = useState([
        {label: 'GENERATE_COUPON', value: 'GENERATE_COUPON'},
        {label: 'NONE', value: 'NONE'}
    ]);
    const [selectedCampaignPostActionEvent, setSelectedCampaignPostActionEvent] = useState({
        label: 'NONE',
        value: 'NONE'
    });

    const [discountTypes] = useState([
        {label: 'FIXED', value: 'FIXED'},
        {label: 'PERCENTAGE', value: 'PERCENTAGE'}
    ]);
    const [selectedDiscountType, setSelectedDiscountType] = useState({label: 'FIXED', value: 'FIXED'});

    // More fields
    const [discountAmount, setDiscountAmount] = useState(1);
    const [discountValidFrom, setDiscountValidFrom] = useState('');
    const [discountValidTo, setDiscountValidTo] = useState('');
    const [discountMaximumUsage, setDiscountMaximumUsage] = useState(1);

    const [subscribeConfig, setSubscribeConfig] = useState({
        is_phone_required: false,
        is_email_required: false,
        is_phone_verification_required: false,
        is_email_verification_required: false
    });

    const [actionBtnLabel, setActionBtnLabel] = useState('');
    const [postActionBtnLabel, setPostActionBtnLabel] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Images
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerImagePath, setBannerImagePath] = useState('');
    const [bannerImagePreview, setBannerImagePreview] = useState('');
    const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
    const [isBannerUploading, setIsBannerUploading] = useState(false);

    const [additionalImages, setAdditionalImages] = useState([]);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
    const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);

    // Routing
    const router = useRouter();

    // On mount: Load project
    useEffect(() => {
        if (project && project.campaign) {
            let cmp = project.campaign;
            setTitle(cmp.title || "");
            setSubtitle(cmp.subtitle || "");
            setDescription(cmp.description || "**Hello world!!!**");
            setSelectedCampaignType({label: cmp.campaign_type, value: cmp.campaign_type});
            setSelectedCampaignStatus({label: cmp.status, value: cmp.status});
            setSelectedCampaignActionEvent({label: cmp.campaign_action, value: cmp.campaign_action});
            setActionBtnLabel(cmp.campaign_action_btn_label || "");
            setSelectedCampaignPostActionEvent({label: cmp.post_action_event, value: cmp.post_action_event});
            setPostActionBtnLabel(cmp.post_action_event_btn_label || "");
            setStartDate(cmp.start_date || "");
            setEndDate(cmp.end_date || "");
            setStartTime(cmp.start_time || "");
            setEndTime(cmp.end_time || "");
            if (cmp.subscriber_config) setSubscribeConfig({...cmp.subscriber_config});
            if (cmp.banner_image_path) {
                setBannerImagePath(cmp.banner_image_path);
                setBannerImagePreview(getSpaceUrl() + '/' + cmp.banner_image_path);
            }
            if (cmp.additional_images && cmp.additional_images.length > 0) {
                setAdditionalImages(cmp.additional_images);
            }
        }
    }, [project]);

    // Handlers
    const handleCampaignTypeChange = (event) => {
        let v = campaignTypes.find(c => c.value === event.target.value);
        setSelectedCampaignType({...v});
    };
    const handleCampaignStatusChange = (event) => {
        let v = campaignStatues.find(c => c.value === event.target.value);
        setSelectedCampaignStatus({...v});
    };
    const handleCampaignActionEventChange = (event) => {
        let v = campaignActionEvents.find(c => c.value === event.target.value);
        setSelectedCampaignActionEvent({...v});
        setSelectedCampaignPostActionEvent({label: "NONE", value: "NONE"});
    };
    const handleCampaignPostActionEventChange = (event) => {
        let v = campaignPostActionEvents.find(c => c.value === event.target.value);
        setSelectedCampaignPostActionEvent({...v});
    };
    const handleDiscountTypeChange = (event) => {
        let v = discountTypes.find(c => c.value === event.target.value);
        setSelectedDiscountType({...v});
    };

    const handleSubscribeConfigChange = (event) => {
        let name = event.target.name;
        setSubscribeConfig(prev => ({...prev, [name]: !prev[name]}));
    };

    // Image handlers
    const handleBannerFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file', {position: 'top-center'});
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB', {position: 'top-center'});
            return;
        }
        setBannerImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setBannerImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };
    const handleBannerUpload = async () => {
        if (!bannerImageFile) return Promise.resolve(bannerImagePath);
        setIsBannerUploading(true);
        setBannerUploadProgress(0);
        try {
            const multimediaClient = multimediaApi(accessToken);
            const response = await multimediaClient.uploadMultimedia({file: bannerImageFile});
            const uploadedPath = response.data.file_path;
            setBannerImagePath(uploadedPath);
            setBannerImageFile(null);
            setBannerUploadProgress(100);
            toast.success('Banner image uploaded successfully!', {position: 'top-center'});
            return uploadedPath;
        } catch (error) {
            showErrorMessage(error);
            setBannerUploadProgress(0);
            throw error;
        } finally {
            setIsBannerUploading(false);
        }
    };
    const removeBannerImage = () => {
        setBannerImageFile(null);
        setBannerImagePath('');
        setBannerImagePreview('');
        setBannerUploadProgress(0);
    };
    const handleAdditionalImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const totalImages = additionalImages.length + additionalImageFiles.length + files.length;
        if (totalImages > 5) {
            toast.error('Maximum 5 additional images allowed', {position: 'top-center'});
            return;
        }
        const validFiles = [];
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select only image files', {position: 'top-center'});
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Each image must be less than 5MB', {position: 'top-center'});
                return;
            }
            validFiles.push(file);
        });
        setAdditionalImageFiles(prev => [...prev, ...validFiles]);
    };
    const uploadAdditionalImages = async () => {
        if (additionalImageFiles.length === 0) return additionalImages;
        setIsUploadingAdditional(true);
        const uploadedPaths = [];
        try {
            const multimediaClient = multimediaApi(accessToken);
            for (const file of additionalImageFiles) {
                const response = await multimediaClient.uploadMultimedia({file: file});
                uploadedPaths.push(response.data.file_path);
            }
            const allImages = [...additionalImages, ...uploadedPaths];
            setAdditionalImages(allImages);
            setAdditionalImageFiles([]);
            toast.success('Additional images uploaded successfully!', {position: 'top-center'});
            return allImages;
        } catch (error) {
            showErrorMessage(error);
            throw error;
        } finally {
            setIsUploadingAdditional(false);
        }
    };
    const removeAdditionalImage = (index, isFile = false) => {
        if (isFile) {
            setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setAdditionalImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Save/Upsert
    const handleCampaignUpsert = async () => {
        if (title.trim() === '' || description.trim() === '') return;
        setDisableUpdateBtn(true);
        try {
            const finalBannerPath = await handleBannerUpload();
            const finalAdditionalImages = await uploadAdditionalImages();
            const campaignClient = campaignApi(accessToken);
            const campaignUpsertApiCall = campaignClient.campaignUpsert(
                project.id,
                {
                    title: title.trim(),
                    subtitle: hasValue(subtitle) ? subtitle.trim() : null,
                    description: description.trim(),
                    banner_image_path: finalBannerPath || null,
                    additional_images: finalAdditionalImages,
                    campaign_type: selectedCampaignType.value,
                    campaign_status: selectedCampaignStatus.value,
                    action_event: selectedCampaignActionEvent.value,
                    post_action_event: selectedCampaignPostActionEvent.value,
                    start_date: hasValue(startDate) ? startDate : null,
                    end_date: hasValue(endDate) ? endDate : null,
                    start_time: hasValue(startTime) ? startTime : null,
                    end_time: hasValue(endTime) ? endTime : null,
                    action_event_btn_label: hasValue(actionBtnLabel) ? actionBtnLabel.trim() : null,
                    post_action_event_btn_label: hasValue(postActionBtnLabel) ? postActionBtnLabel.trim() : null,
                }
            );
            const response = await handleApi(null, campaignUpsertApiCall);

            if (response.data && selectedCampaignActionEvent.value === 'SUBSCRIBE') {
                handleSubscribeConfigUpsert();
            } else {
                setDisableUpdateBtn(false);
            }
            toast.success('Campaign updated successfully!', {position: 'top-center'});

        } catch (error) {
            showErrorMessage(error);
        } finally {
            setDisableUpdateBtn(false);
        }
    };

    const handleSubscribeConfigUpsert = () => {
        const campaignClient = campaignApi(accessToken);
        let campaignSubscriberConfigApiCall = campaignClient
            .campaignSubscriberConfig(project.id, subscribeConfig);

        handleApi(null, campaignSubscriberConfigApiCall)
            .then(response => {
                if (response.data && selectedCampaignPostActionEvent.value === 'GENERATE_COUPON') {
                    handleCouponConfigUpsert();
                } else {
                    setDisableUpdateBtn(false);
                }
            })
            .catch(error => {
                showErrorMessage(error);
                setDisableUpdateBtn(false);
            });
    };

    const handleCouponConfigUpsert = () => {
        const campaignClient = campaignApi(accessToken);
        let campaignCouponConfigApiCall = campaignClient
            .campaignCouponConfig(project.id, {
                discount_type: selectedDiscountType.value,
                discount_amount: discountAmount,
                valid_from: discountValidFrom !== "" ? discountValidFrom : null,
                valid_to: discountValidTo !== "" ? discountValidTo : null,
                max_usage: discountMaximumUsage
            });

        handleApi(null, campaignCouponConfigApiCall)
            .then(response => {
                setDisableUpdateBtn(false);
            })
            .catch(error => {
                showErrorMessage(error);
                setDisableUpdateBtn(false);
            });
    };

    const onContinue = () => {
        router.push(`/dashboard/qr-codes/${project.id}/configure`);
    };

    const onImageUpload = (file) => {
        let multimediaClient = multimediaApi(accessToken);
        return new Promise(resolve => {
            return multimediaClient.uploadMultimedia({file: file}).then(response => {
                resolve(getSpaceUrl() + '/' + response.data.file_path);
            }).catch(showErrorMessage);
        });
    };

    const onMagicSuccess = (data) => setDescription(data);
    const onMagicFailure = (err) => showErrorMessage(err);

    const isImageSupported = () => selectedCampaignType.value !== 'GENERIC';

    // UI below (as in previous answer)
    // ----------- UI -----------
    return (
        <>
            {/* Modals */}
            <ProcessingRequestMsgModal
                show={showProcessingModal}
                title={showProcessingModalTitle}
                message={showProcessingModalMessage}
            />
            <MagicModal
                organizationId={orgId}
                showMagicPopup={showMagicPopup}
                setShowMagicPopup={setShowMagicPopup}
                accessToken={accessToken}
                successCallback={onMagicSuccess}
                failureCallback={onMagicFailure}
            />

            <div className="container-xl py-4">
                <div className="mx-auto" style={{maxWidth: 900}}>
                    <div className="card shadow-sm border-0" style={{borderRadius: 20}}>
                        <div className="card-body px-md-5 py-md-4">
                            {/* General Section */}
                            <section className="mb-4">
                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Title <span
                                            className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Summer Promo"
                                            className="form-control"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Subtitle</label>
                                        <input
                                            type="text"
                                            placeholder="(Optional)"
                                            className="form-control"
                                            value={subtitle}
                                            onChange={e => setSubtitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <BaseSelect
                                            label="Campaign Type"
                                            options={campaignTypes}
                                            value={selectedCampaignType.value}
                                            required
                                            onChange={handleCampaignTypeChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <BaseSelect
                                            label="Status"
                                            options={campaignStatues}
                                            value={selectedCampaignStatus.value}
                                            required
                                            onChange={handleCampaignStatusChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Description/Markdown */}
                            <section className="mb-4">
                                <label className="form-label fw-semibold mb-2">Description <span
                                    className="text-danger">*</span></label>
                                <div className="d-flex align-items-center mb-2 gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-success"
                                        style={{color: BRAND_COLOR, borderColor: BRAND_COLOR}}
                                        onClick={() => setShowMagicPopup(true)}
                                    >
                                        ✨ Magic
                                    </button>
                                    <span className="text-muted small">AI content assist</span>
                                </div>
                                <MdEditor
                                    style={{height: 320}}
                                    value={description}
                                    onImageUpload={onImageUpload}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={({text}) => setDescription(text)}
                                />
                            </section>

                            {/* Visuals */}
                            {isImageSupported() && (
                                <section className="mb-4">
                                    <label className="form-label fw-semibold mb-2">Visuals</label>
                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Banner Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerFileChange}
                                                className="form-control"
                                                disabled={isBannerUploading}
                                            />
                                            <small className="text-muted">JPG, PNG, GIF. Max 5MB.</small>
                                            {isBannerUploading && (
                                                <div className="progress mt-2" style={{height: 6}}>
                                                    <div className="progress-bar"
                                                         style={{width: `${bannerUploadProgress}%`}}/>
                                                </div>
                                            )}
                                            {bannerImagePreview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={bannerImagePreview}
                                                        alt="Banner"
                                                        className="rounded shadow-sm"
                                                        style={{maxWidth: 200, maxHeight: 100, objectFit: "cover"}}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger ms-2"
                                                        onClick={removeBannerImage}
                                                    >Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Additional Images</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleAdditionalImagesChange}
                                                className="form-control"
                                                disabled={isUploadingAdditional || additionalImages.length + additionalImageFiles.length >= 5}
                                            />
                                            <small className="text-muted">
                                                Up to 5 images. ({additionalImages.length + additionalImageFiles.length}/5)
                                            </small>
                                            <div className="row g-2 mt-1">
                                                {/* File previews (not yet uploaded) */}
                                                {additionalImageFiles.map((file, idx) => (
                                                    <div key={idx} className="col-4">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="Preview"
                                                            className="rounded shadow-sm w-100"
                                                            style={{height: 60, objectFit: "cover"}}
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-outline-danger w-100 mt-1"
                                                            onClick={() => removeAdditionalImage(idx, true)}
                                                        >Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Uploaded images */}
                                                {additionalImages.map((path, idx) => (
                                                    <div key={idx} className="col-4">
                                                        <img
                                                            src={getSpaceUrl() + "/" + path}
                                                            alt="Additional"
                                                            className="rounded shadow-sm w-100"
                                                            style={{height: 60, objectFit: "cover"}}
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-outline-danger w-100 mt-1"
                                                            onClick={() => removeAdditionalImage(idx, false)}
                                                        >Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Schedule */}
                            <section className="mb-4">
                                <label className="form-label fw-semibold mb-2">Schedule</label>
                                <div className="row gy-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Start Date</label>
                                        <input type="date" className="form-control" value={startDate}
                                               onChange={e => setStartDate(e.target.value)}/>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">End Date</label>
                                        <input type="date" className="form-control" value={endDate}
                                               onChange={e => setEndDate(e.target.value)}/>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Start Time</label>
                                        <input type="time" className="form-control" value={startTime}
                                               onChange={e => setStartTime(e.target.value)}/>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">End Time</label>
                                        <input type="time" className="form-control" value={endTime}
                                               onChange={e => setEndTime(e.target.value)}/>
                                    </div>
                                </div>
                            </section>

                            {/* Action Events */}
                            <section className="mb-4">
                                <label className="form-label fw-semibold mb-2">Actions</label>
                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <BaseSelect
                                            label="Campaign Action"
                                            options={campaignActionEvents}
                                            value={selectedCampaignActionEvent.value}
                                            required
                                            onChange={handleCampaignActionEventChange}
                                        />
                                    </div>
                                    {selectedCampaignActionEvent.value !== "NONE" && (
                                        <div className="col-md-6">
                                            <BaseSelect
                                                label="Post Campaign Action"
                                                options={campaignPostActionEvents}
                                                value={selectedCampaignPostActionEvent.value}
                                                required
                                                onChange={handleCampaignPostActionEventChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                {selectedCampaignActionEvent.value !== "NONE" && (
                                    <div className="mt-3">
                                        <label className="form-label">Action Button Label</label>
                                        <input type="text" className="form-control" value={actionBtnLabel}
                                               onChange={e => setActionBtnLabel(e.target.value)}
                                               placeholder="e.g. Subscribe"/>
                                    </div>
                                )}
                            </section>

                            {/* Subscribe Settings */}
                            {selectedCampaignActionEvent.value === "SUBSCRIBE" && (
                                <section className="mb-4">
                                    <label className="form-label fw-semibold mb-2">Subscribe Settings</label>
                                    <div className="row gy-2">
                                        <div className="col-6 col-md-3">
                                            <label className="form-check form-switch">
                                                <input className="form-check-input" name="is_email_required"
                                                       type="checkbox"
                                                       checked={subscribeConfig.is_email_required}
                                                       onChange={handleSubscribeConfigChange}/>
                                                <span className="ms-2">Email required</span>
                                            </label>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <label className="form-check form-switch">
                                                <input className="form-check-input"
                                                       name="is_email_verification_required" type="checkbox"
                                                       checked={subscribeConfig.is_email_verification_required}
                                                       onChange={handleSubscribeConfigChange}/>
                                                <span className="ms-2">Email verification</span>
                                            </label>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <label className="form-check form-switch">
                                                <input className="form-check-input" name="is_phone_required"
                                                       type="checkbox"
                                                       checked={subscribeConfig.is_phone_required}
                                                       onChange={handleSubscribeConfigChange}/>
                                                <span className="ms-2">Phone required</span>
                                            </label>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <label className="form-check form-switch">
                                                <input className="form-check-input"
                                                       name="is_phone_verification_required" type="checkbox"
                                                       checked={subscribeConfig.is_phone_verification_required}
                                                       onChange={handleSubscribeConfigChange}/>
                                                <span className="ms-2">Phone verification</span>
                                            </label>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Coupon Settings */}
                            {selectedCampaignPostActionEvent.value === "GENERATE_COUPON" && (
                                <section className="mb-4">
                                    <label className="form-label fw-semibold mb-2">Coupon Settings</label>
                                    <div className="row gy-3">
                                        <div className="col-md-4">
                                            <BaseSelect
                                                label="Discount Type"
                                                options={discountTypes}
                                                value={selectedDiscountType.value}
                                                required
                                                onChange={handleDiscountTypeChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Discount Amount</label>
                                            <input
                                                type="number"
                                                step="any"
                                                min={1}
                                                className="form-control"
                                                value={discountAmount}
                                                onChange={e => setDiscountAmount(Number(e.target.value))}
                                                placeholder={selectedDiscountType.value === 'FIXED' ? 'e.g. 100 BDT' : 'e.g. 10%'}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Maximum Usage</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-control"
                                                value={discountMaximumUsage}
                                                onChange={e => setDiscountMaximumUsage(Number(e.target.value))}
                                                placeholder="Max per user"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Valid From</label>
                                            <input type="date" className="form-control" value={discountValidFrom}
                                                   onChange={e => setDiscountValidFrom(e.target.value)}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Valid Until</label>
                                            <input type="date" className="form-control" value={discountValidTo}
                                                   onChange={e => setDiscountValidTo(e.target.value)}/>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Footer Actions */}
                            <div className="d-flex flex-wrap gap-2 justify-content-end pt-3 mt-4 border-top">
                                {project.campaign && (
                                    <button
                                        type="button"
                                        disabled={disableUpdateBtn}
                                        onClick={() => window.open(`${getQrcnUrl()}/${project.project_slug}`, "_blank")}
                                        className="btn btn-outline-secondary"
                                    >
                                        Preview
                                        {disableUpdateBtn && (
                                            <span className="spinner-border spinner-border-sm ms-2"></span>
                                        )}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    disabled={disableUpdateBtn}
                                    className="btn btn-success"
                                    style={{background: BRAND_COLOR, borderRadius: 18}}
                                    onClick={handleCampaignUpsert}
                                >
                                    Save Changes
                                    {disableUpdateBtn && (
                                        <span className="spinner-border spinner-border-sm ms-2"></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    disabled={disableUpdateBtn}
                                    onClick={onContinue}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignSettingsTab;
