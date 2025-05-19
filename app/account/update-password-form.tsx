"use client"
import { useAuth } from "@/context/auth";
import { z } from "zod"
import { passwordValidation } from "@/validation/registerUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    newPasswordConfirm: z.string(),
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirm) {
        ctx.addIssue({
            message: "Password do not match",
            path: ["newPasswordConfirm"],
            code: "custom",
        })
    }
})

export default function UpdatePasswordForm() {
    const auth = useAuth();
    const form = useForm<z.infer<typeof formSchema>>({
        //resolver는 react-hook-form이 Zod 같은 외부 유효성 검사 도구랑 연동되게 해주는 옵션이고, zodResolver는 그 연결을 실현하는 함수
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const user = auth?.currentUser;
        if (!user?.email) { return }

        try {
            await reauthenticateWithCredential(
                user,
                EmailAuthProvider.credential(user.email, data.currentPassword)
            )
            await updatePassword(user, data.newPassword)
            toast.success("", {
                description: "Password updated successfully"
            })
            form.reset()
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/invalid-credential") {
                    toast.error('', { description: "Your current password is incorrect" });
                } else {
                    toast.error('', { description: "An error occurred" });
                }
            } else {
                toast.error('', { description: "An unexpected error occurred" });
            }
        }
    }

    return (
        <div className="pt-5 mt-5 border-t">
            <h2 className="text-2xl font-bold pb-4">
                Update password
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <fieldset
                        className="flex flex-col gap-4"
                        disabled={form.formState.isSubmitting}
                    >
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Current Password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="New Password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPasswordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Confirm New Password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Update Password</Button>
                    </fieldset>
                </form>
            </Form>
        </div>
    )
}