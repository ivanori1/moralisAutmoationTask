import {config} from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import {resolve} from 'path'

config()

export const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if(!value) {
        throw new Error(`Environmental variable ${key} is not defined`)
    }
    return value
}

export const setEnvVar = (key: string, value: string): void => {
    const envPath = resolve(__dirname, '../.env')
    const existingEnvFile = readFileSync(envPath, 'utf-8')
    const keyExist = existingEnvFile.split('\n').some((line) => line.startsWith(`${key}=`) && line.split('=')[1].trim())
    if (keyExist) {
        console.log(`${key} is already set`)
        return
    }
    const evnFile = `${key}=${value}\n`
    writeFileSync(envPath, evnFile, {flag:'a'})
    console.log(`${key} is written to .env file`)
}