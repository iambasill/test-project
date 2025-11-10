import dotenv from 'dotenv';
import { BadRequestError } from '../logger/exceptions';

dotenv.config({ path: '.env' });

export interface BaseConfig {
    APP_NAME?: string;
    NODE_ENV?: string;
    AUTH_JWT_TOKEN: string;
    AUTH_JWT_RESET_TOKEN: string;
    API_BASE_URL: string;
    CLIENT_URL: string;
    DB_PROVIDER: string;
    DATABASE_URL: string;
    OTP_SECRET: string;
    SENDGRID_API_KEY :string;
    MAIL_FROM :string;

    PORT: string;
    STORAGE_ENV?: string;
}

export const baseConfig: BaseConfig = {
    APP_NAME: process.env.APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_JWT_TOKEN: process.env.AUTH_JWT_TOKEN!,
    AUTH_JWT_RESET_TOKEN: process.env.AUTH_JWT_RESET_TOKEN!,
    API_BASE_URL: process.env.API_BASE_URL!,
    CLIENT_URL: process.env.CLIENT_URL!,
    DB_PROVIDER: process.env.DB_PROVIDER!,
    SENDGRID_API_KEY:  process.env.SENDGRID_API_KEY || "",
    DATABASE_URL: process.env.DATABASE_URL!,
    OTP_SECRET: process.env.OTP_SECRET!,
    MAIL_FROM: process.env.MAIL_FROM!,
    PORT: process.env.PORT || '8000',
    STORAGE_ENV: process.env.STORAGE_ENV || 'local',
};

const validateConfig = (cfg: BaseConfig) => {
    const requiredFields: (keyof BaseConfig)[] = [
        'AUTH_JWT_TOKEN',
        'AUTH_JWT_RESET_TOKEN',
        'API_BASE_URL',
        'CLIENT_URL',
        'DB_PROVIDER',
        'DATABASE_URL',
        'OTP_SECRET',
    ];

    requiredFields.forEach((key) => {
        if (!cfg[key]) {
            throw new BadRequestError(`Environment variable ${key} is not set`);
        }
    });
};

validateConfig(baseConfig);