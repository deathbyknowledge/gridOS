"use client"

import type React from "react"

import { useState } from "react"
import {
    IconFile,
    IconFolder,
    IconMusic,
    IconVideo,
    IconFileText,
    IconDownload,
    IconTrash,
    IconDotsVertical,
    IconPhoto,
    IconFolderUp,
} from "@tabler/icons-react"

import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { type Entry, FileType } from "./FileExplorer"

interface FileListProps {
    entries: Entry[]
    onFileSelect: (file: Entry) => void
    onNavigateUp: () => void
    currentPath: string[]
    selectedFile?: Entry | null
}

const getFileIcon = (file: Entry) => {
    switch (file.type) {
        case FileType.Directory:
            return <IconFolder fill="currentColor" className="h-5 w-5" />
        case FileType.Image:
            return <IconPhoto className="h-5 w-5" />
        case FileType.Video:
            return <IconVideo className="h-5 w-5" />
        case FileType.Audio:
            return <IconMusic className="h-5 w-5" />
        case FileType.Text:
            return <IconFileText className="h-5 w-5" />
        default:
            return <IconFile className="h-5 w-5" />
    }
}


export function FileList({ entries, onFileSelect, onNavigateUp, currentPath, selectedFile }: FileListProps) {
    // Track which file's dropdown is open to prevent file selection when clicking outside dropdown
    const [openDropdownFile, setOpenDropdownFile] = useState<string | null>(null)

    // Handle file action click
    const handleFileAction = (e: React.MouseEvent, action: string, file: Entry) => {
        e.stopPropagation() // Prevent triggering the file selection

        // These are dummy actions for now
        if (action === "download") {
            const url = `/api/file${file.path}`;
            const fileName = file.name; // Use the file's name for the download
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Set the file name for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (action === "delete") {
            const response = fetch(`/api/file${file.path}`, {
                method: 'DELETE',
            }).then(response => {
                if (response.ok) {
                    window.location.reload()
                } else {
                    console.error(`Failed to delete ${file.name}`)
                }
            })
        }
    }

    // Handle file selection with dropdown awareness
    const handleFileClick = (file: Entry) => {
        // Only select the file if we're not interacting with a dropdown
        if (openDropdownFile !== file.name) {
            onFileSelect(file)
        }
    }

    return (
        <div className="space-y-2">
            {currentPath.length > 0 && (
                <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer" onClick={onNavigateUp}>
                    <IconFolderUp className="h-5 w-5 mr-2" />
                    <span>..</span>
                </div>
            )}

            {entries.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">This folder is empty</div>
            ) : (
                <div className="grid gap-2">
                    {entries.map((file) => (
                        <div
                            key={file.name}
                            className={`flex items-center justify-between p-2 rounded-md ${selectedFile?.name === file.name ? "bg-muted" : "hover:bg-muted"}`}
                        >
                            {/* File info section - clickable */}
                            <div
                                className="flex items-center overflow-hidden flex-1 cursor-pointer"
                                onClick={() => handleFileClick(file)}
                            >
                                {getFileIcon(file)}
                                <span className="ml-2 truncate">{file.name}</span>
                            </div>

                            {/* Actions section - separate from file selection */}
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setOpenDropdownFile(file.name)
                                        } else {
                                            setOpenDropdownFile(null)
                                        }
                                    }}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-70 hover:opacity-100 focus:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }}
                                        >
                                            <IconDotsVertical className="h-4 w-4 cursor-pointer" />
                                            <span className="sr-only">Actions for {file.name}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" side="right">
                                        <DropdownMenuItem onClick={(e) => handleFileAction(e, "download", file)}>
                                            <IconDownload className="mr-2 h-4 w-4" />
                                            <span>Download</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => handleFileAction(e, "delete", file)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <IconTrash className="mr-2 h-4 w-4 text-destructive" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
