import { PropertyStatus } from "@/types/propertyStatus";
import { Badge } from "./ui/badge";

const statusLabel: Record<PropertyStatus, string> = {
    "Available": "Available",
    "Sold Out": "Sold out",
    "Limited edition": "Limited edition",
}

const variant: Record<PropertyStatus, "primary" | "success" | "secondary" | "default"> = {
    "Available": 'primary',
    "Sold Out": "success",
    "Limited edition": "secondary",
}

export default function ProductStatusBadge({
    status,
    className,
}: {
    status: PropertyStatus | undefined
    className?: string
}) {
    if (!status) {
        return <Badge variant="secondary" className={className}>Unknown</Badge>
    }
    const label = statusLabel[status]
    const badgeVariant = variant[status]

    return (
        <Badge
            variant={badgeVariant}
            className={className}
        >
            {label}
        </Badge>
    )
}