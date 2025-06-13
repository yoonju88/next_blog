import React from 'react'
import { Property } from '@/types/property'
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PropertyCard from '../property/PropertyCard';

export default function RecentProperties({ items }: { items: Property[] }) {

    const hoverEffect = "transition-all duration-300"
    return (
        <div className='flex flex-col sm:flex-row gap-6 mt-14'>
            {items.map((item) => (
                <PropertyCard
                    key={item.id}
                    property={item}
                    actionButton={
                        <button
                            type="button"
                            className={`shrink-0 rounded-2xl bg-primary/10 p-1 hover:bg-primary/20 hover:shadow-sm ${hoverEffect}`}
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
    )
}
