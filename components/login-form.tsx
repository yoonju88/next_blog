"use client"
import { z } from "zod"
import { userLoginSchema } from "@/validation/userLoginSchema"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import LoginByGoogle from '@/components/Login-by-google'
import Link from "next/link"
import { useAuth } from "@/context/auth"
import { toast } from "sonner"
import { FirebaseError } from "firebase/app";


export default function LoginForm({
    onSuccessAction
}: {
    onSuccessAction?: () => void
}) {
    const auth = useAuth()

    const form = useForm<z.infer<typeof userLoginSchema>>({
        resolver: zodResolver(userLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const handleSubmit = async (data: z.infer<typeof userLoginSchema>) => {
        try {
            await auth?.loginWithEmail(data.email, data.password)
            onSuccessAction?.();
        } catch (e: unknown) {
            let errorMessage = "An error occurred";
            //To display type of error 
            if (e instanceof FirebaseError) {
                // Firebase 에러는 code가 붙는 경우가 있어
                errorMessage = e.code === "auth/invalid-credential"
                    ? "Incorrect credential"
                    : errorMessage;
            }
            toast.error("Error", {
                description: errorMessage,
            });
        }
    }
    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(handleSubmit)}

            >
                <fieldset
                    disabled={form.formState.isSubmitting}
                    className="flex flex-col gap-8"
                >
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="mt-4 text-white"
                    >
                        Login
                    </Button>
                </fieldset>
            </form>
            <div className="mt-6 space-y-6 pt-6 border-t-1 border-muted-foreground/30">
                <LoginByGoogle />
                <div className="text-center">
                    Forgotton your password ?
                    <Link href="/forgot-password" className="pl-2 font-semibold hover:text-primary">
                        Reset it here.
                    </Link>
                </div>
            </div>
        </Form>
    )
}
