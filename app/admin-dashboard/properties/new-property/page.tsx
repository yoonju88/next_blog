import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import NewPropertyForm from './new-property-form'

export default function NewProduct() {
    return (
        <>
            <h1 >New Product</h1>
            <Card className="mt-10 bg-white/40 w-full sm:w-[100vh]">
                <CardContent>
                    <NewPropertyForm />
                </CardContent>
            </Card>
        </>
    )
}
