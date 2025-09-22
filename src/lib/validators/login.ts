import { z } from 'zod'

export const CreateLoginValidator = ({
  usernameError,
  passwordError,
}: {
  usernameError: string
  passwordError: string
}) => {
  return z.object({
    username: z.string().min(3, usernameError),
    password: z.string().min(4, passwordError),
  })
}

export type loginRequest = z.infer<ReturnType<typeof CreateLoginValidator>>
