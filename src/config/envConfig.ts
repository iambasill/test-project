
import dotenv from 'dotenv'
import { BadRequestError } from '../httpClass/exceptions'
dotenv.config({path:'.env'})

interface Config {
    AUTH_JWT_TOKEN: string
    AUTH_RESET_TOKEN : string
    API_BASE_URL : string
    CLIENT_URL :string
    SENDGRID_API_KEY : string
    MAIL_FROM : string
    DB_PROVIDER: string
    DATABASE_URL: string
}


export const config : Config ={
    AUTH_JWT_TOKEN: process.env.AUTH_JWT_TOKEN!,
    AUTH_RESET_TOKEN : process.env.AUTH_RESET_TOKEN!,
    API_BASE_URL : process.env.API_BASE_URL!,
    CLIENT_URL : process.env.CLIENT_URL!,
    SENDGRID_API_KEY :process.env.SENDGRID_API_KEY!,
    MAIL_FROM : process.env.MAIL_FROM!,
    DB_PROVIDER : process.env.DB_PROVIDER!,
    DATABASE_URL : process.env.DATABASE_URL!

}

Object.keys(config).forEach((key) => {
    if (!config[key as keyof Config]){
        throw new BadRequestError(`Environment variable ${key} is not set`)
    }
})

