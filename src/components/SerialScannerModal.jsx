import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  ScanText,
  Check,
  X,
  RotateCcw,
  Video,
  Aperture,
} from "lucide-react";
import Tesseract from "tesseract.js";

const SerialScannerModal = ({ onClose, onAddSerial }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [liveCameraOn, setLiveCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPt, setStartPt] = useState({ x: 0, y: 0 });

  const [scanning, setScanning] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [scanMethod, setScanMethod] = useState("");

  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop live camera stream safely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setLiveCameraOn(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Start live camera viewfinder
  const startLiveCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setLiveCameraOn(true);
      setImageSrc(null);
      setSelection(null);
      setDetectedText("");

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Could not access live camera, Please allow camera permission or use Take Photo / Upload Image.",
      );
    }
  };

  // Capture a still frame from live camera so user can crop like Google Lens
  const captureLiveFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    stopCamera();
    setImageSrc(dataUrl);
    setSelection(null);
    setDetectedText("");
    setScanMethod("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setSelection(null);
      setDetectedText("");
      setScanMethod("");
    };
    reader.readAsDataURL(file);
  };

  // Pointer coordinates for Google Lens style selection box
  const getRelativeCoords = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    };
  };

  const handlePointerDown = (e) => {
    if (!imgRef.current) return;
    const pt = getRelativeCoords(e);
    setStartPt(pt);
    setSelection({ x: pt.x, y: pt.y, w: 0, h: 0 });
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !imgRef.current) return;
    const pt = getRelativeCoords(e);
    setSelection({
      x: Math.min(startPt.x, pt.x),
      y: Math.min(startPt.y, pt.y),
      w: Math.abs(pt.x - startPt.x),
      h: Math.abs(pt.y - startPt.y),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleScanSelection = async () => {
    if (!imgRef.current) return;
    setScanning(true);
    setDetectedText("");
    setScanMethod("");

    try {
      const img = imgRef.current;
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      const useCrop = selection && selection.w > 10 && selection.h > 10;
      const cropX = useCrop ? selection.x * scaleX : 0;
      const cropY = useCrop ? selection.y * scaleY : 0;
      const cropW = useCrop ? selection.w * scaleX : img.naturalWidth;
      const cropH = useCrop ? selection.h * scaleY : img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      // Check Barcode / QR first
      if ("BarcodeDetector" in window) {
        try {
          const detector = new window.BarcodeDetector();
          const codes = await detector.detect(canvas);
          if (codes.length > 0 && codes[0].rawValue) {
            setDetectedText(codes[0].rawValue.trim());
            setScanMethod(`Barcode / QR (${codes[0].format})`);
            setScanning(false);
            return;
          }
        } catch {
          // Fall Back to OCR
        }
      }

      // High contrast grayscale preprocessing + tesseract OCR
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const contrast = avg > 128 ? 255 : 0;
        data[i] = contrast;
        data[i + 1] = contrast;
        data[i + 2] = contrast;
      }
      ctx.putImageData(imgData, 0, 0);

      const {
        data: { text },
      } = await Tesseract.recognize(canvas, "eng");

      const cleaned = text.replace(/\s+/g, " ").trim();
      setDetectedText(cleaned);
      setScanMethod("Text / Print OCR");
    } catch (err) {
      console.error("Scan error:", err);
      alert(
        "Could not read region. Try dragging a tighter box around the serial number.",
      );
    } finally {
      setScanning(false);
    }
  };

  const handleConfirm = () => {
    if (!detectedText.trim()) return;
    onAddSerial(detectedText.trim());
    setDetectedText("");
    setSelection(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Smart Serial Number Scanner
            </h2>
            <p className="text-xs text-gray-500">
              Supports Live Camera, QR, Barcodes, Printed & Laser/Punched
              Serials
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {cameraError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
              {cameraError}
            </div>
          )}

          {/* Mode 1 - Initial Chooser */}
          {!imageSrc && !liveCameraOn && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center space-y-4 bg-gray-50">
              <p className="text-sm text-gray-600 font-medium">
                Choose how you want to capture the serial number
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startLiveCamera}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
                >
                  <Video size={16} />
                  Live Camera
                </button>

                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer">
                  <Camera size={16} />
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Mode 2 - Live Camera Viewfinder */}
          {liveCameraOn && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black flex justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-72 w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel Camera
                </button>

                <button
                  type="button"
                  onClick={captureLiveFrame}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 cursor-pointer"
                >
                  <Aperture size={17} />
                  Capture Frame to Crop
                </button>
              </div>
            </div>
          )}

          {/* M<ode 3 - Google Lens Style Drag to crop canvas */}
          {imageSrc && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg">
                <span>
                  <strong>Tip:</strong> Drag a box around the exact serial
                  number, then click <strong>Scan Selected Area</strong>.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(null);
                    setSelection(null);
                    setDetectedText("");
                  }}
                  className="flex items-center gap-1 text-blue-700 font-medium hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Retake / Reset
                </button>
              </div>

              <div
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className="relative select-none border border-gray-300 rounded-xl overflow-hidden bg-black flex justify-center touch-none cursor-crosshair"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Scan target"
                  draggable={false}
                  className="max-h-72 object-contain"
                />

                {selection && selection.w > 2 && selection.h > 2 && (
                  <div
                    style={{
                      left: selection.x,
                      top: selection.y,
                      width: selection.w,
                      height: selection.h,
                    }}
                    className="absolute border-2 border-emerald-400 bg-emerald-400/20 pointer-events-none"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleScanSelection}
                  disabled={scanning}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  <ScanText size={16} />
                  {scanning
                    ? "Scanning..."
                    : selection?.w > 10
                      ? "Scan Selected Area"
                      : "Scan Full Image"}
                </button>
              </div>
            </div>
          )}

          {/* Editable Result Box */}
          {(detectedText !== "" || scanMethod) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Detected Serial Number (Edit if needed)
                </label>
                {scanMethod && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {scanMethod}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={detectedText}
                  onChange={(e) => setDetectedText(e.target.value)}
                  placeholder="Verify or correct serial number..."
                  className="flex-1 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer"
                >
                  <Check size={16} />
                  Add to List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SerialScannerModal;
