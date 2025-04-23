import { z } from "zod"
import { passwordValidation } from "./registerUser"

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: passwordValidation,
})