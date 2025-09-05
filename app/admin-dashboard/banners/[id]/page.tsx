import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getBannerById } from '../action';
import DeleteBannerButton from './delete-banner-button';
import BannersTab from './bannersTab';
import { HomeBannerImage } from '@/types/banner';


export default async function EditBanners({
    params,
}: {
    params: Promise<{ id: string | string[] }>
}) {
    const { id } = await params;
    const idStr = Array.isArray(id) ? id[0] : id
    if (!idStr) { return <div> No Data.</div> }

    const bannersData = await getBannerById(idStr)
    if (!bannersData) return
    //console.log("bannerdata?: ", bannersData)
    const webImages = bannersData.webImages ?? [];
    const mobileImages = bannersData.mobileImages ?? [];

    //console.log("webImages", webImages);
    //console.log("mobileImages", mobileImages);

    return (
        <div>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {
                    href: "/admin-dashboard/banners",
                    label: "Banners",
                },
                {
                    label: "Edit Banners"
                }
            ]}
            />
            <div className='mt-14'>
                <DeleteBannerButton
                    bannerId={bannerId}
                    name='Delete all images'
                    webImages={webImages}
                    mobileImages={mobileImages}
                />
                <BannersTab
                    webImages={webImages}
                    mobileImages={mobileImages}
                />
            </div>
        </div>
    )
}
