'use client'
import BannerCarousel from '@/components/home-banner/BannerCarousel';
import { useEffect, useState } from 'react'

export default function BannersClient({
    webImages, mobileImages
}: {
    webImages: string[];
    mobileImages: string[];
}) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768); // 기준은 자유롭게
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    if (isMobile === null) return null; // 로딩 중 처리

    const formatImages = (images: string[]) => {
        return images.map((url, index) => ({
            id: `image-${index}`,
            url
        }));
    };

    return (
        <>
            {!isMobile &&
                <BannerCarousel
                    images={webImages}
                    size="(max - width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    width={1290}
                    height={600}
                />
            }
            {isMobile &&
                <BannerCarousel
                    images={mobileImages}
                    size="(max - width: 768px) 100vw, 50vw, 33vw"
                    width={800}
                    height={600}
                />}
        </>
    )
}