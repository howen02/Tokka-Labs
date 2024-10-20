import dotenv from 'dotenv';

dotenv.config();

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
