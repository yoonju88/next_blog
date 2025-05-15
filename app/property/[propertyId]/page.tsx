import { getPropertyById } from "@/lib/properties";
//import ReactMarkdown from 'react-markdown' // npm i react-markdown@8.0.6
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import Image from "next/image";
import imageUrlFormatter from "@/lib/imageUrlFormatter";
import BackButton from "./back-button";
import PropertyTab from "./propertyTab";
import { Button } from "@/components/ui/button";
import numeral from "numeral";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { getUserFavourites } from "@/data/favourites";
import ToggleFavouriteButton from "@/components/toggle-favourite-button"

export const dynamic = "force-static"

export default async function Property({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = await params
    const property = await getPropertyById(propertyId)
    console.log(property)
    const linkStyle = "flex-grow text-foreground border-b-2 border-muted-foreground py-2 text-lg px-1 transition-all duration-300 hover:border-primary hover:text-primary hover:font-bold"
    const InfoRow = ({ label, value }) => (
        <div className="flex border-t border-muted-foreground py-4 w-full">
            <span className="text-muted-foreground">{label}</span>
            <span className="ml-auto text-muted-foreground">{value}</span>
        </div>
    )
    const userFavourites = await getUserFavourites();
    if (!userFavourites) { return }
    const cookieStore = await cookies()
    const token = cookieStore.get("firevaseAuthToken")?.value
    let verifiedToken: DecodedIdToken | null

    if (token) {
        verifiedToken = await auth.verifyIdToken(token)
    }
    return (
        <section className='w-[100%]'>
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap lg:flex-nowrap">
                    <div className="lg:basis-1/2 lg:min-w-0 lg:max-w-1/2 w-full">
                        {!!property?.images && (
                            <Carousel className=" w-full h-full">
                                <CarouselContent>
                                    {property?.images.map((image, index) => (
                                        <CarouselItem key={image}>
                                            <div className="relative h-[80vh]">
                                                <Image
                                                    src={imageUrlFormatter(image)}
                                                    alt={`Image ${index + 1}`}
                                                    fill
                                                    className="object-cover object-center rounded"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {property.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="translate-x-16 size-12" />
                                        <CarouselNext className=" -translate-x-16 size-12" />
                                    </>
                                )}
                            </Carousel>
                        )}
                    </div>
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mb-6 lg:mb-0 relative">
                        <BackButton />
                        {(!verifiedToken || !verifiedToken.admin) && (
                            <ToggleFavouriteButton
                                isFavourite={userFavourites.propertyIds.includes[property.id]}
                                propertyId={property.id}
                            />
                        )
                        }
                        <h2 className="text-muted-foreground title-font tracking-widest uppercase mb-2 ">{property.brand}</h2>
                        <h1 className="text-4xl title-font font-medium mb-2"> {property.name}</h1>
                        <h3 className="text-primary tracking-widest mb-6 font-semibold ">{property.subTitle}</h3>
                        <div className="mb-14">
                            RATING HERE
                        </div>
                        <InfoRow label="Skin Type" value={property.skinType} />
                        <InfoRow label="Skin Benfit" value={property.skinBenefit} />
                        <div className="flex border-t border-muted-foreground py-4 w-full">
                            <span className="text-muted-foreground">Volume</span>
                            <span className="ml-auto text-muted-foreground">{property.volume} ml</span>
                        </div>
                        <div className="flex mt-10 mb-14">
                            <span className="title-font font-medium text-2xl text-foreground hover:text-primary transition-all duration-300">€ {numeral(property?.price).format("0,0")}</span>
                            <div className="flex space-x-4 ml-auto">
                                <Button variant="outline"> Add to Wish List</Button>
                                <Button> Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="min-w-full mt-20">
                    <PropertyTab
                        description={property.description}
                        ingredients={property.ingredients}
                        howToUse={property.howToUse}
                    />
                </div>
            </div>

        </section >
    )
}