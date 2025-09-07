import React, {useEffect, useRef, useState} from "react";
import {BrowserQRCodeReader} from "@zxing/browser";
import {NotFoundException} from "@zxing/library";

function pickPreferredCamera(devices, preferRearCamera) {
    if (!devices || devices.length === 0) return null;
    if (!preferRearCamera) return devices[0].deviceId;

    const match = devices.find((d) => {
        const label = (d.label || "").toLowerCase();
        return (
            label.includes("back") ||
            label.includes("rear") ||
            label.includes("environment")
        );
    });

    if (match) return match.deviceId;
    return devices[devices.length - 1].deviceId;
}

const QRScanner = ({
                       onResult,
                       onError,
                       autoStart = true,
                       debounceMs = 1500,
                       preferRearCamera = true,
                       enableBeep = true,
                       enableVibrate = true,
                       autoStopOnSuccess = true,
                   }) => {
    const videoRef = useRef(null);
    const codeReaderRef = useRef(new BrowserQRCodeReader());
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [lastResult, setLastResult] = useState(null);
    const [mode, setMode] = useState("camera"); // 'camera' | 'image'

    // Torch
    const [hasTorch, setHasTorch] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const videoTrackRef = useRef(null);

    // Debounce
    const lastEmittedRef = useRef({text: null, at: 0});

    // Visibility
    const wasScanningBeforeHideRef = useRef(false);

    // Track if we auto-stopped after success to show “Rescan” button
    const [autoStoppedAfterSuccess, setAutoStoppedAfterSuccess] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const found = await BrowserQRCodeReader.listVideoInputDevices();
                setDevices(found);

                let deviceId = found[0]?.deviceId ?? "";
                if (preferRearCamera) {
                    const preferred = pickPreferredCamera(found, true);
                    if (preferred) deviceId = preferred;
                }
                setSelectedDeviceId(deviceId);

                if (autoStart && deviceId) {
                    startScanner(deviceId);
                }
            } catch (e) {
                onError?.(e);
            }
        })();

        const handleVisibility = async () => {
            if (document.hidden) {
                wasScanningBeforeHideRef.current = scanning;
                if (scanning) stopScanner();
            } else {
                if (
                    wasScanningBeforeHideRef.current &&
                    mode === "camera" &&
                    selectedDeviceId
                ) {
                    await startScanner(selectedDeviceId);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            stopScanner();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const playFeedback = async () => {
        try {
            if (enableVibrate && navigator.vibrate) navigator.vibrate(200);
            if (enableBeep) {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.value = 880;
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                osc.connect(gain).connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            }
        } catch {
            /* ignore */
        }
    };

    const shouldEmit = (text) => {
        const now = Date.now();
        const {text: lastText, at} = lastEmittedRef.current;
        if (text === lastText && now - at < debounceMs) return false;
        lastEmittedRef.current = {text, at: now};
        return true;
    };

    const detectTorchSupport = async () => {
        try {
            const stream = videoRef.current?.srcObject;
            if (!stream) return;

            const tracks = typeof stream.getVideoTracks === "function"
                ? stream.getVideoTracks()
                : [];
            const track = tracks[0];
            if (!track) return;

            videoTrackRef.current = track;

            const capabilities = track.getCapabilities?.();
            if (capabilities && "torch" in capabilities) {
                setHasTorch(true);
            } else if ("ImageCapture" in window && track) {
                try {
                    const imageCapture = new window.ImageCapture(track);
                    const photoCaps = await imageCapture.getPhotoCapabilities();
                    setHasTorch(photoCaps?.torch !== undefined);
                } catch {
                    setHasTorch(false);
                }
            } else {
                setHasTorch(false);
            }
        } catch {
            setHasTorch(false);
        }
    };

    const applyTorch = async (on) => {
        try {
            const track = videoTrackRef.current;
            if (!track) return;
            await track.applyConstraints({advanced: [{torch: on}]});
            setTorchOn(on);
        } catch (e) {
            onError?.(e);
        }
    };

    const startScanner = async (deviceId) => {
        const codeReader = codeReaderRef.current;
        try {
            setMode("camera");
            setScanning(true);
            setAutoStoppedAfterSuccess(false);

            codeReader.decodeFromVideoDevice(
                deviceId ?? null,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const text = result.getText();
                        if (shouldEmit(text)) {
                            setLastResult(text);
                            playFeedback();
                            onResult?.(text);

                            if (autoStopOnSuccess) {
                                stopScanner();
                                setAutoStoppedAfterSuccess(true);
                            }
                        }
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        onError?.(err);
                    }
                }
            );

            setTimeout(detectTorchSupport, 500);
        } catch (error) {
            setScanning(false);
            onError?.(error);
        }
    };

    const stopScanner = () => {
        if (torchOn) {
            applyTorch(false).finally(() => {
            });
        }
        setScanning(false);
        setHasTorch(false);
        setTorchOn(false);
        videoTrackRef.current = null;
    };

    const handleDeviceChange = async (e) => {
        const id = e.target.value;
        setSelectedDeviceId(id);
        if (scanning) {
            stopScanner();
            await startScanner(id);
        }
    };

    const handleImageUpload = async (e) => {
        const codeReader = codeReaderRef.current;
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setMode("image");
            stopScanner();

            const url = URL.createObjectURL(file);
            const result = await codeReader.decodeFromImageUrl(url);
            const text = result.getText();
            if (shouldEmit(text)) {
                setLastResult(text);
                playFeedback();
                onResult?.(text);
            }
        } catch (err) {
            onError?.(err);
        }
    };

    const handleRescan = async () => {
        if (mode === "camera" && selectedDeviceId) {
            await startScanner(selectedDeviceId);
        } else {
            setMode("camera");
            await startScanner(selectedDeviceId);
        }
    };

    useEffect(() => {
        if (mode === "camera") {
            stopScanner();
            startScanner()
        } else {
            stopScanner()
        }
    }, [mode])

    const toggleTorch = async () => {
        const next = !torchOn;
        await applyTorch(next);
    };

    return (
        <div className="card card-md">
            <div className="card-body">
                {/* Controls */}
                <div className="row g-2 mb-3">
                    <div className="col-12 col-md-12">
                        <label className="form-label">Mode</label>
                        <div className="btn-group w-100" role="group">
                            <button
                                type="button"
                                className={`btn ${
                                    mode === "camera" ? "btn-primary" : "btn-outline-primary"
                                }`}
                                onClick={() => {
                                    setMode("camera");
                                    if (!scanning && selectedDeviceId && !autoStoppedAfterSuccess) {
                                        startScanner(selectedDeviceId);
                                    }
                                }}>
                                Camera
                            </button>
                            <button
                                type="button"
                                className={`btn ${
                                    mode === "image" ? "btn-primary" : "btn-outline-primary"
                                }`}
                                onClick={() => {
                                    setMode("image");
                                    stopScanner();
                                }}>
                                Image
                            </button>
                        </div>
                    </div>

                    {mode === "camera" && (
                        <div className="col-12 col-md-12">
                            <label className="form-label">Camera</label>
                            <select
                                className="form-select"
                                value={selectedDeviceId}
                                onChange={handleDeviceChange}
                                disabled={devices.length === 0}>
                                {devices.map((d) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || `Camera ${d.deviceId.slice(0, 6)}...`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Video with overlay */}
                {mode === "camera" && (
                    <div
                        className="position-relative d-inline-block w-100"
                        style={{maxWidth: 480}}>
                        <video ref={videoRef} className="w-100 rounded border" muted playsInline/>

                        {/* Scanner Box */}
                        {scanning && (
                            <div
                                className="position-absolute"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    width: 220,
                                    height: 220,
                                    marginLeft: -110,
                                    marginTop: -110,
                                    border: "2px solid rgba(255,255,255,0.8)",
                                    borderRadius: 8,
                                    boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)",
                                    pointerEvents: "none",
                                }}>
                                {/* Moving Red Line */}
                                <div
                                    className="qr-scan-line"
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: "rgba(255,0,0,0.9)",
                                        boxShadow: "0 0 8px rgba(255,0,0,0.7)",
                                        animation: "qr-scan-move 2s linear infinite",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Image upload */}
                {mode === "image" && (
                    <div className="mb-3">
                        <label className="form-label">Upload an image with a QR code</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageUpload}
                        />
                    </div>
                )}

                {/* Start/Stop & Torch & Rescan */}
                <div className="d-flex gap-2 mt-3 align-items-center flex-wrap">
                    {!scanning && !autoStoppedAfterSuccess && mode === "camera" && (
                        <button
                            className="btn btn-primary"
                            onClick={() => startScanner(selectedDeviceId)}
                            disabled={mode === "image"}>
                            Start Camera
                        </button>
                    )}

                    {scanning && (
                        <button className="btn btn-outline-danger" onClick={stopScanner}>
                            Stop Camera
                        </button>
                    )}

                    {scanning && hasTorch && (
                        <button
                            className={`btn ${torchOn ? "btn-warning" : "btn-outline-secondary"}`}
                            onClick={toggleTorch}>
                            {torchOn ? "Turn Torch Off" : "Turn Torch On"}
                        </button>
                    )}

                    {!scanning && autoStoppedAfterSuccess && (
                        <button className="btn btn-primary" onClick={handleRescan}>
                            Rescan
                        </button>
                    )}
                </div>

                {/* Last result */}
                {lastResult && (
                    <div className="alert alert-success mt-3 mb-0" role="alert">
                        <strong>Scanned:</strong> {lastResult}
                    </div>
                )}
            </div>

            <style>
                {`
          @keyframes qr-scan-move {
            0%   { transform: translateY(10%); }
            100% { transform: translateY(90%); }
          }
        `}
            </style>
        </div>
    );
};

export default QRScanner;
