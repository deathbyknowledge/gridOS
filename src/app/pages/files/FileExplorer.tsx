"use client";

import { PathHeader } from "./PathHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { FileList } from "./FileList";
import { FilePreview } from "./FilePreview";
import FileUpload from "./FileUpload";
import { IconFolderPlus, IconUpload } from "@tabler/icons-react";
import { CreateDirectoryModal } from "./CreateDirectoryModal";

export function FileExplorer({ path, entries }: { path: string, entries: Entry[] }) {
    const currentPath = path != '/' ? path.slice(1, -1).split('/') : [];
    const [selectedFile, setSelectedFile] = useState<Entry | null>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isCreateDirectoryModalOpen, setIsCreateDirectoryModalOpen] = useState(false)
    // const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview")
    // const [editedContent, setEditedContent] = useState<string>("")
    const [isEdited, setIsEdited] = useState(false)
    // const isMobile = useIsMobile();

    const handleCreateDirectory = () => {
        setIsCreateDirectoryModalOpen(true)
    }

    const navigateTo = (path: string[]) => {
        if (isEdited && selectedFile?.type === FileType.Text) {
            if (confirm("You have unsaved changes. Do you want to continue without saving?")) {
                setSelectedFile(null)
                setIsEdited(false)
                window.location.href = `/files/${path.join("/")}/`
            }
        } else {
            setSelectedFile(null)
            window.location.href = `/files/${path.join("/")}/`
        }
    }

    // Navigate up one level
    const navigateUp = () => {
        if (currentPath.length > 0) {
            if (isEdited && selectedFile?.type === FileType.Text) {
                if (confirm("You have unsaved changes. Do you want to continue without saving?")) {
                    const newPath = [...currentPath]
                    newPath.pop()
                    navigateTo(newPath)
                    setIsEdited(false)
                }
            } else {
                const newPath = [...currentPath]
                newPath.pop()
                navigateTo(newPath)
            }
        }
    }


    // Handle directory creation confirmation
    const handleDirectoryCreated = (directoryName: string) => {
        window.location.href = `/files/${currentPath.join("/")}/${directoryName}/`;
    }

    // Handle file selection
    const handleFileSelect = (file: Entry) => {
        if (isEdited && selectedFile?.type === FileType.Text) {
            if (confirm("You have unsaved changes. Do you want to continue without saving?")) {
                setSelectedFile(file)
                if (file.type === FileType.Directory) {
                    navigateTo([...currentPath, file.name])
                } else if (file.type === FileType.Text) {
                    // setEditedContent(file.content || "")
                    setIsEdited(false)
                }
            }
        } else {
            setSelectedFile(file)
            if (file.type === FileType.Directory) {
                navigateTo([...currentPath, file.name])
            } else if (file.type === FileType.Text) {
                // setEditedContent(file.content || "")
                setIsEdited(false)
            }
        }
    }

    const handleUploadComplete = () => {
        setIsUploading(false)
        window.location.reload()
    }

    const isEditable = selectedFile?.type === FileType.Text
    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            <div className="p-4 border-b flex items-center justify-between">
                <PathHeader path={currentPath} />
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleCreateDirectory}>
                        <IconFolderPlus className="h-4 w-4" />
                        New Folder
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsUploading(!isUploading)}>
                        <IconUpload className="h-4 w-4" />
                        {isUploading ? "Cancel" : "Upload"}
                    </Button></div>
            </div>
            <div
                id="file-explorer-layout"
                className="flex-1 flex flex-row"
            >
                <div id="file-list-panel" className="min-w-1/4 min-w-0 border-r">
                    <div className="h-full p-4 overflow-auto">
                        <FileList
                            entries={entries}
                            onFileSelect={handleFileSelect}
                            onNavigateUp={navigateUp}
                            currentPath={currentPath}
                            selectedFile={selectedFile}
                        />
                    </div>
                </div>
                <div id="file-content-panel" className="w-3/4 min-w-0">
                    <div className="h-full p-4 overflow-auto w-full">
                        {isUploading ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                <FileUpload path={path} onUploadComplete={handleUploadComplete} />
                            </div>
                        )
                            : selectedFile && selectedFile.type !== FileType.Directory ? (
                                <div className="h-full flex flex-col w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold truncate">{selectedFile.name}</h2>
                                        {isEditable && (
                                            <Button onClick={console.log} disabled={!isEdited}>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                        )}
                                    </div>
                                    {isEditable ? (
                                        <Tabs defaultValue="preview" id="file-content-tabs" className="flex-1 flex flex-col w-full">
                                            <TabsList className="grid grid-cols-2">
                                                <TabsTrigger value="preview">Preview</TabsTrigger>
                                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="preview" className="flex-1 mt-0 w-full h-full">
                                                <FilePreview file={selectedFile} />
                                            </TabsContent>
                                            <TabsContent value="edit" className="flex-1 mt-0 w-full h-full">
                                                <p>Coming soon</p>
                                                {/* <FileEditor
                                                content={editedContent}
                                                onChange={handleContentChange}
                                                filename={selectedFile.name}
                                            /> */}
                                            </TabsContent>
                                        </Tabs>
                                    ) : (
                                        <div className="flex-1 w-full">
                                            <FilePreview file={selectedFile} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Select a file to preview or edit
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <CreateDirectoryModal
                isOpen={isCreateDirectoryModalOpen}
                onClose={() => setIsCreateDirectoryModalOpen(false)}
                onCreateDirectory={handleDirectoryCreated}
                currentPath={currentPath}
            />
        </div>
    )
}



export enum FileType {
    Directory = "Directory",
    Image = "Image",
    Video = "Video",
    Audio = "Audio",
    Text = "Text",
    Other = "Other",
}

export interface Entry {
    name: string
    path: string
    type: FileType
    size?: number
    dateCreated?: Date
}