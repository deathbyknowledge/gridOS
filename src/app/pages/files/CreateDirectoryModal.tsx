"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"

interface CreateDirectoryModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateDirectory: (directoryName: string) => void
    currentPath: string[]
}

export function CreateDirectoryModal({ isOpen, onClose, onCreateDirectory, currentPath }: CreateDirectoryModalProps) {
    const [directoryName, setDirectoryName] = useState("")
    const [error, setError] = useState<string | null>(null)

    // Reset state when modal opens
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
            setDirectoryName("")
            setError(null)
        }
    }

    // Validate directory name
    const validateDirectoryName = (name: string): boolean => {
        // Check if empty
        if (!name.trim()) {
            setError("Directory name cannot be empty")
            return false
        }

        // Check for invalid characters
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
        if (invalidChars.test(name)) {
            setError("Directory name contains invalid characters")
            return false
        }

        // Check if name is too long
        if (name.length > 255) {
            setError("Directory name is too long")
            return false
        }

        // All checks passed
        setError(null)
        return true
    }

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateDirectoryName(directoryName)) {
            onCreateDirectory(directoryName)
            setDirectoryName("")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="directory-name">Folder Name</Label>
                            <Input
                                id="directory-name"
                                value={directoryName}
                                onChange={(e) => setDirectoryName(e.target.value)}
                                placeholder="Enter folder name"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive" className="py-2">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="text-sm text-muted-foreground">
                            Creating folder in: {currentPath.length > 0 ? `/${currentPath.join("/")}/` : "/"}
                        </div>
                        <div className="text-sm text-yellow-600">
                            Note: Directories are only saved once a file is created in them.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Folder</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
