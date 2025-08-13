import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from './../../secrets';
import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

// Create transporter instance
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false, 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }: EmailConfig): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
export const createVerificationEmailHtml = (verificationLink: string, userName?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome${userName ? ` ${userName}` : ''}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationLink}">${verificationLink}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
