"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/app/components/ui/resizable";
import { PathHeader } from "./PathHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Save } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { Button } from "@/app/components/ui/button";
import { FileList } from "./FileList";
import { FilePreview } from "./FilePreview";

export function FileExplorer({ path }: { path: string }) {
    console.log('path', path);
    const currentPath = path != '/' ? path.slice(1, -1).split('/') : [];
    console.log('currentPath', currentPath);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
    // const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview")
    const [editedContent, setEditedContent] = useState<string>("")
    const [isEdited, setIsEdited] = useState(false)
    // const isMobile = useIsMobile();

    // Get current directory content
    const getCurrentContent = () => {
        let current = fileSystem;
        for (const folder of currentPath) {
            const found = current.find((item) => item.name === folder && item.type === FileType.Directory)
            if (found && found.type === FileType.Directory && found.children) {
                current = found.children
            } else {
                return []
            }
        }
        return current
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

    const currentContent = getCurrentContent()

    // Handle file selection
    const handleFileSelect = (file: FileData) => {
        if (isEdited && selectedFile?.type === FileType.Text) {
            if (confirm("You have unsaved changes. Do you want to continue without saving?")) {
                setSelectedFile(file)
                if (file.type === FileType.Directory) {
                    navigateTo([...currentPath, file.name])
                } else if (file.type === FileType.Text) {
                    setEditedContent(file.content || "")
                    setIsEdited(false)
                }
            }
        } else {
            setSelectedFile(file)
            if (file.type === FileType.Directory) {
                navigateTo([...currentPath, file.name])
            } else if (file.type === FileType.Text) {
                setEditedContent(file.content || "")
                setIsEdited(false)
            }
        }
    }

    const isEditable = selectedFile?.type === FileType.Text
    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            <div className="p-4 border-b">
                <PathHeader path={currentPath} />
            </div>
            <div
                id="file-explorer-layout"
                className="flex-1 flex flex-row"
            >
                <div id="file-list-panel" className="min-w-1/4 min-w-0 border-r">
                    <div className="h-full p-4 overflow-auto">
                        <FileList
                            files={currentContent}
                            onFileSelect={handleFileSelect}
                            onNavigateUp={navigateUp}
                            currentPath={currentPath}
                            selectedFile={selectedFile}
                        />
                    </div>
                </div>
                <div id="file-content-panel" className="w-3/4 min-w-0">
                    <div className="h-full p-4 overflow-auto w-full">
                        {selectedFile && selectedFile.type !== FileType.Directory ? (
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

export interface FileData {
    name: string
    type: FileType
    size?: string
    dateModified?: string
    url?: string
    content?: string
    children?: FileData[]
}


// Mock file system data
export const fileSystem: FileData[] = [
    {
        name: "Documents",
        type: FileType.Directory,
        children: [
            {
                name: "Project Proposal.txt",
                type: FileType.Text,
                size: "24 KB",
                dateModified: "2023-05-15",
                content:
                    "# Project Proposal\n\nThis is a sample project proposal document that outlines the goals, timeline, and resources required for the project.\n\n## Goals\n\n- Develop a responsive web application\n- Implement user authentication\n- Create a dashboard for data visualization\n\n## Timeline\n\n- Phase 1: Planning and Design (2 weeks)\n- Phase 2: Development (6 weeks)\n- Phase 3: Testing and Deployment (2 weeks)\n\n## Resources\n\n- 2 Frontend Developers\n- 1 Backend Developer\n- 1 UI/UX Designer\n- 1 Project Manager",
            },
            {
                name: "Meeting Notes.txt",
                type: FileType.Text,
                size: "12 KB",
                dateModified: "2023-06-02",
                content:
                    "# Team Meeting - June 2, 2023\n\n## Attendees\n\n- John Smith\n- Sarah Johnson\n- Michael Brown\n- Emily Davis\n\n## Agenda\n\n1. Project status update\n2. Upcoming deadlines\n3. Resource allocation\n4. Open issues\n\n## Action Items\n\n- John: Complete the API documentation by Friday\n- Sarah: Schedule a meeting with the client for next week\n- Michael: Fix the reported bugs in the login system\n- Emily: Prepare the design mockups for the new features",
            },
        ],
    },
    {
        name: "Images",
        type: FileType.Directory,
        children: [
            {
                name: "mountain.jpg",
                type: FileType.Image,
                size: "2.4 MB",
                dateModified: "2023-04-10",
                url: "/placeholder.svg?height=800&width=1200",
            },
            {
                name: "beach.jpg",
                type: FileType.Image,
                size: "1.8 MB",
                dateModified: "2023-04-12",
                url: "/placeholder.svg?height=800&width=1200",
            },
            {
                name: "forest.jpg",
                type: FileType.Image,
                size: "3.2 MB",
                dateModified: "2023-04-15",
                url: "/placeholder.svg?height=800&width=1200",
            },
        ],
    },
    {
        name: "Videos",
        type: FileType.Directory,
        children: [
            {
                name: "tutorial.mp4",
                type: FileType.Video,
                size: "24 MB",
                dateModified: "2023-03-20",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            },
            {
                name: "presentation.mp4",
                type: FileType.Video,
                size: "45 MB",
                dateModified: "2023-03-25",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            },
        ],
    },
    {
        name: "Music",
        type: FileType.Directory,
        children: [
            {
                name: "song1.mp3",
                type: FileType.Audio,
                size: "4.2 MB",
                dateModified: "2023-02-10",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            },
            {
                name: "song2.mp3",
                type: FileType.Audio,
                size: "3.8 MB",
                dateModified: "2023-02-15",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            },
        ],
    },
    {
        name: "Projects",
        type: FileType.Directory,
        children: [
            {
                name: "WebDevelopment",
                type: FileType.Directory,
                children: [
                    {
                        name: "index.html",
                        type: FileType.Text,
                        size: "2 KB",
                        dateModified: "2023-01-05",
                        content:
                            '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Website</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <header>\n    <h1>Welcome to My Website</h1>\n    <nav>\n      <ul>\n        <li><a href="#">Home</a></li>\n        <li><a href="#">About</a></li>\n        <li><a href="#">Services</a></li>\n        <li><a href="#">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main>\n    <section>\n      <h2>About Us</h2>\n      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>\n    </section>\n  </main>\n  <footer>\n    <p>&copy; 2023 My Website. All rights reserved.</p>\n  </footer>\n  <script src="script.js"></script>\n</body>\n</html>',
                    },
                    {
                        name: "styles.css",
                        type: FileType.Text,
                        size: "1.5 KB",
                        dateModified: "2023-01-06",
                        content:
                            "/* Global Styles */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n  color: #333;\n}\n\nheader {\n  background-color: #4CAF50;\n  color: white;\n  padding: 1rem;\n}\n\nnav ul {\n  display: flex;\n  list-style: none;\n}\n\nnav ul li {\n  margin-right: 1rem;\n}\n\nnav ul li a {\n  color: white;\n  text-decoration: none;\n}\n\nmain {\n  padding: 2rem;\n}\n\nsection {\n  margin-bottom: 2rem;\n}\n\nfooter {\n  background-color: #333;\n  color: white;\n  text-align: center;\n  padding: 1rem;\n}",
                    },
                    {
                        name: "script.js",
                        type: FileType.Text,
                        size: "0.8 KB",
                        dateModified: "2023-01-07",
                        content:
                            "// Main JavaScript file\n\ndocument.addEventListener('DOMContentLoaded', function() {\n  console.log('Document loaded and ready!');\n  \n  // Example of a simple function\n  function greet(name) {\n    return `Hello, ${name}!`;\n  }\n  \n  console.log(greet('User'));\n  \n  // Example of event handling\n  const navLinks = document.querySelectorAll('nav a');\n  \n  navLinks.forEach(link => {\n    link.addEventListener('click', function(event) {\n      event.preventDefault();\n      console.log(`Clicked on: ${this.textContent}`);\n      \n      // You could add navigation logic here\n    });\n  });\n});",
                    },
                ],
            },
        ],
    },
    {
        name: "README.txt",
        type: FileType.Text,
        size: "1.2 KB",
        dateModified: "2023-01-01",
        content:
            "# File Explorer Application\n\nThis is a sample README file for the File Explorer application.\n\n## Features\n\n- Browse files and directories\n- Preview different file types\n- Responsive design for all screen sizes\n\n## Usage\n\nSimply navigate through the directories by clicking on them. Select files to preview their contents.\n\n## Supported File Types\n\n- Images (.jpg, .png, .gif)\n- Videos (.mp4, .webm)\n- Audio (.mp3, .wav)\n- Text (.txt, .html, .css, .js)\n\n## Credits\n\nDeveloped by Your Name",
    },
]