import React from 'react'
import { getMenuImage } from './action'
import MenuImageEditForm from './MenuImageEditForm';
import MenuImageUploadForm from './MenuImageUploadForm';

export default async function MenuImagePage() {
    const imageData = await getMenuImage()
    return (
        <>
            <h1>Menu Image</h1>
            <div className="mt-10">
                {!imageData ? (
                    <MenuImageUploadForm />
                ) : (
                    <MenuImageEditForm image={imageData} />
                )}
            </div>
        </>
    )
}
