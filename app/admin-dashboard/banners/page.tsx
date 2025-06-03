import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import BannersList from './banner-list'
import { getWebBanners, getMobileBanners, getAllBanners } from './action';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function BannerPage() {
    const webImages = await getWebBanners();
    const allWebImages = webImages.flatMap(web => web.images ?? [])
    const mobileImages = await getMobileBanners();
    const allMobileImages = mobileImages.flatMap(mobile => mobile.images ?? [])

    const BannerId = webImages[0]?.id;
    // console.log("id", firstBannerId)

    return (
        <>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {
                    label: "Banners",
                },
            ]}
            />
            <div className="flex items-center justify-between mt-14">
                <h1 className="text-3xl font-black uppercase text-foreground "> Banner Images manage</h1>
                <Button>
                    <Link href={`/admin-dashboard/banners/${BannerId}`}>
                        <Edit2 /> Modifier Banner Images
                    </Link>
                </Button>
            </div >
            <BannersList
                webImages={allWebImages}
                mobileImages={allMobileImages}
            />
        </>
    )
}
