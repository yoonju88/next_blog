import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getBannerById } from '../action';
import DeleteBannerButton from './delete-banner-button';
import BannersTab from './bannersTab';

export default async function EditBanners({ params }: { params: { id: string } }) {
    const bannerId = params.id
    if (!bannerId) { return <div> No Data.</div> }

    const bannersData = await getBannerById(bannerId)
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
