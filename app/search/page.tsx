import { getProperties } from '@/data/product'
import { ShoppingBagIcon } from 'lucide-react'
import imageUrlFormatter from '@/lib/imageUrlFormatter'
import PropertyCard from '@/components/property/PropertyCard'
import EmptyList from '@/components/home/EmptyList'
import Link from "next/link";
import { ChevronRight } from 'lucide-react';

export default async function SearchPage({
    searchParams
}: {
    searchParams?: { q?: string }
}) {
    const searchQuery = searchParams?.q || ''

    if (!searchQuery) {
        return (
            <EmptyList
                title="Please enter a search term"
                message="To search for products, please enter a keyword."
            />
        )
    }

    const { data: properties } = await getProperties({
        filters: {
            search: searchQuery
        },
        pagination: {
            pageSize: 100
        }
    })

    if (properties.length === 0) {
        return (
            <EmptyList
                title="검색 결과가 없습니다"
                message={`"${searchQuery}"에 대한 검색 결과가 없습니다.`}
            />
        )
    }
    const hoverEffect = "transition-all duration-300"

    return (
        <div className='text-center'>
            <h1 className="text-xl font-semibold mb-10 mt-10">
                Search results for "{searchQuery}" ({properties.length} items)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                    const mainImage = Array.isArray(property.images) && property.images.length > 0
                        ? imageUrlFormatter(property.images[0])
                        : '/fallback.jpg'

                    return (
                        <PropertyCard
                            property={property}
                            key={property.id}
                            actionButton={
                                <button
                                    type="button"
                                    className={`shrink-0 rounded-2xl bg-primary/10 p-1 hover:bg-primary/20 hover:shadow-sm ${hoverEffect}`}
                                >
                                    <Link href={`/property/${property.id}`}>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </button>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
} 