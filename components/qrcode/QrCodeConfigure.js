import {useRouter} from "next/router";
import {mapProjectTypeToResourceUrl} from "../../helpers/helpers";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {getQrCodeSvcUrl, qrCodeConfigApi} from "../../qrcode_api";
import ProcessingRequestMsgModal from "../modals/ProcessingRequestMsgModal";
import {multimediaApi} from "../../core_api";
import {copyTextToClipboard, getQrcnUrl, handleApi} from "../../common_api";
import {showErrorMessage} from "../../helpers/errors";
import toast, {Toaster} from 'react-hot-toast';

const QrCodeConfigure = ({project}) => {
    const router = useRouter();
    const [qrCodePatterns] = useState([
        {index: 0, view: "/static/qrcode/pattern/pattern_triangle.png", value: "TRIANGLE"},
        {index: 1, view: "/static/qrcode/pattern/pattern_heart.png", value: "HEART"},
        {index: 2, view: "/static/qrcode/pattern/pattern_diamond.png", value: "DIAMOND"},
        {index: 3, view: "/static/qrcode/pattern/pattern_hexagon.png", value: "HEXAGON"},
        {index: 4, view: "/static/qrcode/pattern/pattern_house.png", value: "HOUSE"},
        {index: 5, view: "/static/qrcode/pattern/pattern_star.png", value: "STAR"},
        {index: 6, view: "/static/qrcode/pattern/pattern_cross.png", value: "CROSS"}
    ]);
    const [qrCodeShapes] = useState([
        {index: 0, view: "/static/qrcode/shape/shape_square.png", value: "SQUARE"},
        {index: 1, view: "/static/qrcode/shape/shape_circle.png", value: "CIRCLE"}
    ]);

    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);

    const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState("");
    const [generatedQrCodeAsPdfUrl, setGeneratedQrCodeAsPdfUrl] = useState("");
    const [generatedQrCodeAsSvgUrl, setGeneratedQrCodeAsSvgUrl] = useState("");
    const [showProcessingModal, setShowProcessingModal] = useState(true);
    const [showProcessingModalTitle, setShowProcessingModalTitle] = useState("Almost ready!");
    const [showProcessingModalMessage, setShowProcessingModalMessage] = useState("Preparing configuration...");
    const [qrLogoFile, setQrLogoFile] = useState(null);

    const [qrcodeConfig, setQrcodeConfig] = useState({
        background_color: "#ffffff",
        fill_color: "#000000",
        logo_path: null,
        qr_pattern: 0,
        qr_shape: 0,
        qr_header_text: "",
        qr_footer_text: "",
        qr_size: 1024
    });
    const [initialSetupComplete, setInitialSetupComplete] = useState(false);

    const handleConfigChange = (field, value) => setQrcodeConfig(prev => ({...prev, [field]: value}));

    const onGoBack = () => router.push(`/${mapProjectTypeToResourceUrl(project.type)}/${project.id}`);

    const handleRenderQr = (id) => {
        setGeneratedQrCodeUrl("");
        setGeneratedQrCodeAsPdfUrl("");
        setGeneratedQrCodeAsSvgUrl("");
        setTimeout(() => {
            setGeneratedQrCodeUrl(getQrCodeSvcUrl() + `/projects/${id}/qr-codes/generate?qrOutputFormat=PNG&Authorization=${accessToken}`);
            setGeneratedQrCodeAsSvgUrl(getQrCodeSvcUrl() + `/projects/${id}/qr-codes/generate?qrOutputFormat=SVG&Authorization=${accessToken}`);
            setGeneratedQrCodeAsPdfUrl(getQrCodeSvcUrl() + `/projects/${id}/qr-codes/generate-pdf?qrSize=150&Authorization=${accessToken}`);
            setDisableUpdateBtn(false);
        }, 600); // slightly faster feedback
    };

    const onConfigure = () => {
        if (!project?.id) return;
        setDisableUpdateBtn(true);
        let qrCodeApiClient = qrCodeConfigApi(accessToken);
        handleApi(null, qrCodeApiClient.qrCodeConfigUpdate(project.id, {
            background_color: qrcodeConfig.background_color,
            fill_color: qrcodeConfig.fill_color,
            logo_path: qrcodeConfig.logo_path !== "" ? qrcodeConfig.logo_path : null,
            qr_pattern: qrcodeConfig.qr_pattern,
            qr_shape: qrcodeConfig.qr_shape,
            qr_header_text: qrcodeConfig.qr_header_text,
            qr_footer_text: qrcodeConfig.qr_footer_text,
            qr_size: qrcodeConfig.qr_size,
        }))
            .then(() => handleRenderQr(project.id))
            .catch(showErrorMessage)
            .finally(() => setDisableUpdateBtn(false));
    };

    const handleQrLogoChange = (event) => setQrLogoFile(event.target.files[0]);
    const handleQrLogoUpload = () => {
        if (!qrLogoFile) return;
        setShowProcessingModal(true);
        setShowProcessingModalTitle("Processing request");
        setShowProcessingModalMessage("QR logo is being uploaded...");
        let multimediaApiClient = multimediaApi(accessToken);
        handleApi(null, multimediaApiClient.uploadMultimedia({file: qrLogoFile}))
            .then((response) => {
                handleConfigChange('logo_path', response.data.file_path);
                onConfigure();
            })
            .catch(showErrorMessage)
            .finally(() => setShowProcessingModal(false));
    };

    const setupInitialData = (project) => {
        if (project.qr_code_config) {
            let pattern = qrCodePatterns.find(p => p.value === project.qr_code_config.qr_pattern)?.index ?? 0;
            let shape = qrCodeShapes.find(p => p.value === project.qr_code_config.qr_shape)?.index ?? 0;
            setQrcodeConfig({
                ...qrcodeConfig,
                background_color: project.qr_code_config.background_color,
                fill_color: project.qr_code_config.fill_color,
                logo_path: project.qr_code_config.logo_path,
                qr_footer_text: project.qr_code_config.qr_footer_text,
                qr_header_text: project.qr_code_config.qr_header_text,
                qr_pattern: pattern,
                qr_shape: shape,
            });
        }
        setInitialSetupComplete(true);
        setShowProcessingModal(false);
    };

    useEffect(() => {
        if (project) setupInitialData(project);
        // eslint-disable-next-line
    }, [project]);
    useEffect(() => {
        if (qrLogoFile) handleQrLogoUpload();
        // eslint-disable-next-line
    }, [qrLogoFile]);
    useEffect(() => {
        if (qrcodeConfig && initialSetupComplete) onConfigure();
        // eslint-disable-next-line
    }, [qrcodeConfig, initialSetupComplete]);

    const handleCopyLink = () => {
        copyTextToClipboard(`${getQrcnUrl()}/${project.project_slug}`);
        toast.success('Link copied.', {position: 'top-center'});
    };

    return (
        <div>
            <ProcessingRequestMsgModal
                show={showProcessingModal}
                title={showProcessingModalTitle}
                message={showProcessingModalMessage}
            />
            <div className="container-xl py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15, flexWrap: "wrap"}}>
                        <li className="breadcrumb-item active" aria-current="page"><span
                            style={{fontWeight: 500}}>{project.name}</span></li>
                        <li className="breadcrumb-item">
                            <a href={`/${mapProjectTypeToResourceUrl(project.type)}/${project.id}`} className="text-primary"
                               style={{textDecoration: "none"}}>
                                <span style={{fontWeight: 500}}>{project.type}</span>
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>QR Code</span>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="container-xl">
                <div className="row row-cards">
                    {/* --- Settings Panel --- */}
                    <div className="col-lg-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <span className="h2 mb-0">{project?.name}'s QR Code Settings</span>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="form-label h3">QR Header</label>
                                    <input
                                        type="text"
                                        placeholder={"Scan me"}
                                        value={qrcodeConfig.qr_header_text ?? ''}
                                        onChange={e => handleConfigChange('qr_header_text', e.target.value)}
                                        className="form-control w-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label h3">QR Footer</label>
                                    <input
                                        type="text"
                                        placeholder={"Scan me"}
                                        value={qrcodeConfig.qr_footer_text ?? ''}
                                        onChange={e => handleConfigChange('qr_footer_text', e.target.value)}
                                        className="form-control w-100"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-4">
                                        <label className="form-label h3 required">Background Color</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            onChange={event => handleConfigChange('background_color', event.target.value)}
                                            value={qrcodeConfig.background_color}
                                            title="Choose your color"
                                        />
                                    </div>
                                    <div className="col-6 mb-4">
                                        <label className="form-label h3 required">Pattern Color</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            onChange={e => handleConfigChange('fill_color', e.target.value)}
                                            value={qrcodeConfig.fill_color}
                                            title="Choose your color"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label h3 required">Pattern</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {qrCodePatterns.map(pattern => (
                                            <label key={pattern.index} className="form-imagecheck mb-0 me-2"
                                                   style={{cursor: 'pointer'}}>
                                                <input
                                                    name="pattern-selector"
                                                    onChange={() => handleConfigChange('qr_pattern', pattern.index)}
                                                    checked={qrcodeConfig.qr_pattern === pattern.index}
                                                    type="radio"
                                                    value={pattern.index}
                                                    className="form-imagecheck-input"
                                                />
                                                <span className="form-imagecheck-figure">
                                                    <img style={{width: 64, height: 64, objectFit: "contain"}}
                                                         src={pattern.view} alt=""/>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label h3 required">Corners Style</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {qrCodeShapes.map(shape => (
                                            <label key={shape.index} className="form-imagecheck mb-0 me-2"
                                                   style={{cursor: 'pointer'}}>
                                                <input
                                                    name="shape-selector"
                                                    onChange={() => handleConfigChange('qr_shape', shape.index)}
                                                    checked={qrcodeConfig.qr_shape === shape.index}
                                                    type="radio"
                                                    value={shape.index}
                                                    className="form-imagecheck-input"
                                                />
                                                <span className="form-imagecheck-figure">
                                                    <img style={{width: 64, height: 64, objectFit: "contain"}}
                                                         src={shape.view} alt=""/>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label h3">QR Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQrLogoChange}
                                        className="form-control"
                                    />
                                    {qrcodeConfig.logo_path && (
                                        <div className="pt-2">
                                            <img
                                                src={qrcodeConfig.logo_path.startsWith("http") ? qrcodeConfig.logo_path : getQrCodeSvcUrl() + "/media/" + qrcodeConfig.logo_path}
                                                alt="QR Logo Preview"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "contain",
                                                    borderRadius: 6,
                                                    border: "1px solid #eee"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between gap-2 mt-4">
                                    <button
                                        onClick={onGoBack}
                                        type="button"
                                        className="btn btn-secondary px-4 py-2 flex-grow-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={disableUpdateBtn}
                                        onClick={onConfigure}
                                        className="btn btn-primary px-4 py-2 flex-grow-1"
                                    >
                                        Configure
                                        {disableUpdateBtn && (
                                            <span className="ms-2 spinner-border spinner-border-sm text-white"
                                                  role="status"></span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- Preview Panel --- */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <span className="h2 mb-0">Preview</span>
                            </div>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center"
                                 style={{minHeight: 400}}>
                                {!generatedQrCodeUrl ? (
                                    <div className="w-100 d-flex flex-column align-items-center justify-content-center"
                                         style={{height: 300}}>
                                        <div className="spinner-border text-primary mb-3" role="status"></div>
                                        <div className="text-muted">Generating QR code...</div>
                                    </div>
                                ) : (
                                    <img
                                        style={{width: 260, maxWidth: "90%"}}
                                        src={generatedQrCodeUrl}
                                        alt="QR Preview"
                                        className="img-fluid object-contain shadow rounded"
                                    />
                                )}
                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                    <button
                                        disabled={disableUpdateBtn || !generatedQrCodeUrl}
                                        onClick={() => window.open(generatedQrCodeUrl, '_blank')}
                                        className="btn btn-primary px-4 py-2"
                                    >
                                        Download PNG
                                    </button>
                                    <button
                                        disabled={disableUpdateBtn || !generatedQrCodeAsSvgUrl}
                                        onClick={() => window.open(generatedQrCodeAsSvgUrl, '_blank')}
                                        className="btn btn-primary px-4 py-2"
                                    >
                                        Download SVG
                                    </button>
                                    <button
                                        disabled={disableUpdateBtn || !generatedQrCodeAsPdfUrl}
                                        onClick={() => window.open(generatedQrCodeAsPdfUrl, '_blank')}
                                        className="btn btn-outline-teal px-4 py-2"
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        disabled={disableUpdateBtn}
                                        onClick={handleCopyLink}
                                        className="btn btn-outline-green px-4 py-2"
                                    >
                                        Copy Shareable Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster/>
        </div>
    );
};

export default QrCodeConfigure;
