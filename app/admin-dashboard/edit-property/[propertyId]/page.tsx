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
        <div>
            <Breadcrumbs items={[{
                href: "/admin-dashboard",
                label: "Dashboard"
            }, {
                label: "Edit Property"
            }]}
            />
            <Card className='mt-5 w-full sm:w-[100vh]'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold flex justify-between'>
                        Edit property
                        <DeletePropertyButton propertyId={propertyId} images={property.images ?? []} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <EditPropertyForm
                        id={property.id}
                        name={property.name}
                        subTitle={property.subTitle}
                        price={property.price}
                        category={property.category}
                        origin={property.origin}
                        manufacturer={property.manufacturer}
                        volume={property.volume}
                        description={property.description}
                        status={property.status}
                        brand={property.brand}
                        ingredients={property.ingredients}
                        keyIngredients={property.keyIngredients}
                        skinType={property.skinType}
                        howToUse={property.howToUse}
                        expireDate={property.expireDate}
                        stockQuantity={property.stockQuantity}
                        images={property.images || []}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
