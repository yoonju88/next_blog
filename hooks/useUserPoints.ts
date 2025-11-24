'use client'
import { useState, useEffect } from "react"

export function useUserPoints(userId?: string, refreshTrigger: number = 0) {
    const [points, setPoints] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [eventTrigger, setEventTrigger] = useState(0)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handlePointsUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<{ userId?: string }>
            const targetUserId = customEvent.detail?.userId

            if (!targetUserId || targetUserId === userId) {
                setEventTrigger(prev => prev + 1)
            }
        }

        window.addEventListener('userPointsUpdated', handlePointsUpdated as EventListener)
        return () => {
            window.removeEventListener('userPointsUpdated', handlePointsUpdated as EventListener)
        }
    }, [userId])

    useEffect(() => {
        if (!userId) {
            setPoints(0)
            setLoading(false)
            return
        }
        const fetchPoints = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/user/point?userId=${userId}`);
                const data = await res.json();
                setPoints(data.success && data.points !== undefined ? data.points : 0)
            } catch (err) {
                console.error("Error fetching user points:", err);
                setPoints(0);
            } finally {
                setLoading(false);
            }
        };
        fetchPoints()
    }, [userId, refreshTrigger, eventTrigger])
    return points
}