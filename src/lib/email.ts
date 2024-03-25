import { createTransport, type SendMailOptions } from 'nodemailer';

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE?.toLowerCase() === 'true',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
});

export const sendEmail = async (
  options: Required<Pick<SendMailOptions, 'to' | 'subject' | 'html'>>
) =>
  await transporter.sendMail({
    from: `"Omer's test app" <${process.env.MAIL_USER}>`,
    ...options,
  });
