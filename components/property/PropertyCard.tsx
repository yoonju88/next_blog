'use client'
import Image from "next/image"
import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"
import imageUrlFormatter from '@/lib/imageUrlFormatter';

type Property = {
    id: string
    name: string
    subTitle?: string
    brand?: string
    price: number
    images: string[]
}

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
                <Link href={`/property/${property.id}`}>
                    <Image
                        src={mainImage}
                        alt={property.name || "Product image"}
                        fill
                        className={`object-cover object-center group-hover:scale-105 ${hoverEffect}`}
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-gray-700 text-lg font-medium px-4 py-2 rounded">
                            Learn More
                        </span>
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
                    <span className="text-foreground/80">€ {property.price}</span>
                </div>
                {actionButton}
            </div>
        </div>
    )
}