import dotenv from "dotenv";

dotenv.config();

export function checkRequiredEnvVariables(requiredVariables: string[]) {
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);
    if (missingVariables.length > 0) {
        throw new Error(`Some required environment variables are missing: ${missingVariables.join(', ')}`);
    }
}

export const getEnvVar = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Tried to get environment variable ${key} but it was not found.`);
    }
    return value;
}