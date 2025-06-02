import React from 'react'
import { getWebBanners, getMobileBanners } from './action';
import BannerCarousel from '@/components/home-banner/BannerCarousel';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit2Icon, PlusCircleIcon } from 'lucide-react'
import Modal from '@/components/Modal';

export default async function BannersTable() {
    const webImages = await getWebBanners();
    const allWebImages = webImages.flatMap(web => web.images ?? [])
    const mobileImages = await getMobileBanners();
    const allMobileImages = mobileImages.flatMap(mobile => mobile.images ?? [])

    return (
        <>
            <div className="mt-10">
                <h1 className="mb-10 text-2xl text-primary font-bold uppercase">Web Banner Images</h1>
                <div className='relative'>
                    {!!allWebImages && (
                        <BannerCarousel
                            images={allWebImages}
                            imageH="aspect-[16/6]"
                            size="(max - width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            width={1290}
                            height={600}
                        />
                    )}
                    <Button className="absolute top-5 right-5"><Edit2Icon /></Button>
                </div>
                <div className='border-t-1 border-primary/50 pb-10' />
                <div className="flex items-center justify-center flex-col">
                    <h1 className="mb-10 text-2xl text-primary font-bold uppercase">Mobile Banner Images</h1>
                    <div className='relative'>
                        <div className="w-xl h-xl">
                            {!!allMobileImages && (
                                <BannerCarousel
                                    images={allMobileImages}
                                    imageH="aspect-[16/9]"
                                    size="(max - width: 768px) 100vw, 50vw, 33vw"
                                    width={1290}
                                    height={600}
                                />
                            )}
                        </div>
                        <Modal
                            title="Edit"
                            description="수정하세요"
                        >
                            <p>test</p>
                        </Modal>
                        <Button className="absolute top-5 right-5">
                            <Link href="/dash-board/banners/edit-banner">
                                <Edit2Icon />
                            </Link></Button>
                    </div>
                </div>
                <div className='border-t-1 border-primary/50 pt-10' />

                {!allWebImages && !allMobileImages && (
                    <Button
                        asChild
                        className="flex-inline gap-2"
                    >
                        <Link href="/admin-dashboard/banners/edit-banner">
                            <PlusCircleIcon />New Banner
                        </Link>
                    </Button>
                )}
            </div>
        </>
    )
}
