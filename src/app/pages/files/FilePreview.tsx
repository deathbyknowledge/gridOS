import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileType, Entry } from "./FileExplorer"


interface FilePreviewProps {
    file: Entry
}

const getLanguage = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()
    switch (extension) {
        case "js":
            return "javascript"
        case "ts":
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
        case "py":
            return "python"
        default:
            return "text"
    }
}

export function FilePreview({ file }: FilePreviewProps) {
    const [text, setText] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const url = `/api/file${file.path}`;

    useEffect(() => {
        const fetchData = async () => {
            const text = await fetch(url).then(res => res.text());
            setText(text);
        }
        fetchData();
    }, []);

    let Component: React.ReactNode;
    switch (file.type) {
        case FileType.Image:
            Component = (
                <div className="flex justify-center w-full">
                    <img
                        src={url || `/placeholder.svg?height=300&width=400`}
                        alt={file.name}
                        className="max-w-full max-h-[70vh] object-contain rounded-md"
                    />
                </div>
            )
            break;

        case FileType.Video:
            Component = (
                <div className="w-full">
                    <video ref={videoRef} controls className="w-full max-h-[70vh] rounded-md">
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )
            break;

        case FileType.Audio:
            Component = (
                <div className="w-full p-4">
                    <audio ref={audioRef} controls className="w-full">
                        <source src={url} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )
            break;

        case FileType.Text:
            Component = (
                <Card className="w-full overflow-hidden p-0">
                    <CardContent className="p-0">
                        <SyntaxHighlighter
                            language={getLanguage(file.name)}
                            showLineNumbers
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: 10,
                                borderRadius: "0.5rem",
                            }}
                            wrapLongLines={true}
                        >
                            {text}
                        </SyntaxHighlighter>
                    </CardContent>
                </Card>
            )
            break;

        default:
            Component = (
                <div className="flex flex-col items-center justify-center p-8 text-center w-full">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-medium">{file.name}</h3>
                    <p className="text-muted-foreground mt-2">Preview not available for this file type</p>
                </div>
            )
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 w-full">{Component}</div>
        </div>
    )
}
