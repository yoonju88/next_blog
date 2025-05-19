
import { getUserFavourites } from '@/data/favourites'
import { getPropertiesById } from '@/lib/properties'
import { Button } from '@/components/ui/button'
import { ShoppingBagIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import RemoveFavouriteButton from './remove-favourite'

import { Input } from '@/components/ui/input'
import ProductStatusBadge from '@/components/Product-status-badge'

export default async function MyFavourites({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {
    const searchParamsValue = await searchParams
    const page = searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1

    const pageSize = 2;
    const favourites = await getUserFavourites();
    const allFavourites = Object.keys(favourites)
    const totalPages = Math.ceil(allFavourites.length / pageSize)
    const paginatedFavourites = allFavourites.slice(
        (page - 1) * pageSize,
        page * pageSize
    )

    if (!paginatedFavourites.length && page > 1) {
        redirect(`/account/my-favourites?page=${totalPages}`)
    }
    const properties = await getPropertiesById(paginatedFavourites)
    console.log({ properties })
    return (
        <div className='text-center'>
            <h1 className="text-3xl font-semibold">My Favourites lists.</h1>
            {!paginatedFavourites.length && (
                <h2 className="mt-4 text-2xl font-semibold text-primary">You have no favourited list...</h2>
            )}
            <div className="flex gap-6">
                {!!paginatedFavourites.length && (
                    paginatedFavourites.map((favourite) => {
                        const property = properties.find(
                            (property) => property.id === favourite
                        )
                        return (
                            <Card key={favourite} className="flex flex-col-2 overflow-hidden mt-10 w-[350px] border-none pt-0">
                                <CardHeader className="px-0">
                                    <CardTitle >
                                        <div className="relative flex flex-col justify-center items-center w-full h-[220px] overflow-hidden">
                                            {property.images && property.images.length > 0 ? (
                                                <Image
                                                    src={imageUrlFormatter(property.images[0])}
                                                    alt="main image"
                                                    fill
                                                    className="object-cover hover:scale-110 transition-all duration-300"
                                                />
                                            ) : (
                                                <Image
                                                    src="/fallback.jpg"
                                                    alt="No image"
                                                    fill
                                                    className="bject-cover"
                                                />
                                            )}
                                            <RemoveFavouriteButton propertyId={property.id} />
                                            <ProductStatusBadge status={property.status} className="absolute top-4 left-4" />
                                        </div>
                                        <h4 className="text-foreground/50 mt-6 mb-2 px-4 uppercase text-sm">{property.brand}</h4>
                                        <h3 className="text-base text-foreground px-4 mb-4 uppercase">{property.name}</h3>
                                        <CardDescription className="px-4">
                                            <p className="text-base">
                                                <span className="line-through pr-2">
                                                    €{property.price}
                                                </span>
                                                <span className=" text-white px-2 py-1 bg-primary rounded-lg text-sm ">
                                                    club -5%
                                                </span>
                                                <span className="text-primary font-bold text-lg pl-2">
                                                    €{property.price * 0.95}
                                                </span>
                                            </p>
                                        </CardDescription>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 space-y-6">
                                    <div>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className=""
                                            placeholder='Choose your order quantity'
                                        />
                                    </div>
                                    <Button variant="default" className='w-full' ><ShoppingBagIcon />Cart</Button>
                                </CardContent>
                            </Card>
                        )
                    })
                )
                }
            </div>
        </div>
    )
}


