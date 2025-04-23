"use server"
import { auth } from '@/firebase/server';
import { registerUserSchema } from '@/validation/registerUser';

export const registerUser = async (data: {
    email?: string
    name?: string
    password?: string
    passwordConfirm?: string
}) => {
    const validation = registerUserSchema.safeParse(data)
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred"
        }
    }

    try {
        await auth.createUser({
            displayName: data.name,
            email: data.email,
            password: data.password
        })
    } catch (e: unknown) {
        let message = "Could not register user";
        if (e instanceof Error) {
            message = e.message;
        }
        return {
            error: true,
            message,
            //에러 타입으로 메세지 보여줌 이미 등록된 유저인지 아닌지
        }
    }
}