import { getOrders } from './action';
import { redirect } from 'next/navigation';
import OrderList from '@/components/account/OrderList';

export default async function odersPage() {
    const orderData = await getOrders()
    if (!orderData.success || !orderData.orders) {
        redirect('/login');
    }
    const orders = orderData.orders
    return (
        <div className='w-[90%] mt-20'>
            <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
            <OrderList orders={orders} />
        </div>

    )
}
