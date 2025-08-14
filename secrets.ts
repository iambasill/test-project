
import dotenv from 'dotenv'
dotenv.config({path:'.env'})



export const AUTH_JWT_TOKEN = process.env.AUTH_JWT_TOKEN
export const AUTH_RESET_TOKEN = process.env.AUTH_RESET_TOKEN
export const API_BASE_URL = process.env.API_BASE_URL
export const CLIENT_URL = process.env.CLIENT_URL
export const SENDGRID_API_KEY =process.env.SENDGRID_API_KEY
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS

