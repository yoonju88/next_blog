import { getUserFavourites } from '@/data/favourites'
import { getPropertiesById } from '@/lib/properties'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import RemoveFavouriteButton from './remove-favourite'
import ProductStatusBadge from '@/components/Product-status-badge'
import Link from 'next/link'
import SelectedQuantity from '@/components/cart/selectedQuantityToCart'
import EmptyList from '@/components/EmptyList'
import { Heart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyFavourites({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {
    const searchParamsValue = await searchParams
    const pageSize = 3;
    const favourites = await getUserFavourites();
    const allFavouritesIds = favourites.propertyIds || []

    const allValidProperties = await getPropertiesById(allFavouritesIds)

    const totalPages = Math.ceil(allValidProperties.length / pageSize)
    const page = searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1

    if (page > totalPages && totalPages > 0) {
        redirect(`/account/my-favourites?page=${totalPages}`)
    }

    const paginatedFavourites = allValidProperties.slice(
        (page - 1) * pageSize,
        page * pageSize
    )

    if (!paginatedFavourites.length && page > 1) {
        redirect(`/account/my-favourites?page=${totalPages}`)
    }
    if (allFavouritesIds.length === 0 || paginatedFavourites.length === 0) {
        return (
            <div className='text-center'>
                <h1 className="text-4xl font-semibold mb-10 mt-10">My Favourites</h1>
                <EmptyList
                    title="Your favorites list is empty"
                    description="Start adding items to your favorites to see them here."
                    buttonText="Return to Home page"
                    buttonHref='/'
                />
            </div>
        )
    }

    return (
        <div className='text-center'>
            <h1 className="text-4xl font-semibold mb-10 mt-10">My Favourites</h1>
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {paginatedFavourites.map((property) => {
                    const mainImage = Array.isArray(property.images) && property.images.length > 0
                        ? imageUrlFormatter(property.images[0])
                        : '/fallback.jpg';

                    const PropertyId = property.id
                    return (
                        <Card key={PropertyId} className="flex flex-col-2 overflow-hidden mt-10 w-[350px] border-none pt-0">
                            <CardHeader className="px-0">
                                <CardTitle >
                                    <div className="relative flex flex-col justify-center items-center w-full h-[220px] overflow-hidden">
                                        <Link href={`/property/${PropertyId}`} >
                                            <Image
                                                src={mainImage}
                                                alt={property.name || "Product image"}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-all duration-300"
                                            />
                                        </Link>
                                        <RemoveFavouriteButton
                                            propertyId={property.id}
                                            className="absolute top-4 right-4 bg-gray-100/30 p-1.5 rounded-md text-foreground shadow-sm shadow-foreground/30  hover:shadow-inner duration-300 transition-all"
                                        />
                                        <ProductStatusBadge
                                            status={property.status}
                                            className="absolute top-4 left-4"
                                        />
                                    </div>
                                    <h4 className="text-foreground/50 mt-6 mb-2 px-4 uppercase text-sm">{property.brand}</h4>
                                    <h3 className="text-base text-foreground px-4 mb-4 uppercase">{property.name}</h3>
                                    <CardDescription className="px-4">
                                        <p className="text-base">
                                            {/* <span className="line-through pr-2">
                                                    {property.price} €
                                                </span>
                                                <span className=" text-white px-2 py-1 bg-primary rounded-lg text-sm ">
                                                    Club -5%
                                                </span> */}
                                            <span className="text-primary font-bold text-lg pl-2">
                                                {property.price} €
                                            </span>
                                        </p>
                                    </CardDescription>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 space-y-6">
                                <div className='flex flex-col gap-6'>
                                    <SelectedQuantity item={property} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-4">
                    {Array.from({ length: totalPages }, (_, idx) => (
                        <Link
                            key={idx}
                            href={`/account/my-favourites?page=${idx + 1}`}
                            className={`px-3 py-1 rounded ${page === idx + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {idx + 1}
                        </Link>
                    ))}
                </div>
            )
            }
        </div >
    )
}


