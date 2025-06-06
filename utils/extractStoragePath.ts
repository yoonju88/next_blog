export const extractStoragePath = (url: string): string => {
    try {
        if (typeof url !== "string") {
            throw new Error("URL이 문자열이 아님");
        }
        const decodedUrl = decodeURIComponent(url);
        const match = decodedUrl.match(/\/o\/(.+?)(\?|$)/);
        if (!match || !match[1]) {
            throw new Error("URL에서 경로 추출 실패");
        }
        return match[1]; // ex: banners/zBWe7AD4aNcbmqoDV1zn/...
    } catch (err) {
        console.error("❌ Storage 경로 파싱 실패");
        console.error("문제가 된 URL:", url);
        console.error("에러 내용:", err);
        throw err;
    }
}