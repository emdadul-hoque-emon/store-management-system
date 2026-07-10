"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, ImageIcon, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LineItem } from "@/types/invoice";
import Image from "next/image";

interface ImageUploadProps {
  onItemsExtracted: (items: LineItem[]) => void;
  customerName: string;
  customerPhone: string;
  storeId: string;
  onFileChange: (file: File | null) => void;
  imageFile: File | null;
}

type UploadState = "idle" | "dragging" | "uploading" | "done" | "error";

export function ImageUpload({
  onItemsExtracted,
  customerName,
  customerPhone,
  storeId,
  onFileChange,
  imageFile,
}: ImageUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateExtraction = useCallback(
    async (file: File) => {
      setState("uploading");
      setFileName(file.name);

      // formData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("storeId", storeId);
      formData.append("customerName", customerName);
      formData.append("customerPhone", customerPhone);

      // Read the file as a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      const blob = reader.readAsDataURL(file);

      try {
        const res = await fetch(`http://localhost:4000/api/v1/invoice`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();
        console.log(data);
        setState("done");
      } catch (error) {
        console.error("Error extracting invoice items:", error);
      } finally {
        setState("done");
      }
    },
    [onItemsExtracted, storeId, customerName, customerPhone],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload an image file (PNG, JPG, WEBP).");
        setState("error");
        return;
      }
      setErrorMsg("");
      setPreview(URL.createObjectURL(file));
      onFileChange(file); // Notify parent component about the file change
      setState("done");
    },
    [onFileChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleReset = () => {
    setState("idle");
    setPreview(null);
    setFileName("");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
    onFileChange(null); // Notify parent component that the file has been reset
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        name="file"
      />

      {state === "idle" || state === "dragging" || state === "error" ? (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setState("dragging");
          }}
          onDragLeave={() => setState("idle")}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10 px-6 text-center",
            state === "dragging"
              ? "border-primary bg-accent"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            state === "error" && "border-destructive/50 bg-destructive/5",
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-accent">
            <UploadCloud className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop an invoice image here
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              or{" "}
              <span className="text-primary underline underline-offset-2">
                browse files
              </span>{" "}
              — PNG, JPG, WEBP
            </p>
          </div>
          {state === "error" && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
        </div>
      ) : state === "uploading" ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-10 px-6">
          {preview && (
            <div className="relative size-20 rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded invoice"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                <Loader2 className="size-6 text-white animate-spin" />
              </div>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Extracting line items…
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{fileName}</p>
          </div>
          <div className="w-full max-w-xs bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[progress_2.2s_ease-in-out_forwards]" />
          </div>
        </div>
      ) : state === "done" ? (
        <div className="relative w-80 h-80 rounded-lg overflow-hidden border border-border">
          {preview && (
            <div>
              <Button
                variant="ghost"
                className="z-10 absolute top-0 right-0 size-5 rounded-full"
                onClick={handleReset}
              >
                <X className="size-3.5" aria-label="Remove image" />
              </Button>
              <Image
                fill
                src={preview}
                alt="Uploaded invoice"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5">
              <Sparkles className="size-3 text-primary" />
              <span className="text-xs font-medium text-primary">Done</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </Button>
          </div> */}
        </div>
      ) : null}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
