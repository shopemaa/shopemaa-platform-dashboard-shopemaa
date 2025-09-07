import React, { useState, useEffect } from 'react'
import { userApi } from '../../core_api'
import { handleApi } from '../../common_api'
import { showErrorMessage } from '../../helpers/errors'
import InputField from './InputField'
import ProcessingRequestMsgModal from '../modals/ProcessingRequestMsgModal'
import toast from 'react-hot-toast'

export default function PasswordChangeForm({ accessToken }) {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const [passwordErrors, setPasswordErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [hasPasswordChanges, setHasPasswordChanges] = useState(false)

    useEffect(() => {
        checkPasswordChanges()
    }, [passwordData])

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }))

        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const checkPasswordChanges = () => {
        const hasChange = passwordData.oldPassword.trim() !== '' ||
            passwordData.newPassword.trim() !== '' ||
            passwordData.confirmPassword.trim() !== ''
        setHasPasswordChanges(hasChange)
    }

    const validatePasswordForm = () => {
        const newErrors = {}

        if (!passwordData.oldPassword.trim()) {
            newErrors.oldPassword = 'Current password is required'
        }

        if (!passwordData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required'
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long'
        }

        if (!passwordData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password'
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (passwordData.oldPassword === passwordData.newPassword && passwordData.oldPassword.trim()) {
            newErrors.newPassword = 'New password must be different from current password'
        }

        setPasswordErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()

        if (!validatePasswordForm()) {
            return
        }

        setIsChangingPassword(true)
        setShowPasswordModal(true)

        const userClient = userApi(accessToken)

        handleApi(
            null,
            userClient.changeUserPassword({
                old_password: passwordData.oldPassword,
                new_password: passwordData.newPassword
            })
        ).then(() => {
            toast.success('Password changed successfully!', {
                position: 'top-center'
            })

            resetPasswordForm()
        }).catch(showErrorMessage)
            .finally(() => {
                setIsChangingPassword(false)
                setShowPasswordModal(false)
            })
    }

    const resetPasswordForm = () => {
        setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setPasswordErrors({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    return (
        <>
            <div className="card mt-4">
                <div className="card-header">
                    <h3 className="card-title">Password</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="row">
                            <div className="col-12">
                                <p className="text-muted mb-4">
                                    Change your account password.
                                </p>
                            </div>
                            <div className="col-12">
                                <InputField
                                    label="Current Password"
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                                    placeholder="Enter your current password"
                                    error={passwordErrors.oldPassword}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <InputField
                                    label="New Password"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    placeholder="Enter your new password"
                                    error={passwordErrors.newPassword}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <InputField
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your new password"
                                    error={passwordErrors.confirmPassword}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="mt-4 d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        disabled={isChangingPassword || !hasPasswordChanges}>
                                        {isChangingPassword ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"
                                                      role="status"></span>
                                                Changing Password...
                                            </>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetPasswordForm}
                                        disabled={isChangingPassword || !hasPasswordChanges}>
                                        Reset Changes
                                    </button>
                                </div>
                                {hasPasswordChanges && (
                                    <div className="mt-2">
                                        <small className="text-warning">
                                            You have unsaved password changes
                                        </small>
                                    </div>
                                )}
                                <div className="mt-3">
                                    <small className="text-muted">
                                        Password must be at least 8 characters long and different from your current password.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <ProcessingRequestMsgModal
                show={showPasswordModal}
                title="Changing Password"
                message="Please wait while we change your password..."
            />
        </>
    )
} 