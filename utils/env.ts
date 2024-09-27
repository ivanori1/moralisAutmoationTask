import {config} from 'dotenv'

config()

export const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if(!value) {
        throw new Error(`Environmental variable ${key} is not defined`)
    }
    return value
}