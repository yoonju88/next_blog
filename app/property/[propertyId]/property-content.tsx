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
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from "@/components/ui/input"
import React, { useState } from 'react'
import AddToCartButton from "@/components/cart/add-to-cart-button"
import { useAuth } from "@/context/auth"


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
    const auth = useAuth()
    const currentUserId = auth?.user?.uid

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)


    const userReview = allreviews.find(review => String(review.userId) === String(currentUserId))
    const hasReviews = allreviews.length > 0
    const hasUserReview = !!userReview

    return (
        <section className='w-[100%] px-10'>
            <div className="container mx-auto">
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
                        <h2 className="text-muted-foreground title-font tracking-widest uppercase mb-2">{property.brand}</h2>
                        <h1 className="text-4xl title-font font-medium mb-2">{property.name}</h1>
                        <h3 className="text-primary tracking-widest mb-6 font-semibold">{property.subTitle}</h3>
                        <div className="mb-14">
                            {(!hasReviews && !hasUserReview) && (
                                <Modal
                                    title="New review"
                                    description="Create your review"
                                >
                                    <NewReviewForm propertyId={propertyId} />
                                </Modal>
                            )}
                            {(hasReviews && !hasUserReview) && (
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground/80 tracking-widest">{reviewsAverage}/5</span>
                                        <Rating rating={reviewsAverage} />
                                        <p>({allreviews.length})</p>

                                    </div>
                                    <div className="flex gap-4 items-center mt-3">
                                        <Reviews reviews={allreviews} />
                                        <Modal
                                            title="New review"
                                            description="Create your review"
                                        >
                                            <NewReviewForm propertyId={propertyId} />
                                        </Modal>
                                    </div>
                                </div>
                            )}
                            {(hasReviews && hasUserReview) && (
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
                        <span className="flex justify-end mt-6">
                            {property.onSale && property.salePrice
                                ? (<div className="flex items-center gap-1">
                                    <span className="line-through text-gray-400 mr-1 text-md"> {property.price} €</span>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                        -{property.saleRate}%
                                    </span>
                                    <span className="text-foreground/80 font-bold text-lg">{property.salePrice} €</span>
                                </div>)
                                : <span className="text-foreground/80 font-bold text-lg"> {property.price} €</span>
                            }
                        </span>

                        <div className="flex justify-between items-center mt-8">
                            <div className="flex gap-4 items-center flex-nowrap">
                                <Label className='whitespace-nowrap text-foreground/80'>
                                    Order Quantity :
                                </Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10)
                                        setQuantity(isNaN(val) || val < 1 ? 1 : val)
                                    }}
                                    placeholder='Choose your order quantity'
                                    className="w-[80px] *:text-center border-1"
                                />
                            </div>
                            <div className="flex  items-center justify-end">
                                <div className="flex space-x-4">
                                    {(!verifiedToken || !verifiedToken.admin) && (
                                        <ToggleFavouriteButton
                                            isFavourite={userFavourites?.propertyIds?.includes(property.id) ?? false}
                                            propertyId={property.id}
                                        />
                                    )}
                                    <AddToCartButton
                                        property={property}
                                        quantity={quantity}
                                        onAddedToCartAction={() => setOpen(true)}
                                    >
                                        Add to Cart
                                    </AddToCartButton>
                                </div>
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
        </section>
    )
} 