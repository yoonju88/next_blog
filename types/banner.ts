type WebImages = { id: string; url: string }
type MobileImages = { id: string; url: string }


export type HomeBannerImage = {
    id: string;
    url: string;
    file: string;
    webImages?: WebImages[];
    mobileImages?: MobileImages[];
}