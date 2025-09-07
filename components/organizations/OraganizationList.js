import React, {useEffect, useState} from 'react'
import ProcessingRequestMsgModal from '../modals/ProcessingRequestMsgModal'
import Cookies from 'js-cookie'
import {QrCentraalCooKieAccessToken, QrCentraalOrgId} from '../../utils/cookie'
import {organizationApi} from '../../core_api'
import {handleApi, productDomain} from "../../common_api";
import {showErrorMessage} from "../../helpers/errors";

const OrganizationList = ({}) => {
    const [organizations, setOrganizations] = useState([])

    const [showProcessingModal, setShowProcessingModal] = useState(true)
    const [showProcessingModalTitle, setShowProcessingModalTitle] = useState('Hold tight')
    const [showProcessingModalMessage, setShowProcessingModalMessage] = useState('Fetching organizations...')

    const [showOrganizationCreateModal, setShowOrganizationCreateModal] = useState(false)

    const [accessToken, setAccessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken))
    const [organizationClient, setOrganizationClient] = useState(organizationApi(accessToken))

    useEffect(() => {
        if (!organizations || organizations.length === 0) {
            listOrganizations();
        }
    }, [organizations])

    const listOrganizations = () => {
        handleApi(
            null,
            organizationClient.listOrganizations(productDomain())
        )
            .then((response) => {
                console.log(response.data)

                if (response.data.length > 0) {
                    setOrganizations(response.data)
                }

                setShowProcessingModal(false)
            })
            .catch(showErrorMessage)
            .finally(() => {
                setShowProcessingModal(false)
            });
    }

    const [orgName, setOrgName] = useState('')
    const [disableOrgCreateBtn, setDisableOrgCreateBtn] = useState(false)

    const onCreateOrganization = () => {
        if (orgName.trim() === '') {
            return
        }
        setDisableOrgCreateBtn(true)

        organizationClient
            .organizationCreate({
                name: orgName,
                product_domain: productDomain(),
            })
            .then(() => {
                setDisableOrgCreateBtn(false)
                setShowOrganizationCreateModal(false)
                setShowProcessingModal(true)
                listOrganizations()
                setOrgName('')
            })
            .catch(showErrorMessage)
            .finally(() => {
                setDisableOrgCreateBtn(false)
                setShowOrganizationCreateModal(false)
            });
    }

    const onContinue = (selectedOrg) => {
        Cookies.set(QrCentraalOrgId, selectedOrg.id)
        window.location.replace(`/dashboard/qr-codes/create`)
    }

    return (<>
            <div className="page-wrapper">
                <div className="page-body">
                    <ProcessingRequestMsgModal
                        show={showProcessingModal}
                        title={showProcessingModalTitle}
                        message={showProcessingModalMessage}
                    />

                    <div className={`modal modal-blur fade ${showOrganizationCreateModal ? 'show d-block' : ''}`}
                         tabIndex="-1"
                         role="dialog"
                         aria-hidden={!showOrganizationCreateModal}>
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="modal-title">Add Organization</div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label required">Organization Name</label>
                                            <div>
                                                <input type="email" className="form-control"
                                                       aria-describedby="emailHelp"
                                                       value={orgName}
                                                       onChange={(e) => setOrgName(e.target.value)}
                                                       placeholder="What’s your organization called?"/>
                                                <small className="form-hint">
                                                    Resources will be associated with the organization. After setup,
                                                    invite team members to collaborate.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer text-end">
                                        <button
                                            onClick={() => setShowOrganizationCreateModal(false)}
                                            className="btn">
                                            Cancel
                                        </button>

                                        <button
                                            disabled={disableOrgCreateBtn}
                                            onClick={onCreateOrganization}
                                            className="btn btn-qrc">
                                            Create
                                            {disableOrgCreateBtn && (
                                                <div className="spinner-border spinner-border-sm text-white"
                                                     role="status"></div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-xl">
                        <div className="row row-cards">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                        <h3 className="card-title">Organizations</h3>

                                        <button
                                            onClick={() => setShowOrganizationCreateModal(true)}
                                            className={'btn btn-qrc'}>
                                            Add Organization
                                        </button>
                                    </div>

                                    <div className="card-body">
                                        <div className="list-group list-group-flush">
                                            {organizations && organizations.length > 0 &&
                                                organizations.map(organization => (
                                                    <div className="list-group-item"
                                                         key={organization.id}>
                                                        <div className="row align-items-center">
                                                            <div className="col text-truncate">
                                                                <a href="#"
                                                                   onClick={event => {
                                                                       event.preventDefault()
                                                                       onContinue(organization)
                                                                   }}
                                                                   className="text-reset d-block">
                                                                    {organization.name}
                                                                </a>
                                                                <div
                                                                    className="d-block text-secondary text-truncate mt-n1">
                                                                    {organization.context_user_role}
                                                                </div>
                                                            </div>
                                                            <div className="col-auto">
                                                                <a class={'btn btn-qrc'}
                                                                   href={'#'}
                                                                   onClick={event => {
                                                                       event.preventDefault()
                                                                       onContinue(organization)
                                                                   }}>
                                                                    Browse
                                                                </a>
                                                            </div>
                                                            <div className="col-auto">
                                                                <a class={'btn btn-qrc'}
                                                                   href={`/dashboard/organizations/${organization.id}/manage`}>
                                                                    Manage
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        {(organizations?.length === 0) && (
                                            <div className="col-12">
                                                No organization found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrganizationList
