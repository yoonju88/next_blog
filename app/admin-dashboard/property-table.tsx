import { Button } from '@/components/ui/button';
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell, TableFooter } from '@/components/ui/table'
import { getProperties } from '@/data/product'
import { EyeIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import numeral from "numeral";//npm install numeral , npm install @types/numeral
import Image from 'next/image';
import imageUrlFormatter from '@/lib/imageUrlFormatter';


export default async function PropertyTable({
    page = 1
}: {
    page?: number;
}) {
    const { data, totalPages } = await getProperties({
        pagination: {
            page,
            pageSize: 6,
        }
    });
    return <>
        {!data && (
            <h1 className='text-center text-zinc-400 py-20 font-bold text-3xl'>
                You have no properties
            </h1>
        )}
        {!!data && (
            <Table className="mt-10 text-center" >
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Stock Qty</TableHead>
                        <TableHead className='text-center'>Option</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(property => {
                        return (
                            <TableRow key={property.id}>
                                <TableCell>
                                    {property.images && property.images.length > 0 ? (
                                        <Image
                                            src={imageUrlFormatter(property.images[0])}
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
                                <TableCell>€ {numeral(property.price).format("0,0")}</TableCell>
                                <TableCell>
                                    {property.brand}
                                </TableCell>
                                <TableCell>
                                    {property.status}
                                </TableCell>
                                <TableCell>
                                    {property.stockQuantity}
                                </TableCell>
                                <TableCell >
                                    <div className='inline-flex space-x-2'>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/property/${property.id}`}>
                                                <EyeIcon />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm" className="mx-1">
                                            <Link href={`/admin-dashboard/edit-property/${property.id}`}>
                                                <PencilIcon />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7} className='text-center'>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    asChild={page !== i + 1} // 현재 페이지가 아닐 때만 asChild 적용
                                    variant="outline"
                                    className='mx-1'
                                    disabled={page === i + 1} // 현재 페이지 버튼은 비활성화
                                >
                                    <Link href={`/admin-dashboard?page=${i + 1}`}>{i + 1}</Link>
                                </Button>
                            ))}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table >
        )
        }
    </>
}