export const extractStoragePath = (url: string): string => {
    try {
        const decodedUrl = decodeURIComponent(url);
        const matches = decodedUrl.match(/\/o\/(.+)\?alt=media/);
        if (!matches || matches.length < 2) {
            throw new Error('URL에서 경로 추출 실패');
        }
        return matches[1]; // ex) "banners/mobile/banner1.jpg"
    } catch (err) {
        console.error('Storage 경로 파싱 실패:', url, err);
        throw err;
    }
}