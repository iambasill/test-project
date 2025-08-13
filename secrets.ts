
import dotenv from 'dotenv'
dotenv.config({path:'.env'})



export const AUTH_JWT_TOKEN = process.env.AUTH_JWT_TOKEN
export const AUTH_RESET_TOKEN = process.env.AUTH_RESET_TOKEN
export const API_BASE_URL = process.env.API_BASE_URL
export const CLIENT_URL = process.env.CLIENT_URL
export const SMTP_PORT=process.env.SMTP_PORT
export const SMTP_USER=process.env.SMTP_USER
export const SMTP_PASS=process.env.SMTP_PASS
export const SMTP_HOST=process.env.SMTP_HOST

