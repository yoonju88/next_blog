import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import Image from 'next/image';
import imageUrlFormatter from '@/lib/imageUrlFormatter';

export default function SlideImages({
    images,
    imageH,
}: {
    images: string[],
    imageH: string,
}) {
    return (
        <Carousel className="w-full h-full">
            <CarouselContent>
                {images.length > 0 &&
                    images.map((image, index) => (
                        <CarouselItem key={image + index}>
                            <div className={`relative ${imageH} w-full`}>
                                <Image
                                    src={imageUrlFormatter(image)}
                                    alt={`Image ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover object-center rounded group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                        </CarouselItem>
                    ))}
            </CarouselContent>
            {images.length > 1 && (
                <>
                    <CarouselPrevious className="translate-x-12 size-12" />
                    <CarouselNext className="-translate-x-12 size-12" />
                </>
            )}
        </Carousel>
    )
}
