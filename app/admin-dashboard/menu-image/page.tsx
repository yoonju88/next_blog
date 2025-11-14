import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getMenuImage } from './action'
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MenuImageEditForm from './MenuImageEditForm';
import MenuImageUploadForm from './MenuImageUploadForm';

export default async function MenuImagePage() {
    const imageData = await getMenuImage()
    return (
        <div>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {
                    label: "Menu Image",
                },
            ]}
            />
            <div className="mt-14">
                <h1 className="text-3xl font-black uppercase text-foreground ">Menu Images manage</h1>
            </div >
            <div className="mt-10">

                {!imageData ? (
                    <MenuImageUploadForm />
                ) : (
                    <MenuImageEditForm image={imageData} />
                )}
            </div>
        </div>
    )
}
