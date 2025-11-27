export type BannerImage = {
    id: string;
    url: string;
    alt?: string;
    path?: string;
}

export type HomeBannerImage = {
    id: string;
    webImages: BannerImage[];
    mobileImages: BannerImage[];
    created?: number | null;
    updated?: number | null;
}