import dotenv from 'dotenv';

dotenv.config(); 

interface EnvConfig {
  PORT: number; 
  DB_URL: string;
  ACCESSTOKEN_SECRET: string;
  REFRESHTOKEN_SECRET: string;
  PASSWORD_SALT_ROUNDS: number;
  NODE_ENV: string;
  FILE_SERVER_URL : string;
}

export const config:EnvConfig = {
    PORT: Number(process.env.PORT),
    DB_URL: process.env.DATABASE_URL as string,
    ACCESSTOKEN_SECRET: process.env.ACCESSTOKEN_SECRET as string,
    REFRESHTOKEN_SECRET: process.env.REFRESHTOKEN_SECRET as string,
    PASSWORD_SALT_ROUNDS: Number(process.env.PASSWORD_SALT_ROUNDS),
    NODE_ENV: process.env.NODE_ENV || 'development',
    FILE_SERVER_URL : process.env.FILE_SERVER_URL as string
};