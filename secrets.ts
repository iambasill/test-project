
import dotenv from 'dotenv'
dotenv.config({path:'.env'})



export const AUTH_JWT_TOKEN = process.env.AUTH_JWT_TOKEN
export const AUTH_RESET_TOKEN = process.env.AUTH_RESET_TOKEN
export const APP_URL = process.env.APP_URL