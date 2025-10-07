'use client'

import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/client'
import imageUrlFormatter from '@/lib/imageUrlFormatter'
import PropertyCard from '@/components/property/PropertyCard'
import EmptyList from '@/components/home/EmptyList'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Property } from '@/types/property'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

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
        return <div className="text-center">Loading...</div>
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
                <span className="text-primary uppercase">
                    {`"${searchQuery}"`}
                </span>
                {` search results (${properties.length} items)`}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                    const mainImage = Array.isArray(property.images) && property.images.length > 0
                        ? imageUrlFormatter(property.images[0])
                        : '/fallback.jpg'

                    return (
                        <PropertyCard
                            property={property}
                            key={property.id}
                            actionButton={
                                <button
                                    type="button"
                                    className='shrink-0 rounded-2xl bg-primary/10 p-1 hover:bg-primary/20 hover:shadow-sm transition-all duration-300'
                                >
                                    <Link href={`/property/${property.id}`}>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </button>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
} 