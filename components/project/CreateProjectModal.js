import React, {useState, useEffect, useRef} from 'react'
import {QrCentraalCooKieAccessToken, QrCentraalOrgId} from '../../utils/cookie'
import Cookies from 'js-cookie'
import {projectApi} from '../../qrcode_api'
import {showErrorMessage} from '../../helpers/errors'
import {handleApi} from '../../common_api'

const CreateProjectModal = ({
                                projectType,
                                show,
                                onClose,
                                onSuccess,
                                onFailure,
                            }) => {
    const [disableCreateBtn, setDisableCreateBtn] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [organizationId, setOrganizationId] = useState(Cookies.get(QrCentraalOrgId))

    // Focus input on open
    const inputRef = useRef()
    useEffect(() => {
        if (show && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 200)
        }
    }, [show])

    const onCreateProject = () => {
        if (projectName.trim() === '') return

        setDisableCreateBtn(true)
        const accessToken = Cookies.get(QrCentraalCooKieAccessToken)
        const projectClient = projectApi(accessToken)
        handleApi(
            null,
            projectClient.createProjectWithHttpInfo({
                name: projectName,
                type: projectType?.type,
                description: null,
                organization_id: organizationId,
            })
        ).then(response => {
            setDisableCreateBtn(false)
            setProjectName('')
            onSuccess(response.data)
        }).catch(e => {
            setDisableCreateBtn(false)
            showErrorMessage(e)
            onFailure && onFailure(e)
        })
    }

    const onCloseModal = () => {
        if (!disableCreateBtn) {
            setProjectName('')
            onClose()
        }
    }

    // Allow ESC to close
    useEffect(() => {
        const esc = e => {
            if (e.key === 'Escape') onCloseModal()
        }
        if (show) window.addEventListener('keydown', esc)
        return () => window.removeEventListener('keydown', esc)
        // eslint-disable-next-line
    }, [show, disableCreateBtn])

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!show}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth: 420}} role="document">
                <div className="modal-content border-0">
                    <div className="modal-body py-4 px-4" style={{borderRadius: 18}}>
                        <div className="text-center mb-4">
                            <div>
                                <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5l0 14"/>
                                    <path d="M5 12l14 0"/>
                                </svg>
                            </div>
                            <div className="fw-bold h3">
                                New Project
                            </div>
                            {projectType?.name && (
                                <div className="small text-muted mt-2">
                                  <span>
                                    {projectType.name}
                                  </span>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">
                                Project Name <span className="text-danger">*</span>
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control"
                                placeholder="Enter a project name"
                                value={projectName}
                                onChange={event => setProjectName(event.target.value)}
                                disabled={disableCreateBtn}
                                onKeyUp={event => {
                                    if (event.key === 'Enter') onCreateProject()
                                }}
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center gap-3">
                            <button
                                className="btn btn-link px-0"
                                onClick={onCloseModal}
                                disabled={disableCreateBtn}>
                                Cancel
                            </button>
                            <button
                                disabled={disableCreateBtn || !projectName.trim()}
                                className="btn btn-primary"
                                onClick={onCreateProject}
                                type="button">
                                {disableCreateBtn ? (
                                    <span>
                                    <span className="spinner-border spinner-border-sm text-light me-2"
                                          role="status" style={{verticalAlign: -2}}/>
                                    Creating...
                                  </span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22}
                                             viewBox="0 0 24 24" strokeWidth="2"
                                             stroke="currentColor" fill="none"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="me-1" style={{verticalAlign: "-3px"}}>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M12 5l0 14"/>
                                            <path d="M5 12l14 0"/>
                                        </svg>
                                        Create
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectModal
