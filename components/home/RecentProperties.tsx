import React from 'react'
import { Property } from '@/types/property'
import Image from 'next/image'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function RecentProperties({ items }: { items: Property[] }) {

    const hoverEffect = "transition-all duration-300"
    return (
        <div className='flex flex-col sm:flex-row gap-6 mt-14'>
            {items.map((item) => (
                <div key={item.id} className=" w-full sm:min-w-[300px]" >
                    <div className="relative w-full h-[400px] overflow-hidden">
                        <Link
                            href={`/property/${item.id}`}
                        >
                            <Image
                                src={imageUrlFormatter(item.images[0])}
                                alt="product"
                                fill
                                className={`object-cover hover:scale-105 ${hoverEffect}`}
                            />
                        </Link>
                    </div>
                    <div className="mt-4 flex items-center justify-between p-2">
                        <div className="flex-1">
                            <h2 className={`uppercase font-semibold text-foreground/90 hover:tracking-wide  hover:text-foreground/80 ${hoverEffect}`}>
                                <Link
                                    href={`/property/${item.id}`}
                                >
                                    {item.name}
                                </Link>
                            </h2>
                            <p className="font-light text-sm capitalize text-foreground/80">{item.subTitle}</p>
                            <span className="text-foreground/80" >€ {item.price}</span>
                        </div>
                        <button type='button' className={`shrink-0 rounded-2xl bg-primary/10 p-1 hover:bg-primary/20 hover:shadow-sm ${hoverEffect}`}>
                            <Link href={`/property/${item.id}`}>
                                <ChevronRight className='w-5 h-5' />
                            </Link>
                        </button>
                    </div>
                </div >
            ))
            }
        </div >
    )
}
