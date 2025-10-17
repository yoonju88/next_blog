import { getPropertyById } from "@/lib/properties";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { getUserFavourites } from "@/data/favourites";
import { getReviewsByPropertyId, getAverageRating } from '@/lib/reviews';
import PropertyContent from "./property-content";
import { Property } from "@/types/property";
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import BackButton from "@/components/back-button"

function serializeProperty(property: any): Property {
    const parseTimestamp = (ts: any): string => {
        if (ts?.toDate) {
            return ts.toDate().toISOString();
        } else if (ts?._seconds) {
            return new Date(ts._seconds * 1000).toISOString();
        } else {
            return new Date().toISOString();
        }
    };

    return {
        ...property,
        created: parseTimestamp(property.created),
        updated: parseTimestamp(property.updated),
    };
}

function serializeReview(review: any) {
    const parseTimestamp = (ts: any): string => {
        if (ts?.toDate) {
            return ts.toDate().toISOString();
        } else if (ts?._seconds) {
            return new Date(ts._seconds * 1000).toISOString();
        } else {
            return new Date().toISOString();
        }
    };

    return {
        ...review,
        createdAt: parseTimestamp(review.createdAt),
        updatedAt: review.updatedAt ? parseTimestamp(review.updatedAt) : undefined,
    };
}

type RouteParams = { propertyId: string | string[] }


export default async function PropertyPage({
    params
}: {
    params: Promise<RouteParams>
}) {

    const { propertyId: raw } = await params

    const propertyId = Array.isArray(raw) ? raw[0] : raw
    if (!propertyId) { return <div>No Data</div> }
    const rawProperty = await getPropertyById(propertyId);
    if (!rawProperty) { return <div>No Data</div> }
    const property = serializeProperty(rawProperty);
    const reviewsAverage = await getAverageRating(propertyId);
    const roundedAverage = Math.round(reviewsAverage * 10) / 10;
    const rawReviews = await getReviewsByPropertyId(propertyId);
    const allreviews = rawReviews.map(serializeReview);
    const userFavourites = await getUserFavourites();

    if (!userFavourites) { return null }

    const cookieStore = await cookies()
    const token = cookieStore.get("firevaseAuthToken")?.value
    let verifiedToken: DecodedIdToken | null = null

    if (token) {
        verifiedToken = await auth.verifyIdToken(token)
    }
    // console.log("Breadcrumb에 전달된 property 객체:", property);

    return (
        <div className="w-full py-24">
            <div className="w-full mb-4">
                <div className="flex items-center pl-12  min-w-[200px]">
                    <BackButton />
                    <div className="border-r h-3 border-gray-400 mr-3" />
                    <Breadcrumbs items={[{
                        href: `/property?category=${property.category.toLowerCase().replace(' ', '')}`,
                        label: `${property.category}`
                    }, {
                        label: `${property.subCategory}`
                    }]}
                    />
                </div>
            </div>
            <PropertyContent
                property={property}
                propertyId={propertyId}
                reviewsAverage={roundedAverage}
                allreviews={allreviews}
                userFavourites={userFavourites}
                verifiedToken={verifiedToken}
            />
        </div>
    )
}