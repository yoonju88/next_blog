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
        <div className='w-full max-w-[100vw] overflow-hidden m-0 p-0'>
            <div className='w-full flex justify-center m-0 p-0'>
                {!isMobile &&
                    <BannerCarousel
                        images={webImages}
                        size="100vw"
                        width={1920}
                        height={600}
                    />
                }
                {isMobile &&
                    <BannerCarousel
                        images={mobileImages}
                        size="100vw"
                        width={800}
                        height={600}
                    />}
            </div>
        </div>
    )
}