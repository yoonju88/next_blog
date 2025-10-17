import React from 'react'
import { ChevronRight } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import Link from 'next/link';
import { Property } from '@/types/property';


interface itemsProps {
    data: Property[];
    link: string;
    title: string;
}

export default function ItemSection({ data, title, link }: itemsProps) {
    if (!data) {
        return null
    }
    const hoverEffect = "transition-all duration-300"

    return (
        <section>
            <h1 className="text-foreground text-4xl text-center font-bold">
                <Link href={link}>
                    {title}
                </Link>
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-20'>
                {data.map((item) => (
                    <PropertyCard
                        key={item.id}
                        property={item}
                        actionButton={
                            <button
                                type="button"
                                className={`shrink-0 rounded-2xl bg-gray-100 shadow-sm shadow-foreground/20 p-1 hover:shadow-inner ${hoverEffect}`}
                            >
                                <Link href={`/property/${item.id}`}>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </button>
                        }
                    />
                ))
                }
            </div >
        </section>
    )
}
