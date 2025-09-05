import { Badge } from "./ui/badge";
import { PropertyStatus } from "@/types/propertyStatus";
import { normalizePropertyStatus } from '@/types/propertyStatus'


const STATUS_LABEL = {
    'Available': 'Available',
    'Sold Out': 'Sold out',
    'Limited edition': 'Limited edition',
} satisfies Record<PropertyStatus, string>

const VARIANT = {
    'Available': 'primary',
    'Sold Out': 'success',
    'Limited edition': 'secondary',
} satisfies Record<PropertyStatus, 'primary' | 'success' | 'secondary' | 'default'>


export default function ProductStatusBadge({
    status,
    className,
}: {
    status: PropertyStatus | string | undefined;
    className?: string;
}) {
    const nomalizedstatus = normalizePropertyStatus(status)
    if (!nomalizedstatus) {
        return <Badge variant="secondary" className={className}>Unknown</Badge>
    }
    const label = STATUS_LABEL[nomalizedstatus]
    const badgeVariant = VARIANT[nomalizedstatus]

    return (
        <Badge
            variant={badgeVariant}
            className={className}
        >
            {label}
        </Badge>
    )
}