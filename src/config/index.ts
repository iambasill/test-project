import { baseConfig, BaseConfig } from './baseConfig';
import { cloudConfig, CloudConfig, validateCloudConfig } from "../config/cloudConfig";


export interface AppConfig extends BaseConfig {
    cloud?: CloudConfig;

}

const buildConfig = (): AppConfig => {
    const cfg: AppConfig = { ...baseConfig };

    // Conditionally add cloud config
    if (baseConfig.STORAGE_ENV === 'cloud') {
        validateCloudConfig();
        cfg.cloud = cloudConfig;
    }




    return cfg;
};

export const config = buildConfig();

// Export individual configs for direct access if needed
export { cloudConfig } from '../config/cloudConfig';
