import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getBannerById } from '../action';
import DeleteBannerButton from './delete-banner-button';
import BannersTab from './bannersTab';


export default async function EditBanners({
    params,
}: {
    params: { id: string | string[] }
}) {
    const bannerId = Array.isArray(params.id) ? params.id[0] : params.id
    if (!bannerId) { return <div> No Data.</div> }

    const bannersData = await getBannerById(bannerId)
    if (!bannersData) { return <div> No Data.</div> }
    //console.log("bannerdata?: ", bannersData)
    const webImages = bannersData.webImages ?? [];
    const mobileImages = bannersData.mobileImages ?? [];
    const webImageUrls = (bannersData.webImages ?? []).map(img => img.url)
    const mobileImageUrls = (bannersData.mobileImages ?? []).map(img => img.url)
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
                    bannerId={bannersData.id}
                    name='Delete all images'
                    webImages={webImageUrls}
                    mobileImages={mobileImageUrls}
                />
                <BannersTab
                    webImages={webImages}
                    mobileImages={mobileImages}
                />
            </div>
        </div>
    )
}
