import { z } from 'zod';

const email = z
  .string()
  .min(1, { message: 'Email is required.' })
  .email({ message: 'Invalid email address.' });

export const signInFormSchema = z.object({
  email,
  password: z.string().min(1, { message: 'Password is required.' }),
});
export type SignInFormValues = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  email,
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const verifyFormSchema = z.object({
  code: z
    .string()
    .length(6, {
      message: 'Verification code should include exactly 6 digits.',
    })
    .regex(/^\d+$/, {
      message: 'Verification code should only include digits.',
    }),
});
export type VerifyFormValues = z.infer<typeof verifyFormSchema>;
