'use client'
import { Order } from '@/types/order'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import Link from 'next/link';
import EmptyList from '@/components/EmptyList';

interface OrderListProps {
    orders: Order[]
}
export default function OrderList({ orders }: OrderListProps) {

    if (!orders || orders.length === 0) {
        return (
            <EmptyList
                title="No Orders Yet"
                description="You haven't placed any orders. Start exploring our products and add them to your cart!"
                buttonHref='/'
                buttonText="Return to Home"
            />
        );
    }
    console.log(orders[0].items)
    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6">
            <div className="space-y-10">
                {/* 1. orders 배열을 map으로 순회하여 각 주문 섹션을 만듭니다. */}
                {orders.map((order) => {
                    // 각 주문별 총 상품 수량을 계산합니다.
                    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

                            {/* 2. 테이블 위쪽에 주문 번호와 날짜를 표시합니다. */}
                            <div className="mb-4 text-right py-2">
                                <h2 className="text-lg font-semibold text-foreground">Order Number: {order.id}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Payment satatus : <span className='text-green-500 '>{order.status}</span>
                                </p>
                            </div>

                            {/* 3. 테이블에는 해당 주문의 상품 목록(items)만 나열합니다. */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead> </TableHead>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Link href={`/property/${item.productId}`}>
                                                    {item.imageUrl ? (
                                                        <div className="relative w-16 h-16">
                                                            <Image
                                                                src={item.imageUrl.startsWith('http') ? item.imageUrl : imageUrlFormatter(item.imageUrl)}
                                                                alt={item.productName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-100 rounded" />
                                                    )}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link href={`/property/${item.productId}`}>
                                                    {item.productName}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{item.price.toFixed(2)} €</TableCell>
                                            <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)} €</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* 4. 테이블 아래쪽에 총 수량과 총 금액을 표시합니다. */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        Total Items: <span className="font-semibold">{totalQuantity}</span>
                                    </p>
                                    <p className="text-lg font-bold text-gray-800 mt-1">
                                        Order Total: <span className="text-primary">{order.totalAmount.toFixed(2)} €</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    )
}

