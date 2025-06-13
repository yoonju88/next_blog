import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyListProps {
    title: string
    description: string
    buttonText: string
    buttonHref: string
    icon?: React.ReactNode
}

export default function EmptyList({
    title,
    description,
    buttonText,
    buttonHref,
    icon = <Heart className="w-12 h-12 text-muted-foreground" />
}: EmptyListProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                {icon}
            </div>
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">{title}</h2>
            <p className="text-muted-foreground mb-8">{description}</p>
            <Button asChild>
                <Link href={buttonHref}>
                    {buttonText}
                </Link>
            </Button>
        </div>
    )
} 