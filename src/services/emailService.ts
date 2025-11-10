import sgMail from '@sendgrid/mail'
import { config } from '../config/baseConfig';


sgMail.setApiKey(config.SENDGRID_API_KEY)


export const registerVerificationEmailHtml = (verificationLink: string, userName?: string) => {
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

export const resetVerificationEmailHtml = (verificationLink:string, userName?:string) => {
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
            Please verify your email address to reset your password. 
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              verify your email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <small><a href="${verificationLink}">${verificationLink}</a></small>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't initiate this, please ignore this email.
          </p>
        </div>
      </body>
    </html>`;
};

export const sendVerificationEmail = async (to: string, verificationLink: string, userName?: string,type?:string) => {
  let html = ""
  if (type === "register" ) html = registerVerificationEmailHtml(verificationLink, userName) 
  if (type === "reset") html = resetVerificationEmailHtml(verificationLink,userName)
  
  const verificationMsg = {
    to,
    from: config.MAIL_FROM,
    subject: "Verify Your Email Address",
    text: `Welcome${userName ? ` ${userName}` : ''}! Please verify your email by visiting: ${verificationLink}`,
    html
  }
  
    await sgMail.send(verificationMsg)    

}