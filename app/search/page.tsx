'use client'

import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/client'
import { ShoppingBagIcon } from 'lucide-react'
import imageUrlFormatter from '@/lib/imageUrlFormatter'
import PropertyCard from '@/components/property/PropertyCard'
import AddToCartButton from '@/components/property/add-to-cart-button'
import EmptyList from '@/components/home/EmptyList'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Property } from '@/types/property'

export default function SearchPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    const dateParam = searchParams.get('date')
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        dateParam ? new Date(dateParam) : undefined
    )
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
        const formattedDate = date.toISOString().split('T')[0]
        router.push(`/search?q=${searchQuery}&date=${formattedDate}`)
    }

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true)
            try {
                let propertiesQuery = query(collection(db, 'properties'))
                
                if (selectedDate) {
                    propertiesQuery = query(
                        propertiesQuery,
                        where('created', '>=', selectedDate)
                    )
                }

                const snapshot = await getDocs(propertiesQuery)
                let properties = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Property[]

                if (searchQuery) {
                    const searchTerm = searchQuery.toLowerCase()
                    properties = properties.filter(property => 
                        property.name.toLowerCase().includes(searchTerm) ||
                        property.description?.toLowerCase().includes(searchTerm) ||
                        property.brand?.toLowerCase().includes(searchTerm) ||
                        property.category?.toLowerCase().includes(searchTerm)
                    )
                }

                setProperties(properties)
            } catch (error) {
                console.error('Error fetching properties:', error)
                setProperties([])
            }
            setLoading(false)
        }

        if (searchQuery) {
            fetchProperties()
        }
    }, [searchQuery, selectedDate])

    if (!searchQuery) {
        return (
            <div className="flex flex-col items-center gap-8">
                <EmptyList
                    title="Enter a search term"
                    message="To search for products, enter a search term."
                />
            </div>
        )
    }

    if (loading) {
        return <div className="text-center">로딩 중...</div>
    }

    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center gap-8">
                <EmptyList
                    title="No results found"
                    message={`"${searchQuery}" about this product.`}
                />
            </div>
        )
    }

    return (
        <div className='text-center'>
            <h1 className="text-2xl font-bold mb-8">
                "{searchQuery}" Search Results ({properties.length} items)
            </h1>
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                    const mainImage = Array.isArray(property.images) && property.images.length > 0
                        ? imageUrlFormatter(property.images[0])
                        : '/fallback.jpg'

                    return (
                        <PropertyCard
                            property={property}
                            key={property.id}
                            actionButton={
                                <AddToCartButton
                                    key={property.id}
                                    property={property}
                                >
                                    <ShoppingBagIcon />
                                </AddToCartButton>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
} 