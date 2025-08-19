import sgMail from '@sendgrid/mail'
// import { SENDGRID_API_KEY } from '../../secrets'
import { BadRequestError } from '../httpClass/exceptions'

// if(!SENDGRID_API_KEY) throw new BadRequestError("Email token key is not provided")
const SENDGRID_API_KEY="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"

sgMail.setApiKey(SENDGRID_API_KEY)


export const createVerificationEmailHtml = (verificationLink: string, userName?: string) => {
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
            Thank you for registering with us. To complete your registration, please download the Application by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Download App
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <small><a href="${verificationLink}">${verificationLink}</a></small>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      </body>
    </html>`;
};

export const sendVerificationEmail = async (to: string, verificationLink: string, userName?: string) => {
  const html = createVerificationEmailHtml(verificationLink, userName)
  
  const verificationMsg = {
    to,
    from: "admin@404services.com", // Make sure this is verified
    subject: "Verify Your Email Address",
    text: `Welcome${userName ? ` ${userName}` : ''}! Please verify your email by visiting: ${verificationLink}`,
    html
  }
  
    await sgMail.send(verificationMsg)    

}