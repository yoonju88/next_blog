import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

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
                        label: "New Product"
                    }
                ]}
            />
            <Card className="mt-5 bg-white/40">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        New Product
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div >
    )
}
