"use client"

import { useState } from 'react'
import { Property } from '@/types/property'

type PropertyPick = Pick<Property, 'description' | 'ingredients' | 'howToUse' | 'review'>
type TabType = "Description" | "Ingredients" | "How to use" | "Review"
const Tabs: TabType[] = ["Description", "Ingredients", "How to use", "Review"]

export default function PropertyTab({
    description,
    ingredients,
    howToUse,
    review,
}: PropertyPick) {

    const [selectedTab, setSelectedTab] = useState<TabType>("Description")

    const getContent = () => {
        switch (selectedTab) {
            case "Description":
                return description
            case "Ingredients":
                return ingredients
            case "How to use":
                return howToUse
            case "Review":
                return review
            default:
                return null
        }
    }

    return (
        <div>
            <div className="flex mb-4 text-center">
                {Tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex-grow border-b-2 py-2 text-lg px-1 transition-all duration-300 ${selectedTab === tab ? "border-primary text-primary font-bold " : "border-muted-foreground text-foreground"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <p className="leading-relaxed mb-10">{getContent()}</p>
        </div>
    )
}