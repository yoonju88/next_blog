import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { getPropertyById } from '@/lib/properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EditPropertyForm from './edit-property-form';
import DeletePropertyButton from './delete-property-button';

export default async function EditProperty({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = await params;
    const property = await getPropertyById(propertyId)

    if (!propertyId) {
        return (
            <div>
                <h2> Property not found</h2>
                <p>The property with the given ID could not be found.</p>
            </div>
        )
    }

    return (
        <>
            <h1>Edit Property</h1>
            <Card className='mt-10 w-full'>
                <CardHeader className="flex justify-end">
                    <DeletePropertyButton propertyId={propertyId} images={property.images ?? []} />
                </CardHeader>
                <CardContent>
                    <EditPropertyForm
                        id={property.id}
                        name={property.name}
                        subTitle={property.subTitle}
                        price={property.price}
                        costPrice={property.costPrice}
                        category={property.category}
                        subCategory={property.subCategory}
                        origin={property.origin}
                        manufacturer={property.manufacturer}
                        volume={property.volume}
                        description={property.description}
                        status={property.status}
                        brand={property.brand}
                        ingredients={property.ingredients}
                        skinType={property.skinType}
                        skinBenefit={property.skinBenefit}
                        howToUse={property.howToUse}
                        expireDate={property.expireDate}
                        stockQuantity={property.stockQuantity}
                        created={property.created}
                        updated={property.updated}
                        images={property.images || []}
                    />
                </CardContent>
            </Card>
        </>
    )
}
