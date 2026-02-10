// Image Upload Component
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  onUpload?: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
  placeholder?: string;
  shape?: "square" | "circle";
  size?: "sm" | "md" | "lg";
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  maxSize = 5,
  accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
  className = "",
  placeholder = "Click to upload",
  shape = "square",
  size = "md",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop when it changes
  useEffect(() => {
    if (value && value.trim() !== '') {
      setPreview(value);
      setImageLoadError(false);
    } else {
      setPreview(null);
    }
  }, [value]);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-xl";

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(",").map(t => t.trim());
    if (!allowedTypes.includes(file.type) && accept !== "image/*") {
      setError("Invalid file type");
      return;
    }

    setError(null);
    setImageLoadError(false);

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // If onUpload is provided, upload the file
    if (onUpload) {
      setIsUploading(true);
      try {
        const result = await onUpload(file);
        if (!result.success) {
          setError(result.error || "Upload failed");
          setPreview(value || null); // Revert preview
        } else if (result.url) {
          setPreview(result.url);
        }
      } catch {
        setError("Upload failed");
        setPreview(value || null);
      } finally {
        setIsUploading(false);
      }
    } else if (onChange) {
      // Just pass the file to parent
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (onChange) onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`${sizeClasses[size]} ${shapeClasses} border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors overflow-hidden bg-gray-50 ${
            isUploading ? "cursor-wait" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-yellow-500 animate-spin" />
              <span className="text-xs text-gray-500">Uploading...</span>
            </div>
          ) : preview && !imageLoadError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setImageLoadError(true)}
              onLoad={() => setImageLoadError(false)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Camera size={size === "sm" ? 20 : 32} />
              <span className="text-xs text-center px-2">{placeholder}</span>
            </div>
          )}
        </div>
        {/* X button outside the overflow container for proper visibility */}
        {preview && !isUploading && !imageLoadError && (
          <button
            type="button"
            onClick={handleRemove}
            className={`absolute w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white z-10 ${
              shape === "circle" ? "-top-1 -right-1" : "top-0 right-0"
            }`}
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />
      
      {error && <span className="text-xs text-red-500 text-center">{error}</span>}
      
      {!preview && !isUploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <Upload size={14} />
          Upload
        </button>
      )}
    </div>
  );
}
