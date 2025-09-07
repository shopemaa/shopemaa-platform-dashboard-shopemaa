import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import ProcessingRequestMsgModal from '../modals/ProcessingRequestMsgModal'
import Cookies from 'js-cookie'
import {QrCentraalCooKieAccessToken} from '../../utils/cookie'
import BaseSelect from '../base/BaseSelect'
import {getSpaceUrl, multimediaApi} from '../../core_api'
import {businessCardApi} from '../../qrcode_api'
import {showErrorMessage} from '../../helpers/errors'
import {handleApi} from '../../common_api'
import {Toaster, toast} from 'react-hot-toast'
import BusinessCardTemplateRenderer from "../../helpers/business_card_template_renderer";

const QRC_BRAND_PRIMARY = "#214a3b";
const QRC_BRAND_SECONDARY = "#13e183";
const MAX_SOCIAL_LINKS = 5;
const SOCIAL_LINK_TYPES = [
    {value: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/'},
    {value: 'twitter', label: 'Twitter', prefix: 'https://twitter.com/'},
    {value: 'website', label: 'Website', prefix: 'https://'},
    {value: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/'},
    {value: 'whatsapp', label: 'WhatsApp', prefix: 'https://wa.me/'},
    {value: 'custom', label: 'Custom', prefix: ''},
];

const TEMPLATES = [
    {value: "Default", label: "Default"},
    {value: "Glass", label: "Glass"},
    {value: "LinkTree", label: "LinkTree"},
    {value: "Luxe", label: "Luxe"},
    {value: "Signature", label: "Signature"},
    {value: "Spotlight", label: "Spotlight"},
    {value: "Split", label: "Split"},
];

function formatAddress({street, city, state, postcode, country}) {
    let parts = [street, city, state, postcode, country?.label].filter(Boolean);
    return parts.join(", ");
}

const BusinessCardSettings = ({project, countryList}) => {
    const router = useRouter()

    // --- States
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [companyLogoPath, setCompanyLogoPath] = useState('')
    const [companyLogoFile, setCompanyLogoFile] = useState(null)
    const [companyName, setCompanyName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [department, setDepartment] = useState('')
    const [website, setWebsite] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [postcode, setPostcode] = useState('')
    const [companyTagline, setCompanyTagline] = useState('')
    const [countryDefaultValue, setCountryDefaultValue] = useState(countryList[0])
    const [selectedTheme, setSelectedTheme] = useState('Default')
    const [primaryColor, setPrimaryColor] = useState(project?.business_card?.primary_color || QRC_BRAND_PRIMARY);
    const [secondaryColor, setSecondaryColor] = useState(project?.business_card?.secondary_color || QRC_BRAND_SECONDARY);

    const [showProcessingModal, setShowProcessingModal] = useState(false)
    const [showProcessingModalTitle, setShowProcessingModalTitle] = useState('')
    const [showProcessingModalMessage, setShowProcessingModalMessage] = useState('')

    const [accessToken, setAccessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken))
    const [showDemoData, setShowDemoData] = useState(false)
    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false)
    const [socialLinks, setSocialLinks] = useState([])

    // Hydrate from project
    useEffect(() => {
        if (project && project.business_card) {
            let bc = project.business_card
            setFirstName(bc.first_name || '')
            setLastName(bc.last_name || '')
            setEmail(bc.email || '')
            setPhone(bc.phone || '')
            setCompanyLogoPath(bc.company_logo_path || '')
            setCompanyName(bc.current_company || '')
            setJobTitle(bc.job_title || '')
            setDepartment(bc.department || '')
            setWebsite(bc.website || '')
            setCompanyTagline(bc.company_tagline || '')
            setSelectedTheme((bc.selected_template || 'Default').charAt(0).toUpperCase() + (bc.selected_template || 'Default').slice(1))
            if (bc.primary_color) setPrimaryColor(bc.primary_color);
            if (bc.secondary_color) setSecondaryColor(bc.secondary_color);

            if (Array.isArray(bc.social_links)) {
                setSocialLinks(bc.social_links)
            } else if (typeof bc.social_links === 'object' && bc.social_links !== null) {
                setSocialLinks(Object.entries(bc.social_links)
                    .filter(([k, v]) => v)
                    .map(([k, v]) => ({
                        type: SOCIAL_LINK_TYPES.find(t => t.value === k) ? k : 'custom',
                        url: v
                    })))
            }
            if (bc.address) {
                let addr = bc.address
                setStreet(addr.street || '')
                setCity(addr.city || '')
                setState(addr.state || '')
                setPostcode(addr.postal_code || '')
                if (addr.country) {
                    setCountryDefaultValue({'label': addr.country.name, value: addr.country.id})
                }
            }
        }
    }, [project])

    // --- REQUIRED FIELDS logic
    const isFilledRequiredFields = () => {
        if (!firstName.trim()) return false;
        if (!lastName.trim()) return false;
        if (!phone.trim()) return false;
        if (!email.trim()) return false;
        if (!companyName.trim()) return false;
        if (!companyLogoPath.trim()) return false;
        if (!jobTitle.trim()) return false;
        if (!street.trim()) return false;
        if (!city.trim()) return false;
        if (!postcode.trim()) return false;
        if (!countryDefaultValue?.value) return false;
        return true;
    }

    const onUpsertBusinessCardSettings = () => {
        if (!isFilledRequiredFields()) {
            toast.error("Please fill in all required fields.");
            return
        }
        setDisableUpdateBtn(true)
        let businessCardApiClient = businessCardApi(accessToken)
        handleApi(
            null,
            businessCardApiClient.upsertBusinessCard(project.id, {
                'first_name': firstName,
                'last_name': lastName,
                'phone': phone,
                'email': email,
                'website': website,
                'job_title': jobTitle,
                'current_company': companyName,
                'company_logo_path': companyLogoPath,
                'company_tagline': companyTagline,
                'selected_template': selectedTheme,
                'department': department,
                'primary_color': primaryColor,
                'secondary_color': secondaryColor,
                'address': {
                    'street': street,
                    'street_optional': null,
                    'city': city,
                    'state': state,
                    'postal_code': postcode,
                    'country_id': countryDefaultValue.value
                },
                'social_links': socialLinks
            })
        ).then(res => {
            if (res.data) {
                toast('Changes saved successfully!', {
                    position: 'top-center',
                    className: 'success',
                })
            }
        }).catch(showErrorMessage)
            .finally(() => setDisableUpdateBtn(false));
    }

    const handleCompanyLogoChange = (event) => {
        setCompanyLogoFile(event.target.files[0])
    }
    const handleCompanyLogoUpload = () => {
        if (!companyLogoFile) return
        setShowProcessingModal(true)
        setShowProcessingModalTitle('Processing request')
        setShowProcessingModalMessage('Company logo is being uploaded...')
        let multimediaApiClient = multimediaApi(accessToken)
        handleApi(
            null,
            multimediaApiClient.uploadMultimedia({file: companyLogoFile})
        ).then(response => {
            setCompanyLogoPath(response.data.file_path)
        }).catch(showErrorMessage)
            .finally(() => setShowProcessingModal(false));
    }
    useEffect(() => {
        handleCompanyLogoUpload()
        // eslint-disable-next-line
    }, [companyLogoFile])

    const handleCountryChange = (event) => {
        let selectedCountry = countryList.find(c => c.value === event.target.value)
        setCountryDefaultValue(selectedCountry)
    }

    const onContinue = () => {
        if (!isFilledRequiredFields()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        router.push(`/dashboard/qr-codes/${project.id}/configure`)
    }

    // ---- Social Links logic
    const handleAddLink = () => {
        if (socialLinks.length >= MAX_SOCIAL_LINKS) return;
        setSocialLinks([...socialLinks, {type: 'linkedin', url: ''}])
    }
    const handleRemoveLink = idx => {
        setSocialLinks(socialLinks.filter((_, i) => i !== idx))
    }
    const handleChangeLink = (idx, field, value) => {
        setSocialLinks(
            socialLinks.map((l, i) => (i === idx ? {...l, [field]: value} : l))
        )
    }

    const addressStr = formatAddress({
        street, city, state, postcode, country: countryDefaultValue
    });

    return (
        <>
            {/* Breadcrumb */}
            <div className="container-xl py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb" style={{background: 'transparent', fontWeight: 500}}>
                        <li className="breadcrumb-item">
                            <a href="/dashboard" style={{color: QRC_BRAND_PRIMARY}}>Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard/business-cards" style={{color: QRC_BRAND_PRIMARY}}>Business Cards</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page" style={{color: "#18372b"}}>
                            {project?.name}
                        </li>
                    </ol>
                </nav>
            </div>
            {/* Main UI */}
            <div className="page-wrapper" style={{background: "#f9fafb"}}>
                <div className="page-body">
                    <ProcessingRequestMsgModal
                        show={showProcessingModal}
                        title={showProcessingModalTitle}
                        message={showProcessingModalMessage}
                    />
                    <div className="container-xl">
                        <div className="row row-cards">
                            {/* Settings Form */}
                            <div className="col-lg-6">
                                <form className="card shadow rounded-3 border-0 p-4 bg-white">
                                    <div className="card-header pb-2 d-flex align-items-center"
                                         style={{
                                             background: QRC_BRAND_PRIMARY,
                                             color: "white",
                                             borderRadius: "16px 16px 0 0"
                                         }}>
                                        <span
                                            className="h3 mb-0 flex-grow-1">{project.name}'s Digital Business Card</span>
                                    </div>
                                    <div className="card-body pt-3">
                                        <h4 className="mb-3">Personal Info</h4>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">First Name</label>
                                                <input type="text" className="form-control" placeholder="John"
                                                       value={firstName} onChange={e => setFirstName(e.target.value)}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Last Name</label>
                                                <input type="text" className="form-control" placeholder="Doe"
                                                       value={lastName} onChange={e => setLastName(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Phone</label>
                                                <input type="text" className="form-control" placeholder="+8801712345678"
                                                       value={phone} onChange={e => setPhone(e.target.value)}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Email</label>
                                                <input type="email" className="form-control"
                                                       placeholder="your@email.com"
                                                       value={email} onChange={e => setEmail(e.target.value)}/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <h4 className="mb-3">Company Info</h4>
                                        <div className="row mb-2">
                                            <div className="col-md-8 mb-3">
                                                <label className="form-label required">Company Name</label>
                                                <input type="text" className="form-control" placeholder="QR Centraal"
                                                       value={companyName}
                                                       onChange={e => setCompanyName(e.target.value)}/>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label required">Logo</label>
                                                <input type="file" className="form-control"
                                                       accept="image/*" onChange={handleCompanyLogoChange}/>
                                                {companyLogoPath && (
                                                    <img src={getSpaceUrl() + '/' + companyLogoPath} alt="Logo Preview"
                                                         className="mt-2 rounded shadow"
                                                         style={{width: 56, height: 56}}/>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Job Title</label>
                                                <input type="text" className="form-control"
                                                       placeholder="Founder & Engineer"
                                                       value={jobTitle} onChange={e => setJobTitle(e.target.value)}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Department</label>
                                                <input type="text" className="form-control" placeholder="Product & Tech"
                                                       value={department}
                                                       onChange={e => setDepartment(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Company Tagline</label>
                                            <input type="text" className="form-control"
                                                   placeholder="Turn Every Scan into Growth"
                                                   value={companyTagline}
                                                   onChange={e => setCompanyTagline(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Company Website</label>
                                            <input type="text" className="form-control"
                                                   placeholder="https://qrcentraal.com"
                                                   value={website} onChange={e => setWebsite(e.target.value)}/>
                                        </div>
                                        <hr/>
                                        <h4 className="mb-3">Company Address</h4>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Street</label>
                                                <input type="text" className="form-control" placeholder="Street"
                                                       value={street} onChange={e => setStreet(e.target.value)}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">City</label>
                                                <input type="text" className="form-control" placeholder="City"
                                                       value={city} onChange={e => setCity(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">State</label>
                                                <input type="text" className="form-control" placeholder="State"
                                                       value={state} onChange={e => setState(e.target.value)}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label required">Postcode</label>
                                                <input type="text" className="form-control" placeholder="Postcode"
                                                       value={postcode} onChange={e => setPostcode(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <BaseSelect
                                                label={'Country'}
                                                options={countryList}
                                                value={countryDefaultValue.value}
                                                required
                                                onChange={handleCountryChange}
                                            />
                                        </div>
                                        <hr/>
                                        <h4 className="mb-3">
                                            Social & Contact Links
                                            <span className="text-muted ms-2"
                                                  style={{fontWeight: 400, fontSize: "0.95em"}}>
                                                (Max {MAX_SOCIAL_LINKS})
                                            </span>
                                        </h4>
                                        {socialLinks.map((link, idx) => (
                                            <div key={idx} className="row align-items-end mb-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={link.type}
                                                        onChange={e => handleChangeLink(idx, 'type', e.target.value)}
                                                    >
                                                        {SOCIAL_LINK_TYPES.map(opt => (
                                                            <option key={opt.value}
                                                                    value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-7">
                                                    <label className="form-label">URL</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={SOCIAL_LINK_TYPES.find(opt => opt.value === link.type)?.prefix}
                                                        value={link.url}
                                                        onChange={e => handleChangeLink(idx, 'url', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-1 text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-danger"
                                                        title="Remove link"
                                                        onClick={() => handleRemoveLink(idx)}
                                                    >✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mb-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                style={{color: QRC_BRAND_PRIMARY, borderColor: QRC_BRAND_PRIMARY}}
                                                onClick={handleAddLink}
                                                disabled={socialLinks.length >= MAX_SOCIAL_LINKS}
                                            >+ Add Link
                                            </button>
                                            <small className="text-muted ms-2">
                                                ({socialLinks.length}/{MAX_SOCIAL_LINKS})
                                                {socialLinks.length >= MAX_SOCIAL_LINKS && (
                                                    <span className="text-danger ms-2">Maximum {MAX_SOCIAL_LINKS} links allowed</span>
                                                )}
                                            </small>
                                        </div>
                                        <hr/>
                                        <h4 className="mb-3">Card Colors & Branding</h4>
                                        <div className="row mb-2">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Primary Color</label>
                                                <div className="d-flex align-items-center gap-2">
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-color"
                                                        value={primaryColor}
                                                        onChange={e => setPrimaryColor(e.target.value)}
                                                        style={{
                                                            width: 44,
                                                            height: 38,
                                                            padding: 0,
                                                            border: "none",
                                                            background: "none"
                                                        }}
                                                        title="Pick a primary color"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={primaryColor}
                                                        onChange={e => setPrimaryColor(e.target.value)}
                                                        style={{maxWidth: 120}}
                                                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                                        title="Hex color, e.g. #214a3b"
                                                        placeholder="#214a3b"
                                                    />
                                                </div>
                                                <small className="text-muted">Main brand color for headings,
                                                    highlights</small>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Secondary Color</label>
                                                <div className="d-flex align-items-center gap-2">
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-color"
                                                        value={secondaryColor}
                                                        onChange={e => setSecondaryColor(e.target.value)}
                                                        style={{
                                                            width: 44,
                                                            height: 38,
                                                            padding: 0,
                                                            border: "none",
                                                            background: "none"
                                                        }}
                                                        title="Pick a secondary color"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={secondaryColor}
                                                        onChange={e => setSecondaryColor(e.target.value)}
                                                        style={{maxWidth: 120}}
                                                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                                        title="Hex color, e.g. #13e183"
                                                        placeholder="#13e183"
                                                    />
                                                </div>
                                                <small className="text-muted">Accent color for buttons, icons,
                                                    etc.</small>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="mb-2">
                                            <label className="form-label">Card Theme</label>
                                            <select
                                                className="form-select"
                                                value={selectedTheme}
                                                onChange={e => setSelectedTheme(e.target.value)}
                                            >
                                                {TEMPLATES.map(tpl => (
                                                    <option key={tpl.value} value={tpl.value}>{tpl.label}</option>
                                                ))}
                                            </select>
                                            <small className="text-muted">Choose a business card template</small>
                                        </div>
                                    </div>
                                    <div
                                        className="card-footer d-flex flex-wrap gap-2 justify-content-between align-items-center bg-transparent pt-3">
                                        <button
                                            type="button"
                                            className="btn btn-qrc"
                                            disabled={disableUpdateBtn || !isFilledRequiredFields()}
                                            onClick={onUpsertBusinessCardSettings}
                                            style={{
                                                background: QRC_BRAND_PRIMARY,
                                                color: "white",
                                                minWidth: 140,
                                                fontWeight: 600,
                                                borderRadius: 8,
                                            }}
                                        >
                                            {disableUpdateBtn ? (
                                                <>
                                                    Saving&nbsp;
                                                    <span className="spinner-border spinner-border-sm" role="status"/>
                                                </>
                                            ) : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-green"
                                            disabled={!isFilledRequiredFields() || disableUpdateBtn}
                                            onClick={onContinue}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {/* Preview Card */}
                            <div className="col-lg-6">
                                <div className="card shadow border-0 rounded-3">
                                    <div className="card-header d-flex align-items-center"
                                         style={{
                                             background: QRC_BRAND_PRIMARY,
                                             color: "white",
                                             borderRadius: "16px 16px 0 0"
                                         }}>
                                        <span className="h3 mb-0 flex-grow-1">Preview</span>
                                        <label className="ms-3 form-check form-switch">
                                            <input
                                                onChange={() => setShowDemoData(!showDemoData)}
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={showDemoData}
                                            />
                                            <span className="form-check-label ms-1">Show demo</span>
                                        </label>
                                    </div>
                                    <div className="card-body bg-light rounded-bottom-3">
                                        <BusinessCardTemplateRenderer
                                            template={selectedTheme}
                                            firstName={firstName}
                                            lastName={lastName}
                                            phone={phone}
                                            email={email}
                                            jobTitle={jobTitle}
                                            companyName={companyName}
                                            companyTagline={companyTagline}
                                            department={department}
                                            website={website}
                                            address={addressStr}
                                            avatarUrl={getSpaceUrl() + '/' + companyLogoPath}
                                            socialLinks={socialLinks}
                                            primaryColor={primaryColor || "#214a3b"}
                                            secondaryColor={secondaryColor || "#13e183"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toaster/>
                </div>
            </div>
        </>
    )
}

export default BusinessCardSettings
