import React from 'react'
import BannerCarousel from '@/components/home-banner/BannerCarousel';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'

export default function BannersList({
    webImages,
    mobileImages,
}: {
    webImages: string[]
    mobileImages: string[]
}) {
    const webImagesObj = (webImages ?? []).map((url, i) => ({ id: String(i), url }));
    const mobileImagesObj = (mobileImages ?? []).map((url, i) => ({ id: String(i), url }));

    return (
        <>
            <div className="mt-10">
                <h1 className="mb-10 text-2xl text-primary font-bold uppercase">Web Banner Images</h1>
                {!!webImages && (
                    <BannerCarousel
                        images={webImagesObj}
                        imageH=""
                        size="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        width={1290}
                        height={600}
                    />
                )}
                <div className='border-t-1 border-primary/50 pb-12 mt-14' />
                <div className="flex items-center justify-center flex-col mb-14">
                    <h1 className="mb-10 text-2xl text-primary font-bold uppercase">Mobile Banner Images</h1>
                    <div className="w-xl h-xl">
                        {!!mobileImages && (
                            <BannerCarousel
                                images={mobileImagesObj}
                                imageH=""
                                size="(max-width: 768px) 100vw, 50vw, 33vw"
                                width={800}
                                height={600}
                            />
                        )}
                    </div>
                </div>
                <div className='border-t-1 border-primary/50' />
                {!webImages && !mobileImages && (
                    <Button
                        asChild
                        className="flex-inline gap-2"
                    >
                        <Link href="/admin-dashboard/banners/new-banner">
                            <PlusCircleIcon />New Banner
                        </Link>
                    </Button>
                )}
            </div>
        </>
    )
}
