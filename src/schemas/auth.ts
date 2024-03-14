import { z } from 'zod';

const email = z.string().email({ message: 'Invalid email address.' }),
  password = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' });

export const loginFormSchema = z.object({ email, password });
export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z
  .object({ email, password, confirmPassword: password })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });
export type SignupFormValues = z.infer<typeof signupFormSchema>;

export const verifyFormSchema = z.object({
  code: z
    .string()
    .length(8, {
      message: 'Verification code should include exactly 8 digits.',
    })
    .regex(/^\d+$/, {
      message: 'Verification code should only include digits.',
    }),
});
export type VerifyFormValues = z.infer<typeof verifyFormSchema>;
