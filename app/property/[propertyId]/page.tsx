import { getPropertyById } from "@/lib/properties";
import ReactMarkdown from 'react-markdown' // npm i react-markdown@8.0.6
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import Image from "next/image";
//import BackButton from './back-button'
import imageUrlFormatter from "@/lib/imageUrlFormatter";
import BackButton from "./back-button";
import Link from "next/link";
import PropertyTab from "./propertyTab";

export const dynamic = "force-static"

export default async function Property({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = await params
    const property = await getPropertyById(propertyId)
    console.log(property)
    const linkStyle = "flex-grow text-foreground border-b-2 border-muted-foreground py-2 text-lg px-1 transition-all duration-300 hover:border-primary hover:text-primary hover:font-bold"

    return (
        <section className="overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w4/5 mx-auto flex flex-col md:flex-row space-x-10">
                    {!!property?.images && (
                        <Carousel className="w-full">
                            <CarouselContent>
                                {property?.images.map((image, index) => (
                                    <CarouselItem key={image}>
                                        <div className="relative h-[80vh]">
                                            <Image
                                                src={imageUrlFormatter(image)}
                                                alt={`Image ${index + 1}`}
                                                fill
                                                className="object-cover"
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
                    <div className="lg-w-1/2 w-full lg:pl-10 ls:py-6 mb-6 lg:mb-0">
                        <BackButton />
                        <h2 className="text-foreground title-font tracking-widest">{property.brand}</h2>
                        <h1 className="text-3xl title-font font-medium mb-4"> {property.name}</h1>
                        <PropertyTab
                            description={property.description}
                            ingredients={property.ingredients}
                            howToUse={property.howToUse}
                            review={property.review}
                        />
                        <div className="flex border-t border-muted-foreground py-4">
                            <span className="text-muted-foreground">Origin</span>
                            <span className="ml-auto text-muted-foreground">{property.origin}</span>
                        </div>
                        <div className="flex border-t border-muted-foreground py-4">
                            <span className="text-muted-foreground">Skin Type</span>
                            <span className="ml-auto text-muted-foreground">{property.skinType}</span>
                        </div>
                        <div className="flex border-t border-muted-foreground py-4">
                            <span className="text-muted-foreground">Expire Date</span>
                            <span className="ml-auto text-muted-foreground">{property.expireDate}</span>
                        </div>

                        <div className="flex">
                            <span className="title-font font-medium text-2xl text-foreground">€ {property.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}