'use client'
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell, TableFooter } from '@/components/ui/table'
import { EyeIcon, PencilIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import numeral from "numeral";//npm install numeral , npm install @types/numeral
import Image from 'next/image';
import storagePathToUrl from '@/lib/storagePathToUrl';
import AddSaleDialog from '@/components/sales/AddSaleDialog';

export type Property = {
    // ... 기존 필드 ...
    saleStartDate?: string; // ISO date string
    saleEndDate?: string;   // ISO date string
}

export default function PropertyTable({
    data,
    totalPages,
    currentPage,
}: {
    data: any[],
    totalPages: number;
    currentPage: number;
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [defaultSalePrice, setDefaultSalePrice] = useState<number>(0);
    const [defaultSaleRate, setDefaultSaleRate] = useState<number>(0);
    const [defaultSaleStartDate, setDefaultSaleStartDate] = useState<string>("");
    const [defaultSaleEndDate, setDefaultSaleEndDate] = useState<string>("");

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }
    const handleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(data.map(d => d.id))
        }
    }
    const goToPage = (pageNumber: number) => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('page', pageNumber.toString())
        router.push(`/admin-dashboard/properties?${newParams.toString()}`)
    }

    const getDisplayPrice = (property) =>
        property.onSale && property.salePrice ? property.salePrice : property.price;

    return <>
        {!data && (
            <h1 className='text-center text-zinc-400 py-20 font-bold text-3xl'>
                You have no properties
            </h1>
        )}
        {!!data && (
            <>
                <div className="flex justify-between items-center mb-4 mt-4">
                    <Button onClick={() => setDialogOpen(true)} disabled={selectedIds.length === 0}>
                        <PlusCircleIcon />Set Sale
                    </Button>
                    <AddSaleDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        selectedIds={selectedIds}
                        defaultSalePrice={defaultSalePrice}
                        defaultSaleRate={defaultSaleRate}
                        defaultSaleStartDate={defaultSaleStartDate}
                        defaultSaleEndDate={defaultSaleEndDate}
                    />
                </div>
                <Table className="mt-10 text-center" >
                    <TableHeader>
                        <TableRow>
                            <TableHead><input type="checkbox" onChange={handleSelectAll} /></TableHead>
                            <TableHead>Product Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Stock Qty</TableHead>
                            <TableHead>Sales Qty</TableHead>
                            <TableHead className='text-center'>Option</TableHead>
                            <TableHead >Sale</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(property => {
                            return (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(property.id)}
                                            onChange={() => toggleSelect(property.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {property.images && property.images.length > 0 ? (
                                            <Image
                                                src={storagePathToUrl(property.images[0])}
                                                alt="main image"
                                                width="90"
                                                height="90"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src="/fallback.jpg"
                                                alt="No image"
                                                width="90"
                                                height="90"
                                                className="object-cover"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{property.name}</TableCell>
                                    <TableCell>
                                        {property.onSale && property.salePrice
                                            ? (
                                                <>
                                                    <span className="line-through text-gray-400 mr-1">€ {numeral(property.price).format("0,0")}</span>
                                                    <span className="text-red-500 font-bold">€ {numeral(property.salePrice).format("0,0")}</span>
                                                </>
                                            )
                                            : (
                                                <>€ {numeral(property.price).format("0,0")}</>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {property.brand}
                                    </TableCell>
                                    <TableCell>
                                        {property.status}
                                    </TableCell>
                                    <TableCell>
                                        {property.stockQuantity}
                                    </TableCell>
                                    <TableCell>
                                        {property.soldQuantity ?? 0}
                                    </TableCell>
                                    <TableCell >
                                        <div className='inline-flex space-x-2'>
                                            <Button asChild variant="default" size="sm">
                                                <Link href={`/property/${property.id}`}>
                                                    <EyeIcon />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="default" size="sm" className="mx-1">
                                                <Link href={`/admin-dashboard/properties/${property.id}`}>
                                                    <PencilIcon />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        {property.onSale ? (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => {
                                                    setSelectedIds([property.id])
                                                    setDialogOpen(true)
                                                    setDefaultSalePrice(property.salePrice || 0)
                                                    setDefaultSaleRate(property.saleRate || 0)
                                                    setDefaultSaleStartDate(property.saleStartDate || '')
                                                    setDefaultSaleEndDate(property.saleEndDate || '')
                                                }}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Button>

                                        ) : (
                                            <span className='text-foreground'>-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={8} className='text-center'>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const pageNumber = i + 1
                                    return (
                                        <Button
                                            key={pageNumber}
                                            onClick={() => goToPage(pageNumber)}
                                            variant="outline"
                                            className='mx-1'
                                            disabled={currentPage === pageNumber} // 현재 페이지 버튼은 비활성화
                                        >
                                            {pageNumber}
                                        </Button>
                                    )
                                })}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table >
            </>
        )
        }
    </>
}