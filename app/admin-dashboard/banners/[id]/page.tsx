import React from 'react'
import { getBannerById } from '../action';
import DeleteBannerButton from './delete-banner-button';
import BannersTab from './bannersTab';

type RouteParams = { id: string | string[] }

export default async function EditBanners({
    params,
}: {
    params: Promise<RouteParams>
}) {
    const { id } = await params;
    const bannerId = Array.isArray(id) ? id[0] : id;
    if (!bannerId) { return <div> No Data.</div> }

    const bannersData = await getBannerById(bannerId)
    if (!bannersData) { return <div> No Data.</div> }
    //console.log("bannerdata?: ", bannersData)
    const webImages = bannersData.webImages ?? [];
    const mobileImages = bannersData.mobileImages ?? [];
    //console.log("webImages", webImages);
    //console.log("mobileImages", mobileImages);

    return (
        <>
            <h1 className="mb-8"> Edit Banner Images</h1>
            <DeleteBannerButton
                bannerId={bannersData.id}
                name='Delete all images'
                webImages={webImages}
                mobileImages={mobileImages}
            />
            <BannersTab
                webImages={webImages}
                mobileImages={mobileImages}
            />
        </>
    )
}
