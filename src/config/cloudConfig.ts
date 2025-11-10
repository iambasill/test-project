import { BadRequestError } from '../logger/exceptions';

export interface CloudConfig {
    CLOUD_REGION: string;
    CLOUD_ACCESS_KEY_ID: string;
    CLOUD_SECRET_ACCESS_KEY: string;
    CLOUD_BUCKET_NAME: string;
}

export const cloudConfig: CloudConfig = {
    CLOUD_REGION: process.env.CLOUD_REGION!,
    CLOUD_ACCESS_KEY_ID: process.env.CLOUD_ACCESS_KEY!,
    CLOUD_SECRET_ACCESS_KEY: process.env.CLOUD_SECRET_KEY!,
    CLOUD_BUCKET_NAME: process.env.CLOUD_BUCKET_NAME!,
};

export const validateCloudConfig = () => {
    Object.keys(cloudConfig).forEach((key) => {
        if (!cloudConfig[key as keyof CloudConfig]) {
            throw new BadRequestError(`Cloud environment variable ${key} is not set`);
        }
    });
};