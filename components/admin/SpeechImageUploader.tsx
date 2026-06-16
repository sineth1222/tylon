"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface SpeechImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function SpeechImageUploader({
  value,
  onChange,
}: SpeechImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate
      if (!file.type.startsWith("image/")) {
        toast.error("IMAGE FILES ONLY");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error("MAX SIZE: 8MB");
        return;
      }

      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "/tylon/speeches");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) {
          toast.error(data.error || "UPLOAD FAILED");
        } else {
          onChange(data.url);
          toast.success("IMAGE UPLOADED");
        }
      } catch {
        toast.error("UPLOAD FAILED");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[9px] tracking-[0.3em] text-army uppercase">
          SPEECH IMAGE
        </label>
        <span className="font-mono text-[9px] text-tylon-muted">
          JPG · PNG · WebP · max 8MB
        </span>
      </div>

      {/* Preview — show if image uploaded */}
      {value && !uploading && (
        <div className="relative w-full h-52 border border-tylon-border overflow-hidden group">
          <Image
            src={value}
            alt="Speech image"
            fill
            className="object-cover"
            sizes="600px"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-tylon-bg/0 group-hover:bg-tylon-bg/60 transition-all duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-tylon-secondary border border-tylon-border px-4 py-2 font-mono text-[10px] tracking-widest text-tylon-primary hover:border-army"
            >
              <Upload size={12} />
              REPLACE
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-danger/20 border border-danger/40 px-4 py-2 font-mono text-[10px] tracking-widest text-danger hover:bg-danger/30"
            >
              <X size={12} />
              REMOVE
            </button>
          </div>
          {/* Bottom bar with URL */}
          <div className="absolute bottom-0 left-0 right-0 bg-tylon-bg/80 backdrop-blur-sm px-3 py-2 border-t border-tylon-border">
            <p className="font-mono text-[9px] text-tylon-muted truncate">
              {value}
            </p>
          </div>
        </div>
      )}

      {/* Upload zone — show if no image or uploading */}
      {(!value || uploading) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className="relative w-full h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all"
          style={{
            borderColor: dragOver ? "#4A5C3A" : "#2A2A26",
            background: dragOver ? "rgba(74,92,58,0.06)" : "#1A1A17",
            cursor: uploading ? "default" : "pointer",
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-army animate-spin" />
              <p className="font-mono text-[10px] tracking-widest text-tylon-muted uppercase">
                UPLOADING TO IMAGEKIT…
              </p>
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-army animate-pulse"
                style={{ width: "60%" }}
              />
            </>
          ) : (
            <>
              <div className="w-12 h-12 border border-tylon-border flex items-center justify-center">
                {dragOver ? (
                  <Upload size={20} className="text-army-light" />
                ) : (
                  <ImageIcon size={20} className="text-tylon-muted" />
                )}
              </div>
              <div className="text-center">
                <p className="font-mono text-[11px] tracking-widest text-tylon-primary uppercase">
                  {dragOver ? "DROP TO UPLOAD" : "CLICK OR DRAG IMAGE"}
                </p>
                <p className="font-mono text-[9px] text-tylon-muted mt-1 tracking-wide">
                  Uploads directly to ImageKit CDN
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleInput}
      />
    </div>
  );
}
