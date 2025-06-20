'use client'
import Image from "next/image"
import Link from "next/link"
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import { Property } from "@/types/property";

type Props = {
    property: Property
    actionButton?: React.ReactNode
}

export default function PropertyCard({ property, actionButton }: Props) {
    const hoverEffect = "transition-all duration-300"
    const mainImage = Array.isArray(property.images) && property.images.length > 0
        ? imageUrlFormatter(property.images[0])
        : "/fallback.jpg"

    return (
        <div className="w-full sm:min-w-[300px]" key={property.id}>
            <div className="relative w-full h-[400px] group overflow-hidden">
                <Link href={`/property/${property.id}`} className="block w-full h-full">
                    <div className='relative w-full h-full'>
                        <Image
                            src={mainImage}
                            alt={property.name || "Product image"}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`object-cover object-center group-hover:scale-105 ${hoverEffect}`}
                        />
                        {property.onSale && typeof property.saleRate === 'number' && property.saleRate > 0 && (
                            <div className="absolute top-4 left-4 bg-green-700/70 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                                Sale -{property.saleRate}%
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-gray-700 text-lg font-medium px-4 py-2 rounded">
                                Learn More
                            </span>
                        </div>
                    </div>

                </Link>
            </div>

            <div className="mt-4 flex items-center justify-between p-2">
                <div className="flex-1 text-left">
                    <h2 className={`uppercase font-semibold text-foreground/90 hover:tracking-wide hover:text-foreground/80 ${hoverEffect}`}>
                        <Link href={`/property/${property.id}`}>
                            {property.name}
                        </Link>
                    </h2>
                    <p className="font-light text-sm capitalize text-foreground/80">
                        {property.subTitle || property.brand}
                    </p>
                    <span className="text-foreground/80">
                        {property.onSale && property.salePrice
                            ? (<>
                                <span className="line-through text-gray-400 mr-1">€ {property.price}</span>
                                <span className="text-foreground/80 font-bold">€ {property.salePrice}</span>
                            </>)
                            : <>€ {property.price}</>
                        }
                    </span>
                </div>
                {actionButton}
            </div>
        </div>
    )
}