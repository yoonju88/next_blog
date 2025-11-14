import storagePathToUrl from './storagePathToUrl';

interface ImageUpload {
    url: string;
    file?: File;
}

export default function imageDisplayUrlFormatter(image: ImageUpload): string {
    const imageUrl = image.url ?? "";

    // 1. 새 파일 (Blob URL)이거나 이미 완전한 HTTP URL인 경우 그대로 반환
    if (image.file || imageUrl.startsWith("http")) {
        return imageUrl;
    }

    // 2. Storage Path만 저장된 경우에만 포맷터 함수 사용
    if (imageUrl) {
        return storagePathToUrl(imageUrl);
    }

    return "";
}