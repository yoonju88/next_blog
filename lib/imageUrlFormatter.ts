export default function imageUrlFormatter(imagePath: string) {
    return `https://firebasestorage.googleapis.com/v0/b/yoonju-blog.firebasestorage.app/o/${encodeURIComponent(
        imagePath
    )}?alt=media`
}