'use client'
import { useState, useEffect } from "react"


export function useUserPoints(userId?: string, refreshTrigger: number = 0) {
    const [points, setPoints] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

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
    }, [userId, refreshTrigger])
    return points
}