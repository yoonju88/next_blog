'use client'

import { useState } from 'react'
import { HomeBannerImage } from '@/types/banner'
import Image from 'next/image'


type BannerPick = Pick<HomeBannerImage, 'webImages' | 'mobileImages'>
type TabType = "webImages" | "mobileImages"
const Tabs: TabType[] = ["webImages", "mobileImages"]


export default function BannersTab({
    webImages,
    mobileImages,
}: BannerPick) {

    const [selectedTab, setSelectedTab] = useState<TabType>("webImages")
    const getContent = (() => {
        switch (selectedTab) {
            case "webImages":
                return webImages
            case "mobileImages":
                return mobileImages
            default:
                return []
        }
    })

    return (
        <div className="relative mb-4 mt-10">
            <div className="flex justify-center text-center mx-auto">
                {Tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setSelectedTab(tab)
                        }}
                        className={`flex-grow py-4 text-lg font-semibold transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-t ${selectedTab === tab ? "text-primary font-bold bg-primary/10" : "border-muted-foreground text-foreground"}`}
                    >
                        {tab === "webImages" ? "Web" : "Mobile"}
                    </button>
                ))}
            </div>
            <hr className=" w-full border-t border-muted-foreground/50" />
            <div className={selectedTab === "webImages" ?
                "flex flex-col gap-4 mt-10"
                : "flex gap-4 justify-center items-center mt-14"}>
                {getContent().map((image, idx) => (
                    <Image
                        key={image.id}
                        src={image.url}
                        alt={`banner + ${idx}`}
                        width={selectedTab === "webImages" ? "1290" : "350"}
                        height="600"
                        className="object-cover"
                    />
                ))
                }
            </div>
        </div>
    )
}