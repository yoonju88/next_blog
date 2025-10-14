import React from 'react'

interface userPointProps {
    userPoints: number;
    usedPoints: number;
    setUsedPoints: (point: number) => void;
}

export default function PointInput({
    userPoints,
    usedPoints,
    setUsedPoints
}: userPointProps
) {
    return (
        <div className=" pt-4">
            <p className="font-medium">Your Points: {userPoints.toLocaleString()}</p>
            <input
                type="number"
                min={0}
                max={userPoints}
                value={usedPoints}
                onChange={(e) => setUsedPoints(Number(e.target.value))}
                className="border rounded-md p-2 w-32 mt-2"
            />
        </div>
    )
}
