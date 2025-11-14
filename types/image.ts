export type ImageDataType = {
    id: string;
    url: string;
    alt: string;
    path: string;
    created: number;
    updated: number;
}

export type EditFormData = {
    alt: string;
    file?: File | null; // 이미지 교체용 파일
}

export type ImageUpload = {
    id?: string;
    url?: string;
    alt?: string;
    path?: string;
    file?: File;
}