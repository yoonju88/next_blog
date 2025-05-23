import { Star } from "lucide-react";

export default function Rating({ rating }: { rating: number }) {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1 <= rating);
    return (
        <div className="flex space-x-1">
            {stars.map((isFilled, i) => (
                <Star
                    key={i}
                    className={`w-5 h-5 ${isFilled ? "fill-amber-400 stroke-amber-400" : "stroke-gray-400"}`}
                />
            ))}
        </div>
    )
}