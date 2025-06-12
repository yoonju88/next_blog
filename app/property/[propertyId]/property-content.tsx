'use client'

import { Property } from "@/types/property"
import { DecodedIdToken } from "firebase-admin/auth"
import PropertyTab from "./propertyTab"
import ToggleFavouriteButton from "@/components/toggle-favourite-button"
import Rating from "@/components/review/Rating"
import Modal from "@/components/Modal"
import { NewReviewForm } from "./new-review-form"
import Reviews from "@/components/review/reviewsSheet"
import SlideImages from "@/components/carousel"
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import PropertyActions from "@/components/property/property-actions"

type Props = {
    property: Property
    propertyId: string
    reviewsAverage: number
    allreviews: any[]
    userFavourites: any
    verifiedToken: DecodedIdToken | null
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex border-t border-muted-foreground py-4 w-full">
        <span className="text-muted-foreground">{label}</span>
        <span className="ml-auto text-muted-foreground">{value}</span>
    </div>
)

export default function PropertyContent({
    property,
    propertyId,
    reviewsAverage,
    allreviews,
    userFavourites,
    verifiedToken
}: Props) {
    return (
        <section className='w-[100%] p-10'>
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap lg:flex-nowrap">
                    <div className="lg:basis-1/2 lg:min-w-0 lg:max-w-1/2 w-full">
                        {!!property?.images && (
                            <SlideImages
                                images={property.images}
                                imageH="min-h-[600px]"
                            />
                        )}
                    </div>
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mb-6 lg:mb-0 relative">
                        <div className="mb-3">
                            <Breadcrumbs items={[{
                                href: "/property/SkinCare",
                                label: `${property.category}`
                            }, {
                                label: `${property.subCategory}`
                            }]}
                            />
                        </div>
                        {(!verifiedToken || !verifiedToken.admin) && (
                            <ToggleFavouriteButton
                                isFavourite={userFavourites.propertyIds.includes(property.id)}
                                propertyId={property.id}
                            />
                        )}
                        <h2 className="text-muted-foreground title-font tracking-widest uppercase mb-2">{property.brand}</h2>
                        <h1 className="text-4xl title-font font-medium mb-2">{property.name}</h1>
                        <h3 className="text-primary tracking-widest mb-6 font-semibold">{property.subTitle}</h3>
                        <div className="mb-14">
                            {allreviews.length < 1 && (
                                <Modal
                                    title="New review"
                                    description="Create your review of this product."
                                >
                                    <NewReviewForm propertyId={propertyId} />
                                </Modal>
                            )}
                            {allreviews.length > 0 && (
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground/80 tracking-widest">{reviewsAverage}/5</span>
                                        <Rating rating={reviewsAverage} />
                                        <p>({allreviews.length})</p>
                                    </div>
                                    <Reviews reviews={allreviews} />
                                </div>
                            )}
                        </div>
                        <InfoRow label="Skin Type" value={property.skinType} />
                        <InfoRow label="Skin Benfit" value={property.skinBenefit} />
                        <div className="flex border-t border-muted-foreground py-4 w-full">
                            <span className="text-muted-foreground">Volume</span>
                            <span className="ml-auto text-muted-foreground">{property.volume} ml</span>
                        </div>
                        <PropertyActions property={property} />
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
        </section>
    )
} 