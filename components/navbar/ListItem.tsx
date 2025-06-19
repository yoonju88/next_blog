import {
    NavigationMenuLink
} from "@/components/ui/navigation-menu"
import Link from "next/link"


// ListItem 컴포넌트
export default function ListItem({ href, title, children }: { href: string; title: string; children: string }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}