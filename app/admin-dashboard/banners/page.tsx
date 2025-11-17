import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import BannersList from './banner-list'
import { getWebBanners, getMobileBanners, getAllBanners } from './action';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function BannerPage() {
    const webImages = await getWebBanners();
    const mobileImages = await getMobileBanners();

    const allWebImages: string[] = (webImages ?? []).flatMap((b) =>
        (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    );
    const allMobileImages: string[] = (mobileImages ?? []).flatMap((b) =>
        (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    );

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
            <div className="mt-14">
                <h1 className="text-3xl font-black uppercase text-foreground "> Banner Images manage</h1>
            </div >
            <div className="mt-10">
                {webImages.length === 0 && mobileImages.length === 0 ? (
                    <Button>
                        <Link
                            href={`/admin-dashboard/banners/new-banner`}
                            className='flex gap-2'
                        >
                            <Edit2 /> Add New Banner Images
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Button>
                            <Link
                                href={`/admin-dashboard/banners/${BannerId}`}
                                className='flex gap-2'
                            >
                                <Edit2 /> Modifier Banner Images
                            </Link>
                        </Button>
                        <BannersList
                            webImages={allWebImages}
                            mobileImages={allMobileImages}
                        />
                    </>
                )}
            </div>
        </>
    )
}
