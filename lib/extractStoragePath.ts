const STORAGE_SEGMENT = "/o/";

/**
 * Converts a Firebase download URL back into the underlying storage path.
 * Returns null if the URL cannot be parsed.
 */
export default function extractStoragePath(urlOrPath: string): string | null {
    if (!urlOrPath) return null;

    // Already a storage path (does not contain protocol)
    if (!/^https?:\/\//i.test(urlOrPath)) {
        return urlOrPath;
    }

    try {
        const parsed = new URL(urlOrPath);
        const segmentIndex = parsed.pathname.indexOf(STORAGE_SEGMENT);

        if (segmentIndex === -1) return null;

        const encodedPath = parsed.pathname.substring(segmentIndex + STORAGE_SEGMENT.length);
        return decodeURIComponent(encodedPath);
    } catch (error) {
        console.error("Failed to extract storage path:", error);
        return null;
    }
}

