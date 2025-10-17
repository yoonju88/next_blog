import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeftIcon } from "lucide-react"


interface EmptyListProps {
    title: string
    description: string
    buttonText: string
    buttonHref: string
    //icon?: React.ReactNode
}

export default function EmptyList({
    title,
    description,
    buttonText,
    buttonHref,
    //icon = <Heart className="w-12 h-12 text-muted-foreground" />
}: EmptyListProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">{title}</h2>
            <p className="text-muted-foreground mb-8">{description}</p>
            <Button variant='default' size='lg'>
                <Link href={buttonHref} className='flex gap-3 items-center'>
                    <ArrowLeftIcon />{buttonText}
                </Link>
            </Button>
        </div>
    )
} 