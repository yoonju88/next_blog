import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import NewPropertyForm from './new-property-form'

export default function NewProduct() {
    return (
        <div>
            <Breadcrumbs
                items={[
                    {
                        href: "/admin-dashboard",
                        label: "Dashboard"
                    },
                    {
                        href: "/admin-dashboard/properties",
                        label: "Products"
                    },
                    {
                        label: "New Product"
                    },
                ]}
            />
            <Card className="mt-6 bg-white/40 w-full sm:w-[100vh]">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        New Product
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <NewPropertyForm />
                </CardContent>
            </Card>
        </div >
    )
}
