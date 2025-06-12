import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

export const clearOldCartItems = onSchedule("every 1 hours", async () => {
    const now = Timestamp.now();
    const expiredTime = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000); // 24시간 전

    const snapshot = await db.collectionGroup("cart")
        .where("createdAt", "<", expiredTime)
        .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        console.log(`Deleting cart item: ${doc.ref.path}`);
        batch.delete(doc.ref);
    });

    await batch.commit();
});