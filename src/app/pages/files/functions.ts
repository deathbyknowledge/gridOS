"use server";

import { db } from "@/db";
import { FileType, type Entry } from "./FileExplorer";

export function getFileTypeFromExtension(filePath: string, isDirectory = false) {
    if (isDirectory) return FileType.Directory;

    // Extract extension from filePath, normalize to lowercase, handle undefined/null
    const extension = filePath?.split('.').pop()?.toLowerCase() || '';

    // Image extensions
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    if (imageExts.includes(extension)) return FileType.Image;

    // Video extensions
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    if (videoExts.includes(extension)) return FileType.Video;

    // Audio extensions
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a'];
    if (audioExts.includes(extension)) return FileType.Audio;

    // Text extensions
    const textExts = ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'csv', 'py'];
    if (textExts.includes(extension)) return FileType.Text;

    // Default to Other for unrecognized extensions or no extension
    return FileType.Other;
}

export async function listFolder(path: string): Promise<Entry[]> {
    try {
        // Ensure path ends with '/' for consistency
        const normalizedPath = path.endsWith('/') ? path : `${path}/`;
        
        // Query to get all paths starting with the given path
        // We remove the NOT GLOB to get all relevant paths and filter in code
        const rows = await db.files.findMany({
            where: {
                path: {
                    startsWith: normalizedPath
                }
            }
        });
        // Count segments in the input path (excluding empty segments)
        const segmentCount = normalizedPath.split('/').filter(segment => segment !== '').length;

        // Track unique directories to avoid duplicates
        const nestedFolders = new Set<string>();
        const entries: Entry[] = [];

        // Process each row to create file entries and infer directories
        for (const row of rows) {
            const segments = row.path.split('/').filter(segment => segment !== '');

            // File entries: paths with the same or one more segment than the input path
            if (segments.length === segmentCount || segments.length === segmentCount + 1) {
                // Skip if it's a directory-like path (ends with '/')

                if (!row.path.endsWith('/')) {
                    entries.push({
                        name: segments[segments.length - 1],
                        path: row.path,
                        type: getFileTypeFromExtension(row.path),
                        size: row.size,
                        dateCreated: row.createdAt,
                    });
                }
            } else // Infer directories: check if the path implies a directory one level deeper
            if (segments.length >= segmentCount + 1) {
                // Construct the directory path (one level deeper)
                const folderSegments = segments.slice(0, segmentCount + 1);
                const folderPath = `/${folderSegments.join('/')}/`;
                
                // Add to nestedFolders if not already present
                if (!nestedFolders.has(folderPath)) {
                    nestedFolders.add(folderPath);
                    entries.push({
                        name: folderSegments[folderSegments.length - 1],
                        path: folderPath,
                        type: FileType.Directory,
                        size: 0, // Directories typically have no size in S3
                        dateCreated: row.createdAt, // Use the file's creation date
                    });
                }
            }
        }

        return entries;
    } catch (e) {
        console.error('An error occurred while listing the folder', e);
        throw e;
    }
}