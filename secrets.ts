
import dotenv from 'dotenv'
dotenv.config({path:'.env'})



export const AUTH_JWT_TOKEN = process.env.AUTH_JWT_TOKEN
export const AUTH_RESET_TOKEN = process.env.AUTH_RESET_TOKEN
export const API_BASE_URL = process.env.API_BASE_URL