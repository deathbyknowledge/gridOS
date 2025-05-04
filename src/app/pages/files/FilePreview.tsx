import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { FileData, FileType } from "./FileExplorer"

interface FilePreviewProps {
    file: FileData
}

const getLanguage = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()

    switch (extension) {
        case "js":
            return "javascript"
        case "ts":
            return "typescript"
        case "jsx":
        case "tsx":
            return "typescript"
        case "html":
            return "html"
        case "css":
            return "css"
        case "json":
            return "json"
        case "md":
            return "markdown"
        default:
            return "text"
    }
}

const renderPreview = (file: FileData, opts: any) => {
    console.log('AAAAAAAA', file);
    switch (file.type) {
        case FileType.Image:
            return (
                <div className="flex justify-center w-full">
                    <img
                        src={file.url || `/placeholder.svg?height=300&width=400`}
                        alt={file.name}
                        className="max-w-full max-h-[70vh] object-contain rounded-md"
                    />
                </div>
            )

        case FileType.Video:
            return (
                <div className="w-full">
                    <video ref={opts.videoRef} controls className="w-full max-h-[70vh] rounded-md">
                        <source src={file.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )

        case FileType.Audio:
            return (
                <div className="w-full p-4">
                    <audio ref={opts.audioRef} controls className="w-full">
                        <source src={file.url} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )

        case FileType.Text:
            return (
                <Card className="w-full overflow-hidden p-0">
                    <CardContent className="p-0">
                        <SyntaxHighlighter
                            language={getLanguage(file.name)}
                            showLineNumbers
                            customStyle={{
                                margin: 0,
                                padding: 0,
                                borderRadius: "0.5rem",
                            }}
                            wrapLongLines={true}
                        >
                            {opts.textContent}
                        </SyntaxHighlighter>
                    </CardContent>
                </Card>
            )

        default:
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center w-full">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-medium">{file.name}</h3>
                    <p className="text-muted-foreground mt-2">Preview not available for this file type</p>
                </div>
            )
    }
}

export function FilePreview({ file }: FilePreviewProps) {
    const [textContent, setTextContent] = useState<string>("")
    const videoRef = useRef<HTMLVideoElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (file.type === FileType.Text && file.content) {
            setTextContent(file.content)
        }
    }, [file])

    // Get language for syntax highlighting


    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-auto w-full">{renderPreview(file, { textContent, videoRef, audioRef })}</div>
        </div>
    )
}
