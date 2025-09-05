export const PROPERTY_STATUS = ['Available', 'Sold Out', 'Limited edition'] as const
export type PropertyStatus = typeof PROPERTY_STATUS[number]

// 들어오는 문자열을 안전하게 정규화
export function normalizePropertyStatus(
    v: string | null | undefined
): PropertyStatus | undefined {
    const s = v?.toLowerCase().trim()
    switch (s) {
        case 'available': return 'Available'
        case 'sold out':
        case 'soldout': return 'Sold Out'
        case 'limited edition':
        case 'limited': return 'Limited edition'
        default: return undefined
    }
}