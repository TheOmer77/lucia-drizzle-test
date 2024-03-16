import { createTransport, type SendMailOptions } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD },
});

export const sendEmail = async (
  options: Required<Pick<SendMailOptions, 'to' | 'subject' | 'html'>>
) =>
  await transporter.sendMail({
    from: `"Omer's test app" <${process.env.GMAIL_USER}>`,
    ...options,
  });
