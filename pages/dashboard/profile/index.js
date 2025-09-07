import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'
import {userApi} from '../../../core_api'
import {QrCentraalCooKieAccessToken} from '../../../utils/cookie'
import {handleApi} from '../../../common_api'
import {showErrorMessage} from '../../../helpers/errors'
import InputField from '../../../components/common/InputField'
import ProcessingRequestMsgModal from '../../../components/modals/ProcessingRequestMsgModal'
import toast from 'react-hot-toast'
import BaseSelect from "../../../components/base/BaseSelect";
import PasswordChangeForm from '../../../components/common/PasswordChangeForm'

export default function Profile() {
    const router = useRouter()
    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken))

    const supportedCurrencies = [
        {label: 'USD', value: 'USD'},
        {label: 'EUR', value: 'EUR'},
        {label: 'BDT', value: 'BDT'}
    ];
    const supportedLanguages = [
        {label: 'English', value: 'En'},
        {label: 'Bengali', value: 'Bn'}
    ];

    // User data state
    const [userData, setUserData] = useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        productDomain: '',
        currency: 'USD',
        language: 'En'
    });

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        currency: 'USD',
        language: 'En'
    });

    // UI state
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showProcessingModal, setShowProcessingModal] = useState(false)

    // Validation state
    const [errors, setErrors] = useState({})
    const [hasDataChanges, setHasDataChanges] = useState(false)

    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
            return
        }
        fetchUserData()
        // eslint-disable-next-line
    }, [accessToken])

    // Fetch user profile data
    const fetchUserData = () => {
        setIsLoading(true)
        const userClient = userApi(accessToken)
        handleApi(null, userClient.userMe())
            .then(resp => {
                const user = resp.data
                setUserData({
                    id: user.id || '',
                    email: user.email || '',
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    productDomain: user.product_domain || '',
                    currency: user.currency,
                    language: user.language
                })
                setFormData({
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    currency: user.currency,
                    language: user.language
                })
            })
            .catch(error => {
                showErrorMessage(error)
                if (error?.status === 401) {
                    router.push('/login')
                }
            })
            .finally(() => setIsLoading(false))
    }

    // Track if there are changes in the form
    useEffect(() => {
        setHasDataChanges(
            formData.firstName !== userData.firstName ||
            formData.lastName !== userData.lastName ||
            formData.language !== userData.language ||
            formData.currency !== userData.currency
        )
        // eslint-disable-next-line
    }, [formData, userData])

    // Input handling
    const handleInputChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}))
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}))
        }
    }

    // Validate form fields
    const validateForm = () => {
        const newErrors = {}
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsUpdating(true)
        setShowProcessingModal(true)
        const userClient = userApi(accessToken)
        handleApi(null, userClient.updateUser({
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            currency: formData.currency.trim(),
            language: formData.language.trim(),
        }))
            .then(resp => {
                setUserData({
                    ...userData,
                    firstName: resp.data.firstName,
                    lastName: resp.data.lastName,
                    currency: resp.data.currency,
                    language: resp.data.language,
                })
                toast.success('Profile updated!', {position: 'top-center'})
                setHasDataChanges(false)
            })
            .catch(showErrorMessage)
            .finally(() => {
                setIsUpdating(false)
                setShowProcessingModal(false)
            })
    }

    // Reset unsaved changes
    const resetChanges = () => {
        setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            currency: userData.currency,
            language: userData.language,
        })
        setErrors({})
    }

    if (isLoading) {
        return (
            <div className="page-wrapper">
                <div className="page-body">
                    <div className="container-xl">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-8">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="spinner-border" role="status"/>
                                        <p className="mt-3">Loading profile...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="page-header mt-0 d-print-none">
                        <div className="row g-2 align-items-center">
                            <div className="col">
                                <h2 className="page-title mb-0">Profile Settings</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <div className="col-12 col-lg-8">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="card-title mb-0">Account Information</h3>
                                </div>
                                <div className="card-body">
                                    {/* Read-only Info */}
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <InputField
                                                label="User ID"
                                                type="text"
                                                value={userData.id}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputField
                                                label="Email Address"
                                                type="email"
                                                value={userData.email}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <hr className="mb-4"/>
                                    {/* Editable Info */}
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="row">
                                            <div className="col-12 mb-4">
                                                <p className="text-muted mb-2">
                                                    Update your personal information below.
                                                </p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <InputField
                                                    label="First Name"
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={e => handleInputChange('firstName', e.target.value)}
                                                    placeholder="Enter your first name"
                                                    error={errors.firstName}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <InputField
                                                    label="Last Name"
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={e => handleInputChange('lastName', e.target.value)}
                                                    placeholder="Enter your last name"
                                                    error={errors.lastName}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <BaseSelect
                                                    label="Preferred Currency"
                                                    className="form-label"
                                                    options={supportedCurrencies}
                                                    value={formData.currency}
                                                    required
                                                    onChange={e => handleInputChange('currency', e.target.value)}
                                                />
                                                <label className="form-hint small pt-1 ps-1">
                                                    Select the currency you wish to be billed in.
                                                </label>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <BaseSelect
                                                    label="Preferred Language"
                                                    className="form-label"
                                                    options={supportedLanguages}
                                                    value={formData.language}
                                                    required
                                                    onChange={e => handleInputChange('language', e.target.value)}
                                                />
                                                <label className="form-hint small pt-1 ps-1">
                                                    Choose the language for your experience.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="d-flex flex-wrap gap-2 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-qrc px-4 py-2"
                                                        disabled={isUpdating || !hasDataChanges}
                                                    >
                                                        {isUpdating ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2"
                                                                      role="status"></span>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            'Update Profile'
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary px-4 py-2"
                                                        onClick={resetChanges}
                                                        disabled={isUpdating || !hasDataChanges}
                                                    >
                                                        Reset Changes
                                                    </button>
                                                </div>
                                                {hasDataChanges && (
                                                    <div className="mt-2">
                                                        <small className="text-warning">
                                                            You have unsaved changes.
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* Password Change Section */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0">Change Password</h3>
                                </div>
                                <div className="card-body">
                                    <PasswordChangeForm accessToken={accessToken}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProcessingRequestMsgModal
                show={showProcessingModal}
                title="Updating Profile"
                message="Please wait while we update your profile information..."
            />
        </div>
    )
}
