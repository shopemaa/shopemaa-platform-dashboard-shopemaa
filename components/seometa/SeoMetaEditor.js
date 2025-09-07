import React, {useRef, useState} from "react";
import {getSpaceUrl, multimediaApi} from "../../core_api";
import {showErrorMessage} from "../../helpers/errors";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {projectApi} from "../../qrcode_api";
import toast from "react-hot-toast";

// --- Image uploader with preview ---
function ImageInput({label, value, onChange}) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);
    const [accessToken] = useState(() => Cookies.get(QrCentraalCooKieAccessToken));

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        try {
            let multimediaClient = multimediaApi(accessToken);
            const response = await multimediaClient.uploadMultimedia({file});
            const url = getSpaceUrl() + '/' + response.data.file_path;
            onChange && onChange(url);
        } catch (err) {
            showErrorMessage(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <div className="d-flex align-items-center gap-3">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => ref.current.click()}
                    disabled={uploading}
                >
                    {uploading ? "Uploading…" : "Upload"}
                </button>
                <input
                    ref={ref}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={handleFile}
                />
                {value && (
                    <img
                        src={value}
                        alt="OG/Favicon preview"
                        style={{
                            height: 48,
                            width: 48,
                            borderRadius: 8,
                            border: "1px solid #eee",
                            objectFit: "cover"
                        }}
                        className="ms-2"
                    />
                )}
            </div>
        </div>
    );
}

// --- Main Meta Editor form ---
export default function SeoMetaEditor({meta, projectId}) {
    const [updatedMeta, setUpdateMeta] = useState({...meta});
    const [isUpdating, setIsUpdating] = useState(false);
    const [accessToken] = useState(() => Cookies.get(QrCentraalCooKieAccessToken));

    const set = (patch) => {
        setUpdateMeta({...updatedMeta, ...patch});
    };

    const onSaveMetadata = () => {
        setIsUpdating(true);
        const projectClient = projectApi(accessToken);
        projectClient.updateProjectSeoMetadata(projectId, updatedMeta)
            .then(() => {
                setIsUpdating(false);
                toast('Updated successfully.', {
                    position: 'top-center',
                    autoClose: 5000,
                    className: "text-success",
                });
            })
            .catch((err) => {
                console.log(err);
                toast('Update request failed. Please try again.', {
                    position: 'top-center',
                    autoClose: 5000,
                    className: "text-danger",
                });
            })
            .finally(() => {
                setIsUpdating(false);
            });
    }

    return (
        <div className="card shadow-sm p-4" style={{maxWidth: 500}}>
            <div className="mb-3">
                <label className="form-label">Meta Title</label>
                <input
                    className="form-control"
                    maxLength={70}
                    value={updatedMeta.title || ""}
                    onChange={e => set({title: e.target.value})}
                    placeholder="My Awesome Landing Page"
                />
                <small className="form-text text-muted">
                    Max 70 chars. Shown in search results and browser tab.
                </small>
            </div>

            <div className="mb-3">
                <label className="form-label">Meta Description</label>
                <textarea
                    className="form-control"
                    maxLength={160}
                    rows={2}
                    value={updatedMeta.description || ""}
                    onChange={e => set({description: e.target.value})}
                    placeholder="Describe your page for search engines (max 160 chars)"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Canonical URL</label>
                <input
                    className="form-control"
                    type="url"
                    value={updatedMeta.url || ""}
                    onChange={e => set({url: e.target.value})}
                    placeholder="https://yoursite.com/"
                />
            </div>

            <ImageInput
                label="Banner Image"
                value={updatedMeta.banner_path}
                onChange={url => set({banner_path: url})}
            />

            <ImageInput
                label="Favicon Image"
                value={updatedMeta.favicon_path}
                onChange={url => set({favicon_path: url})}
            />

            <button
                onClick={() => {
                    onSaveMetadata()
                }}
                disabled={isUpdating} className={'btn btn-qrc'}>
                Save
                &nbsp;
                {isUpdating && (
                    <span
                        className="ms-2 spinner-border spinner-border-sm text-white"
                        role="status"
                    />
                )}
            </button>
        </div>
    );
}
