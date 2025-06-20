import { getUserFavourites } from '@/data/favourites'
import { getPropertiesById } from '@/lib/properties'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import RemoveFavouriteButton from './remove-favourite'
import ProductStatusBadge from '@/components/Product-status-badge'
import Link from 'next/link'
import SelectedQuantity from '../../../components/panier/selectedQuantityToCart'
import EmptyList from '@/components/EmptyList'


export default async function MyFavourites({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {
    const searchParamsValue = await searchParams
    const page = searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1

    const pageSize = 2;
    const favourites = await getUserFavourites();
    const allFavourites = favourites.propertyIds || []
    const totalPages = Math.ceil(allFavourites.length / pageSize)
    const paginatedFavourites = allFavourites.slice(
        (page - 1) * pageSize,
        page * pageSize
    )

    if (!paginatedFavourites.length && page > 1) {
        redirect(`/account/my-favourites?page=${totalPages}`)
    }
    const properties = await getPropertiesById(paginatedFavourites)

    return (
        <div className='text-center'>
            <h1 className="text-3xl font-semibold">My Favourites</h1>
            {!paginatedFavourites.length ? (
                <EmptyList
                    title="Your favorites list is empty"
                    message="Start adding items to your favorites to see them here."
                />
            ) : (
                <div className="flex gap-6">
                    {paginatedFavourites.map((favourite) => {
                        const property = properties.find(
                            (property) => property.id === favourite
                        )
                        if (!property) return null

                        const mainImage = Array.isArray(property.images) && property.images.length > 0
                            ? imageUrlFormatter(property.images[0])
                            : '/fallback.jpg';

                        const PropertyId = property.id
                        return (
                            <Card key={favourite} className="flex flex-col-2 overflow-hidden mt-10 w-[350px] border-none pt-0">
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
                                                className="absolute top-4 right-4  bg-gray-300 p-1.5 rounded-md text-foreground hover:text-primary hover:bg-gray-100  hover:shadow-foreground/30 hover:shadow-sm duration-300 transition-all"
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
                                                <span className="line-through pr-2">
                                                    €{property.price}
                                                </span>
                                                <span className=" text-white px-2 py-1 bg-primary rounded-lg text-sm ">
                                                    Club -5%
                                                </span>
                                                <span className="text-primary font-bold text-lg pl-2">
                                                    €{property.price * 0.95}
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
            )}
        </div>
    )
}


