import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {uniTextApi} from "../../qrcode_api";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import Cookies from "js-cookie";
import {showErrorMessage} from "../../helpers/errors";
import {handleApi} from "../../common_api";
import {Toaster, toast} from "react-hot-toast";
import BaseSelect from "../base/BaseSelect";

export default function UniTextSettigns({project, uniTextType}) {
    const router = useRouter();

    const [uniTextTypes, setUniTextTypes] = useState([
        // {
        //     'type': 'PLAIN_TEXT',
        //     'form_label': 'What would you like to share?',
        //     'value': 'TEXT',
        //     'label': 'TEXT',
        // },
        {
            'value': 'URL',
            'form_label': 'What\'s the URL you\'d like to link?',
            'type': 'URL',
            'label': 'URL',
        },
        {
            'value': 'WHATSAPP',
            'form_label': 'What\'s your WhatsApp number?',
            'type': 'WHATSAPP',
            'label': 'WhatsApp',
        },
        {
            'value': 'FACEBOOK',
            'form_label': 'What\'s your Facebook page URL?',
            'type': 'WHATSAPP',
            'label': 'Facebook',
        },
        {
            'value': 'X',
            'form_label': 'What\'s your X profile URL?',
            'type': 'WHATSAPP',
            'label': 'X',
        },
        {
            'value': 'INSTAGRAM',
            'form_label': 'What\'s your Instagram profile URL?',
            'type': 'WHATSAPP',
            'label': 'Instagram',
        },
        {
            'value': 'TIKTOK',
            'form_label': 'What\'s your TikTok profile URL?',
            'type': 'WHATSAPP',
            'label': 'TikTok',
        },
        {
            'value': 'YOUTUBE',
            'form_label': 'What\'s your Youtube profile URL?',
            'type': 'WHATSAPP',
            'label': 'Youtube',
        },
        {
            'value': 'PINTEREST',
            'form_label': 'What\'s your Pinterest profile URL?',
            'type': 'WHATSAPP',
            'label': 'Pinterest',
        },
    ]);
    const [selectedUniText, setSelectedUniText] = useState(uniTextTypes[0]);

    const [uniTextData, setUniTextData] = useState("");
    const [uniTextExtraData, setUniTextExtraData] = useState("");

    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);

    const [accessToken, setAccessToken] = useState(
        Cookies.get(QrCentraalCooKieAccessToken)
    );

    function handleUniTextSelection(event) {
        setSelectedUniText(uniTextTypes.find(u => u.value === event.target.value))
    }

    function onUpsertUniTextSettings() {
        if (uniTextData.trim() === '') {
            return
        }

        setDisableUpdateBtn(true);

        let uniTextClient = uniTextApi(accessToken);

        handleApi(
            null,
            uniTextClient.updateUniText(project.id, {
                data: uniTextData.trim(),
                extra_data: uniTextExtraData !== null && uniTextExtraData !== "" ? uniTextExtraData : null,
                uni_text_type: selectedUniText.type,
            })
        ).then((resp) => {
            if (resp.data) {
                toast('Changes saved successfully!', {
                    position: 'top-center',
                    className: 'success',
                })
            }
        }).catch(showErrorMessage)
            .finally(() => {
                setDisableUpdateBtn(false);
            });
    }

    const onContinue = () => {
        router.push(`/dashboard/qr-codes/${project.id}/configure`);
    }

    const getFormLevelData = () => {
        return selectedUniText.form_label
    }

    useEffect(() => {
        if (project.uni_text) {
            setSelectedUniText(uniTextTypes.find(u => u.value === project.uni_text.uni_text_type))
            setUniTextData(project.uni_text.data)

            if (project.uni_text.extra_data) {
                setUniTextExtraData(project.uni_text.extra_data)
            }
        } else if (uniTextType) {
            if (uniTextTypes.find(u => u.value === uniTextType)) {
                setSelectedUniText(uniTextTypes.find(u => u.value === uniTextType))
            }
        }
    }, [project, uniTextType]);

    return (
        <div>
            <div className="container-xl py-3">
                {/* Mobile-friendly Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15, flexWrap: "wrap"}}>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>{project.name}</span>
                        </li>

                        <li className="breadcrumb-item">
                            <a href={`/dashboard/uni-texts/${project.id}`} className="text-primary"
                               style={{textDecoration: "none"}}>
                                <span style={{fontWeight: 500}}>UniText</span>
                            </a>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12 col-md-12">
                        <div className="row row-cards">
                            <div className="col-12 col-md-12">
                                <div className="card">
                                    <div className="card-header h2">
                                        {project.name}'s Settings
                                    </div>

                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <div className="mb-3">
                                                    <BaseSelect
                                                        required
                                                        label={'What kind of data to share?'}
                                                        className={'h3 form-label'}
                                                        options={uniTextTypes}
                                                        value={selectedUniText.value}
                                                        onChange={handleUniTextSelection}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label h3 required">
                                                        {getFormLevelData()}
                                                    </label>

                                                    <input
                                                        type="text"
                                                        placeholder={'Insert your data'}
                                                        className="form-control form-control-color w-100"
                                                        value={uniTextData}
                                                        onChange={(event) =>
                                                            setUniTextData(event.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {selectedUniText.value === 'WHATSAPP' && (
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label h3 required">
                                                            What's your initial message?
                                                        </label>

                                                        <input
                                                            type="text"
                                                            placeholder={'Insert your data'}
                                                            className="form-control form-control-color w-100"
                                                            value={uniTextExtraData}
                                                            onChange={(event) =>
                                                                setUniTextExtraData(event.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-footer text-end">
                                        <button
                                            disabled={disableUpdateBtn}
                                            onClick={onUpsertUniTextSettings}
                                            className="btn btn-primary">
                                            Save Changes &nbsp;
                                            {disableUpdateBtn && (
                                                <div
                                                    className="spinner-border spinner-border-sm text-white"
                                                    role="status"
                                                ></div>
                                            )}
                                        </button>
                                        &nbsp;&nbsp;
                                        <button
                                            disabled={disableUpdateBtn}
                                            onClick={() => onContinue()}
                                            className="btn btn-outline-teal">
                                            Continue
                                            {disableUpdateBtn && (
                                                <div
                                                    className="spinner-border spinner-border-sm text-white"
                                                    role="status"
                                                ></div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5"></div>
                </div>
            </div>

            <Toaster/>
        </div>
    );
}
