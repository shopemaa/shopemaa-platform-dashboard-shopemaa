import React, {useMemo, useState} from 'react';
import { organizationApi} from '../../core_api'
import { QrCentraalCooKieAccessToken } from '../../utils/cookie';
import Cookies from "js-cookie";
import { handleApi, handleError } from '../../common_api';
import toast, { Toaster } from 'react-hot-toast';

export default function OrganizationManager({organizationId, organization , organizationMembers,organizationInvites}) {
    const [accessToken, setAccessToken] = useState(
            Cookies.get(QrCentraalCooKieAccessToken)
        );

    const organizationClient = useMemo(() => organizationApi(accessToken), [accessToken]);
    
    const [org, setOrg] = useState({
        name: organization.name,
    });
    
    const [members, setMembers] = useState(organizationMembers);
    const [invites, setInvites] = useState(organizationInvites);

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const handleSave = () => {
         toast.success('Organization info updated (demo)')
    };

    const handleInvite = async () => {
    if (!inviteEmail && !inviteRole) return toast.error('Email and role are required.');
    if (!inviteEmail) return toast.error('Email is required.');
    if (!inviteRole) return toast.error('Role is required.');


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
        return toast.error("Please enter a valid email address.");
    };

    try {
         await handleApi(null, organizationClient.addOrganizationMember(organizationId, {
            role: inviteRole,
            user_email: inviteEmail.trim().toLowerCase()
        }));

        toast.success('Invitation sent')
        setInviteEmail('');
        setShowInviteModal(false);
        window.location.reload(true)

    } catch (err) {
         if (err?.response?.status === 409) {
         toast.error("Email already exists");
         } else {
          console.error("Error sending invite:", err);
          toast.error("Unable to process the request, please try again.");
         handleError(null, err);
         }
    }
    };

    const confirmRemove = async () => {
      try {
          await handleApi(null, organizationClient.removeOrganizationMember(organizationId,memberToRemove ));
          
          toast.success('Member removed')
          setMembers(members.filter(m => m.id !== memberToRemove));
          setMemberToRemove(null);

    } catch (err) {
        console.error("Error removing member:", err);
        toast.error("Unable to process the request, please try again.");
        handleError(null, err);
        
    }
    };
    
    const cancelInvite = async (inviteId) => {
    try {
        await handleApi(null, organizationClient.acceptInviteWithHttpInfo(organizationId,inviteId ));
        setInvites(invites.filter(i => i.id !== inviteId));
        toast.success('Invitation cancelled')
        
    } catch (err) {
        console.error("Error cancelling invite:", err);
        toast.error("Unable to process the request, please try again.");
        handleError(null, err);
    }}

    return (
        <div className="container py-4">
            <h2 className="mb-4">Manage Organization</h2>

            {/* Org Info */}
            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title">Organization Info</h3></div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={org.name}
                                   onChange={(e) => setOrg({...org, name: e.target.value})}/>
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSave}>Save Changes</button>
                </div>
            </div>

            {/* Members */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title">Organization Members</h3>
                    <button className="btn btn-success btn-sm" onClick={() => setShowInviteModal(true)}>+ Invite
                    </button>
                </div>
                <div className="card-body table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map(m => (
                            <tr key={m.id}>
                                <td className=' text-nowrap'>{m.member_info.firstName+" "+m.member_info.lastName}</td>
                                <td>{m.member_info.email}</td>
                                <td><span
                                    className={`badge ${m.role === 'Admin' ? 'bg-primary' : 'bg-secondary'}`}>{m.role}</span>
                                </td>
                                <td className="text-end">
                                    <button className="btn btn-outline-danger btn-sm"
                                            onClick={() => setMemberToRemove(m.id)}>Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pending Invites */}
                    {invites.length > 0 && (
                        <div className="mt-4">
                            <h5>Pending Invites</h5>
                            <ul className="list-group">
                                {invites.map(invite => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center"
                                        key={invite.id}>
                                        {invite.email}
                                        <button className="btn btn-sm btn-outline-danger cursor-pointer" style={{cursor: "pointer"}}
                                                onClick={() => cancelInvite(invite.id)}>Cancel
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Invite New Member</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => {
                                            setShowInviteModal(false)
                                            setInviteEmail('')
                                        }}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                />
                                <label className="form-label pt-3">Role</label>
                                <select 
                                    className="form-control" 
                                    defaultValue={""} 
                                    onChange={(e) => setInviteRole(e.target.value)} >
                                        <option value="" disabled>Choose an option</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MEMBER">Member</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="STAFF">Staff</option>
                                </select>
                            </div>
                           
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        onClick={() =>{  
                                            setShowInviteModal(false)
                                            setInviteEmail('')
                                            }}>Cancel
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleInvite}>Send Invite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Remove */}
            {memberToRemove !== null && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Remove Member</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setMemberToRemove(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to remove this member?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        onClick={() => setMemberToRemove(null)}>Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmRemove}>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toaster/>
        </div>
    );
}
