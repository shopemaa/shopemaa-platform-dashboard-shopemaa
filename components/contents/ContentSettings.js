import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { contentCardApi, projectApi } from "../../qrcode_api";
import { QrCentraalCooKieAccessToken } from "../../utils/cookie";
import Cookies from "js-cookie";
import InputField from "../common/InputField";
import { multimediaApi } from "../../core_api";
import Switch from "../common/Switch";
import { showErrorMessage } from "../../helpers/errors";
import { handleApi } from "../../common_api";

export default function ContentSettings({ project }) {
  // console.log(project);

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [passwordProtected, setUsePasswordStatus] = useState(false);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);
  const [contentFile, setContentFile] = useState(null);

  const [accessToken, setAccessToken] = useState(
    Cookies.get(QrCentraalCooKieAccessToken)
  );

  function onUpsertContent() {
    setDisableUpdateBtn(true);

    let contentCardApiClient = contentCardApi(accessToken);
    handleApi(
      null,
      contentCardApiClient.createContentCard(project.id, {
        file: contentFile,
        title,
        password,
        passwordProtected,
      })
    ).then(() => {
      router.push(`/qrcode/${project.id}/configure`);
    }).catch(showErrorMessage)
      .finally(() => {
        setDisableUpdateBtn(false);
      });
  }

  function handleFileChange(event) {
    event.preventDefault();
    setContentFile(event.target.files[0]);
  }

  function handleFileUpload(file) {
    if (!file || !title) {
      return;
    }

    let multimediaApiClient = multimediaApi(accessToken);
    handleApi(
      null,
      multimediaApiClient.uploadMultimedia({ file })
    ).then((response) => {
        setContentFile(response.data.file_path);
      })
      .catch(showErrorMessage)
      .finally(() => {
        setShowProcessingModal(false);
      });
  }

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            <div className="col-7">
              <div className="row row-cards">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      {project.name}'s Masked link settings
                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <InputField
                            label="Name"
                            required
                            value={title}
                            onChange={(event) =>
                              setTitle(event.target.value.trim())
                            }
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-5">
                          <div className="mb-3">
                            <label className="form-label h3 required">
                              Upload content
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="form-control form-control-color w-100"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <Switch
                            label="Make content password protected"
                            value={passwordProtected}
                            onChange={() =>
                              setUsePasswordStatus(!passwordProtected)
                            }
                          />
                        </div>
                      </div>

                      {passwordProtected && (
                        <div className="row">
                          <div className="col-md-6">
                            <InputField
                              label="Password"
                              type="password"
                              required
                              value={password}
                              onChange={(event) =>
                                setPassword(event.target.value.trim())
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-footer text-end">
                      <button
                        disabled={disableUpdateBtn || !title || !contentFile}
                        onClick={onUpsertContent}
                        className="btn btn-qrc"
                      >
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

            <div className="col-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
