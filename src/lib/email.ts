import { createTransport, type SendMailOptions } from 'nodemailer';

import { env } from '@/config/env';

const transporter = createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_SECURE,
  auth: { user: env.MAIL_USER, pass: env.MAIL_PASSWORD },
});

export const sendEmail = async (
  options: Required<Pick<SendMailOptions, 'to' | 'subject' | 'html'>>
) =>
  await transporter.sendMail({
    from: `"Omer's test app" <${env.MAIL_USER}>`,
    ...options,
  });
