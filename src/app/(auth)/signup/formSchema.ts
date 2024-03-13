import { z } from 'zod';

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 2 characters long.' })
      .max(50, { message: "Username can't be longer than 50 characters." }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;
