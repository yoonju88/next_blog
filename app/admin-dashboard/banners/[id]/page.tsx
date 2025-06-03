import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getBannerById } from '../action';
import DeleteBannerButton from './delete-banner-button';
import Image from 'next/image';

export default async function EditBanners({ params }: { params: { id: string } }) {
    const bannerId = params.id

    const bannersData = await getBannerById(bannerId)
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
                    id={bannerId}
                    name='Delte all images'
                />
                <div className="relative not-first-of-type:flex flex-col gap-4 mt-10">
                    <div>
                        <h1>Web Images</h1>
                        {webImages.map((image, idx) => (
                            <Image
                                key={image.id}
                                src={image.url}
                                alt={`banner + ${idx}`}
                                width="1290"
                                height="600"
                                className="object-cover"
                            />
                        ))
                        }
                    </div>
                    <div className='flex flex-col gap-4 justify-center items-center mt-14'>
                        <h1>Mobile Images</h1>
                        {mobileImages.map((image, idx) => (
                            <Image
                                key={image.id}
                                src={image.url}
                                alt={`banner + ${idx}`}
                                width="600"
                                height="700"
                                className="object-cover"
                            />
                        ))
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}
