"use client"

import { useState } from 'react'
import { Property } from '@/types/property'
import Reviews from '@/components/reviews'

type PropertyPick = Pick<Property, 'description' | 'howToUse' | 'ingredients'>
type TabType = "Description" | "How to use" | "Ingredients"
const Tabs: TabType[] = ["Description", "How to use", "Ingredients"]

export default function PropertyTab({
    description,
    ingredients,
    howToUse,
}: PropertyPick) {

    const [selectedTab, setSelectedTab] = useState<TabType>("Description")
    const [expanded, setExpanded] = useState(false)
    const maxLength = 300;

    const getContent = (() => {
        switch (selectedTab) {
            case "Description":
                return description
            case "Ingredients":
                return ingredients
            case "How to use":
                return howToUse
            default:
                return " "
        }
    })()
    const isLong = getContent.length > maxLength
    const displayedText = expanded ? getContent : getContent.slice(0, maxLength);

    return (
        <div className="relative mb-4 max-w-[80%] mx-auto">
            <div className="flex justify-center text-center gap-x-4 ">
                {Tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setSelectedTab(tab)
                            setExpanded(false)
                        }}
                        className={`flex-grow py-4 text-lg font-semibold transition-all duration-300 hover:text-primary hover:uppercase hover:bg-primary/10 rounded-t ${selectedTab === tab ? "text-primary font-bold bg-primary/10 uppercase " : "border-muted-foreground text-foreground"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <hr className=" w-full border-t border-muted-foreground" />
            <p className="leading-relaxed mb-4 break-words whitespace-pre-wrap text-center mt-10  max-w-[70%] mx-auto">
                {displayedText}
                {isLong && (
                    <button
                        onClick={() => setExpanded(prev => !prev)}
                        className="text-primary transition-all duration-300 hover:font-bold"
                    >
                        {expanded ? "  See less" : " ...See more"}
                    </button>
                )}
            </p>
        </div>
    )
}