import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {customSlugApi, projectApi} from "../../qrcode_api";
import toast, {Toaster} from 'react-hot-toast'
import {copyTextToClipboard, getQrcnUrl, handleApi} from "../../common_api";
import {showErrorMessage} from "../../helpers/errors";
import {mapProjectTypeToResourceUrl} from "../../helpers/helpers";
import { FaRegCopy } from "react-icons/fa6";

const ProjectSettings = ({project, organizationId}) => {
    let router = useRouter();

    const [accessToken, setAccessToken] = useState(
        Cookies.get(QrCentraalCooKieAccessToken)
    );
    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);

    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        project_slug: '',
        status:''
    });

    const [isSlugAvailable, setIsSlugAvailable] = useState(false);
    const [showSlugMessage, setShowSlugMessage] = useState(false);
    const [slugError, setSlugError] = useState("");

    // Only allow a-z, A-Z, 0-9, -, _
    function isValidSlug(slug) {
        return /^[a-zA-Z0-9\-_]+$/.test(slug);
    }

    // On change, prevent disallowed chars and validate
    const handleSlugChange = (e) => {
        let value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, "");
        setProjectData({...projectData, project_slug: value});
        if (value && !isValidSlug(value)) {
            setSlugError("Only use letters, numbers, hyphens (-), and underscores (_).");
        } else {
            setSlugError("");
        }
        setShowSlugMessage(false);
    };

    const handleConfigChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value
        });
    };

    // Check slug availability (only if valid)
    const onSlugAvailabilityCheck = () => {
        if (!projectData.project_slug || !isValidSlug(projectData.project_slug)) {
            setSlugError("Only use letters, numbers, hyphens (-), and underscores (_).");
            setShowSlugMessage(true);
            return;
        }

        setIsSlugAvailable(false);
        setDisableUpdateBtn(true);
        setShowSlugMessage(false);

        let customSlugClient = customSlugApi(accessToken);
        handleApi(null, customSlugClient.customSlugCheck(projectData.project_slug))
            .then(response => {
                if (response.data) {
                    setIsSlugAvailable(true);
                } else {
                    setIsSlugAvailable(false);
                }
            })
            .catch(showErrorMessage)
            .finally(() => {
                setDisableUpdateBtn(false);
                setShowSlugMessage(true);
            });
    };

    // Claim slug (only if valid)
    const onSlugClaim = () => {
        if (!projectData.project_slug || !isValidSlug(projectData.project_slug)) {
            setSlugError("Only use letters, numbers, hyphens (-), and underscores (_).");
            setShowSlugMessage(true);
            return;
        }

        setDisableUpdateBtn(true);

        let customSlugClient = customSlugApi(accessToken);
        handleApi(null, customSlugClient.customSlugClaim(projectData.id, {
            organization_id: organizationId,
            slug: projectData.project_slug
        }))
            .then(response => {
                if (response.data) {
                    toast('Project slug has been claimed', {
                        position: 'top-center',
                        className: 'success',
                    })
                    window.location.reload(true);
                }
            })
            .catch(showErrorMessage)
            .finally(() => {
                setDisableUpdateBtn(false);
            });
    };

    // Project update logic
    const onProjectUpdate = () => {
        if (!project || !project.id) return;
        if (projectData.name.trim() === '') {
            toast.error('Project name cannot be empty');
            return;
        }

        setDisableUpdateBtn(true);

        let projectClient = projectApi(accessToken);
        handleApi(null, projectClient.updateProject(project.id, {
            "organization_id": organizationId,
            "name": projectData.name.trim(),
            "description": projectData.description !== null && projectData.description.trim() !== "" ?
                projectData.description : null,
                "status":projectData.status
        }))
            .then(response => {
                if (response.data) {
                    window.location.reload(true)
                }
            })
            .catch(showErrorMessage)
            .finally(() => {
                setDisableUpdateBtn(false);
            });
    };

    const setupInitialData = (project) => {
        setProjectData({
            ...project,
        });
    };

    useEffect(() => {
        if (project) {
            setupInitialData(project);
        }
    }, [project]);

    const onCopySlug = () => {
        copyTextToClipboard(getQrcnUrl() + `/` + projectData.project_slug);
        toast('Project shareable link copied', {
            position: 'top-center',
            className: 'success',
        })
    };

    return (
        <div>
            <div className="container-xl py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15, flexWrap: "wrap"}}>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>{project.name}</span>
                        </li>
                        <li className="breadcrumb-item">
                            <a href={`/${mapProjectTypeToResourceUrl(project.type)}/${project.id}`}
                               className="text-qrc"
                               style={{textDecoration: "none"}}>
                                <span style={{fontWeight: 500}}>{project.type}</span>
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>Settings</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="row row-cards">
                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className={"card-header"}>
                                        <span className={"h2 mb-0"}>
                                            {project.name}'s Settings
                                        </span>
                                    </div>

                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label h3 required">Project Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="Awesome project name"
                                                value={projectData.name}
                                                onChange={handleConfigChange}
                                                className="form-control form-control-color w-100"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label h3">Project Description</label>
                                            <input
                                                name="description"
                                                type="text"
                                                placeholder="Awesome project description"
                                                value={projectData.description}
                                                onChange={handleConfigChange}
                                                className="form-control form-control-color w-100"
                                            />
                                        </div>
                                        <div className="mb-3">
                                              <label className="form-label h3">Project Status</label>
                                              <select
                                               name="status"
                                               className="form-control form-control-color w-100"
                                               defaultValue={projectData.status}
                                               onChange={handleConfigChange}
                                              >
                                               <option value="" disabled hidden>
                                                 -- Select status --
                                              </option>
                                             <option value="active">Active</option>
                                             <option value="inactive">Inactive</option>
                                              </select>
                                          </div>
                                    </div>
                                    <div className="card-footer p-0 pt-3 text-end w-100">
                                        <button
                                            disabled={disableUpdateBtn}
                                            onClick={onProjectUpdate}
                                            className="btn btn-qrc col-12 col-md-4 mb-3 me-5">
                                            Save Changes
                                            {disableUpdateBtn && (
                                                <>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <div
                                                        className="spinner-border spinner-border-sm text-white"
                                                        role="status"
                                                    ></div>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <label className="form-label h3 required">
                                            Project Slug
                                        </label>
                                        <small className="form-hint pb-2">
                                            Your shareable public link. Use only letters, numbers, hyphens (–), and
                                            underscores (_). Changing your slug will reset project analytics.
                                        </small>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                {getQrcnUrl()}/
                                            </span>
                                            <input
                                                name="project_slug"
                                                type="text"
                                                placeholder="your-unique-slug"
                                                value={projectData.project_slug}
                                                onChange={handleSlugChange}
                                                className={`form-control form-control-color${slugError ? ' is-invalid' : ''}`}
                                                style={{fontWeight: 500, letterSpacing: ".01em"}}
                                            />
                                            <button
                                                onClick={onCopySlug}
                                                type="button" className="btn">
                                                <FaRegCopy />&nbsp;
                                                Copy
                                            </button>
                                        </div>
                                        {slugError && (
                                            <div className="invalid-feedback" style={{display: "block"}}>
                                                {slugError}
                                            </div>
                                        )}
                                        {showSlugMessage && (
                                            <small className="form-hint text-qrc">
                                                Slug "{projectData.project_slug}"
                                                is {isSlugAvailable ? "available" : "unavailable"}
                                            </small>
                                        )}
                                    </div>
                                    <div className="card-footer p-0 pt-3 text-end w-100">
                                        <button
                                            disabled={disableUpdateBtn}
                                            onClick={onSlugAvailabilityCheck}
                                            className="btn btn-outline-green col-auto mb-3 me-2">
                                            Check Availability
                                            {disableUpdateBtn && (
                                                <>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <div
                                                        className="spinner-border spinner-border-sm text-qrc"
                                                        role="status"
                                                    ></div>
                                                </>
                                            )}
                                        </button>
                                        &nbsp;&nbsp;
                                        <button
                                            disabled={!isSlugAvailable || disableUpdateBtn}
                                            onClick={onSlugClaim}
                                            className="btn btn-qrc col-auto mb-3 me-5">
                                            Claim Slug
                                            {disableUpdateBtn && (
                                                <>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <div
                                                        className="spinner-border spinner-border-sm text-white"
                                                        role="status"
                                                    ></div>
                                                </>
                                            )}
                                        </button>
                                    </div>
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

export default ProjectSettings;
