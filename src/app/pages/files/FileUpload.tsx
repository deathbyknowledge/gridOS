"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, CheckCircle, AlertCircle, FileIcon } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Progress } from "@/app/components/ui/progress"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils"

interface FileUploadProps {
    path: string,
    onUploadComplete?: (url: string) => void
}

export default function FileUpload({
    path,
    onUploadComplete,
}: FileUploadProps) {
    console.log('path', path)
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleFileChange = (selectedFile: File | null) => {
        setError(null)
        setUploadedUrl(null)

        if (!selectedFile) return

        setFile(selectedFile)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setProgress(0)
        setError(null)

        try {
            // Upload file with progress tracking
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100)
                    setProgress(percentComplete)
                }
            })

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setUploadedUrl(path + file.name)
                    if (onUploadComplete) onUploadComplete(path + file.name)
                } else {
                    setError("Upload failed")
                }
                setIsUploading(false)
            })

            xhr.addEventListener("error", () => {
                setError("Upload failed")
                setIsUploading(false)
            })

            xhr.open("PUT", `/api/file${encodeURIComponent(path + file.name)}`)
            const formData = new FormData();
            formData.append("file", file);
            xhr.send(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed")
            setIsUploading(false)
        }
    }

    const clearFile = () => {
        setFile(null)
        setError(null)
        setProgress(0)
        setUploadedUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                        error ? "border-destructive/50" : "",
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />

                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                    </div>
                </div>

                {file && (
                    <div className="mt-4 p-3 border rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                <span className="text-sm font-medium truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">({(file.size / (1024 * 1024)).toFixed(2)}MB)</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    clearFile()
                                }}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {isUploading && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {uploadedUrl && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Upload complete!</span>
                            </div>
                        )}

                        {error && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!isUploading && !uploadedUrl && (
                            <Button
                                className="w-full mt-3"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation()
                                    handleUpload()
                                }}
                            >
                                Upload File
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
