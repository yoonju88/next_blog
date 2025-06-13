import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

export const clearOldCartItems = onSchedule("every 1 hours", async () => {
    const now = Timestamp.now();
    const expiredTime = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000); // 24시간 전

    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.cart && Array.isArray(userData.cart)) {
            const updatedCart = userData.cart.filter((item: any) => {
                const createdAt = new Date(item.createdAt).getTime();
                return createdAt > expiredTime.toMillis();
            });

            if (updatedCart.length !== userData.cart.length) {
                await userDoc.ref.update({ cart: updatedCart });
                console.log(`Updated cart for user ${userDoc.id}: removed ${userData.cart.length - updatedCart.length} expired items`);
            }
        }
    }
});