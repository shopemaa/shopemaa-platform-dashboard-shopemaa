import {getQrcnUrl, handleApi} from "../../common_api";
import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken, QrCentraalOrgId} from "../../utils/cookie";
import {onePageApi} from "../../qrcode_api";
import {useRouter} from "next/router";
import {showErrorMessage, showSuccessMessage} from "../../helpers/errors";
import {getSpaceUrl, multimediaApi} from "../../core_api";
import MagicModal from "../magic/MagicModal";
import PageBuilder from "../page-builder/PageBuilder";
import {Toaster} from "react-hot-toast";
import {OffCanvas} from "../OffCanvas";
import SeoMetaEditor from "../seometa/SeoMetaEditor";
import PageBuilderHelpModal from "../help/PageBuilderHelpModal";

const OnePageEditor = ({project}) => {
    const ref = useRef(null);

    const [showMagicPopup, setShowMagicPopup] = useState(false)
    const [showHelpPopup, setShowHelpPopup] = useState(false)

    const [disableUpdateBtn, setDisableUpdateBtn] = useState(false)

    const [orgId, setOrgId] = useState(Cookies.get(QrCentraalOrgId));

    const [accessToken, setAccessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken))

    const [blocks, setBlocks] = useState([])

    const [openMetaEditor, setOpenMetaEditor] = useState(false)

    const [onePageMeta, setOnePageMeta] = useState(project.one_page)

    const [placeHolderPrompt, setPlaceHolderPrompt] = useState(`I’m a travel blogger. Create a visually engaging web page that showcases my travel journey, highlights memorable experiences, and reflects my personal style. Include sections for stories, photos, and travel tips, along with prominent links to my social media profiles. Add any other relevant elements that will help connect with my audience and encourage engagement.`)

    useEffect(() => {
        if (project && project.one_page) {
            if (project.one_page.blocks) {
                load(JSON.parse(project.one_page.blocks));
            } else {
                load([]);
            }
        }
    }, [project])

    const [media, setMedia] = useState([
        {url: "https://placehold.co/1200x400", type: "image"},
        {url: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video"},
    ]);

    const onAssetUpload = async (file, meta) => {
        let multimediaClient = multimediaApi(accessToken)
        let resp = await multimediaClient.uploadMultimedia({
            file: file,
        })
        if (resp && resp.data) {
            const url = getSpaceUrl() + '/' + resp.data.file_path
            setMedia((m) => [...m, {url, type: meta.kind === "video" ? "video" : "image"}]);
            return {
                url
            }
        } else {
            throw new Error("Failed to upload file, please try again.");
        }
    };

    const handleSave = async (data, setDisableSaveBtn) => {
        setDisableSaveBtn(true)
        await handleOnePageUpsert(data)
        setBlocks(data)
        setDisableSaveBtn(false)
    };

    const load = async (savedData) => {
        ref.current.load(savedData);
    };

    const handleOnePageUpsert = async (data) => {
        try {
            JSON.parse(JSON.stringify(blocks))
            const onePageClient = onePageApi(accessToken)
            let payload = {}
            payload.blocks = JSON.stringify(blocks)
            const onePageUpsertCall = onePageClient.upsertOnePage(
                project.id,
                payload
            )
            return await handleApi(null, onePageUpsertCall)
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    const onContinue = async () => {
        setDisableUpdateBtn(true)
        await handleOnePageUpsert(blocks)
        await router.push(`/dashboard/qr-codes/${project.id}/configure`)
    }

    const router = useRouter()

    const onMagicSuccess = (data) => {
        console.log(JSON.parse(data))
        load(JSON.parse(data))
        showSuccessMessage({message: 'Page generated successfully.!'})
    }

    const onMagicFailure = (err) => {
        showErrorMessage(err)
    }

    useEffect(() => {
        console.log(onePageMeta)
    }, [onePageMeta])

    return (<>
            <div className="page-wrapper">
                <div className="page-body">
                    <MagicModal
                        showMagicPopup={showMagicPopup}
                        setShowMagicPopup={setShowMagicPopup}
                        accessToken={accessToken}
                        successCallback={onMagicSuccess}
                        failureCallback={onMagicFailure}
                        organizationId={orgId}
                        prevContent={blocks}
                        promptPlaceHolder={placeHolderPrompt}
                    />

                    <PageBuilderHelpModal
                        showHelperPopup={showHelpPopup}
                        setShowHelperPopup={setShowHelpPopup}
                    />

                    <OffCanvas title={'Edit One Page SEO Metadata'} open={openMetaEditor}
                               onClose={() => setOpenMetaEditor(false)}>
                        <SeoMetaEditor
                            onePage={onePageMeta}
                            meta={project.seo_metadata ? project.seo_metadata : {}}
                            accessToken={accessToken}
                            projectId={project.id}
                        />
                    </OffCanvas>

                    <div className="container-xl">
                        <div className={"row row-deck row-cards"}>
                            <div className="col-lg-12 col-xl-12">
                                <div className="row row-cards">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className={'card-header'}>
                                                <span className={'h2 mb-0'}>{project.name}</span>&nbsp;&nbsp;
                                                <button onClick={() => {
                                                    setShowMagicPopup(true)
                                                }} className={'btn btn-sm btn-qrc pe-3 ps-3'}>AI Generator
                                                </button>
                                                &nbsp;&nbsp;
                                                <button onClick={() => {
                                                    setShowHelpPopup(true)
                                                }}
                                                        className={'btn btn-sm btn-info pe-3 ps-3'}>
                                                    Help&nbsp;
                                                    <i class="fa-solid fa-circle-question"/>
                                                </button>
                                            </div>

                                            <div className="card-body">
                                                <PageBuilder
                                                    ref={ref}
                                                    onChange={(data) => {
                                                        console.log('onChange: ', data)
                                                        setBlocks(data)
                                                    }}
                                                    onSave={handleSave}
                                                    autoSave={false}
                                                    autoSaveDelay={5000}
                                                    onAssetUpload={onAssetUpload}
                                                    mediaLibrary={media}
                                                />

                                                <div className="card-footer text-end">
                                                    {project.campaign && (
                                                        <>
                                                            <button disabled={disableUpdateBtn}
                                                                    onClick={() => {
                                                                        window.open(`${getQrcnUrl()}/${project.project_slug}`, '_blank');
                                                                    }}
                                                                    className="btn btn-outline-teal col-12 col-md-3">Preview
                                                                {disableUpdateBtn && (
                                                                    <>
                                                                        &nbsp;&nbsp;&nbsp;
                                                                        <div
                                                                            className="spinner-border spinner-border-sm text-white"
                                                                            role="status"></div>
                                                                    </>
                                                                )}
                                                            </button>
                                                            &nbsp;&nbsp;&nbsp;
                                                        </>
                                                    )}

                                                    <button onClick={() => {
                                                        setOpenMetaEditor(true)
                                                    }} className="btn btn-secondary col-12 col-md-3">
                                                        Edit SEO Meta
                                                    </button>

                                                    &nbsp;

                                                    <button disabled={disableUpdateBtn}
                                                            onClick={() => {
                                                                onContinue()
                                                            }}
                                                            className="btn btn-dark col-12 col-md-3">Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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

export default OnePageEditor
