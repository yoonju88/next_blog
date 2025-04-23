import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useTheme } from "next-themes"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import { cn } from "@/lib/utils"

export function DarkModeSwatch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <SwitchPrimitive.Root
            onClick={toggleTheme}
            className={cn(
                "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.2rem] w-9 items-center rounded-full border border-muted-foreground/30 shadow-xs transition-all",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    "bg-background flex items-center justify-center pointer-events-none  border-1  border-muted-foreground/34 size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
                )}
            >
                {resolvedTheme === "dark" ? (
                    <MdDarkMode className="text-yellow-300 text-xs" />
                ) : (
                    <MdLightMode className="text-orange-500 text-xs" />
                )}
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}