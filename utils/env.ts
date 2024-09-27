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
    const envPath = resolve(__dirname, '../.env');
    const envFileContent = readFileSync(envPath, 'utf-8');
  
    // Update existing key or append a new key-value pair
    const newEnvFileContent = envFileContent
      .split('\n')
      .map(line => {
        if (line.startsWith(`${key}=`)) {
          return `${key}=${value}`;
        }
        return line;
      })
      .join('\n');
  
    if (!envFileContent.includes(`${key}=`)) {
      // If key doesn't exist, append it
      writeFileSync(envPath, `${envFileContent.trim()}\n${key}=${value}\n`);
      console.log(`${key} added to .env file.`);
    } else {
      // Overwrite the existing key
      writeFileSync(envPath, newEnvFileContent);
      console.log(`${key} updated in .env file.`);
    }
  };