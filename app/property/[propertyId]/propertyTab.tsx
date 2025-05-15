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
        <div className="w-full max-w-[100]">
            <div className="flex mb-4 text-center">
                {Tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setSelectedTab(tab)
                            setExpanded(false)
                        }}
                        className={`flex-grow border-b-2 py-2 text-lg px-1 transition-all duration-300 hover:border-primary hover:text-primary hover:font-bold  ${selectedTab === tab ? "border-primary text-primary font-bold " : "border-muted-foreground text-foreground"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="w-full">
                <p className="leading-relaxed mb-4 break-words whitespace-pre-wrap text-center">
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

        </div>
    )
}