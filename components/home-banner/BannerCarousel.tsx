'use client'
import { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaDotButton'
import Image from 'next/image';

type ImageItem = { id: string; url: string }

type PropType = {
    images: ImageItem[],
    size: string,
    imageH: any,
    width: number,
    height: number,
    options?: EmblaOptionsType,
}

export default function BannerCarousel({
    images,
    size,
    imageH,
    width,
    height,
    options,
}: PropType) {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    const onDotClickResetAutoplay = useCallback((emblaApi: EmblaCarouselType) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
        if (autoplay.options.stopOnInteraction === false) {
            autoplay.reset()
        } else {
            autoplay.stop()
        }
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onDotClickResetAutoplay
    )

    return (
        <div className="relative w-full">
            <div className="overflow-hidden w-full" ref={emblaRef}>
                <div className="flex">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="flex-[0_0_100%] relative w-full"
                        >
                            <div className={`relative ${imageH} w-full`}>
                                <Image
                                    src={image.url}
                                    alt={`Banner ${index + 1}`}
                                    width={width}
                                    height={height}
                                    sizes={size}
                                    className="object-cover object-center"
                                    priority
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {images.length > 1 && (
                <div className="absolute md:bottom-[5%] bottom-[3%] left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
                    {scrollSnaps.map((_, idx) => (
                        <DotButton
                            key={idx}
                            onClick={() => onDotButtonClick(idx)}
                            className={`w-10 h-1 transition-all hover:bg-primary/50 dutation-300 ${selectedIndex === idx ? 'bg-primary/60' : 'bg-white'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}