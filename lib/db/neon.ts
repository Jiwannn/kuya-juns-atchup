// lib/db/neon.ts
import { neon } from '@neondatabase/serverless';

const sqlExecutor = neon(process.env.POSTGRES_URL!);

export async function query(queryText: string, params?: any[]) {
  try {
    const rows = params 
      ? await sqlExecutor(queryText, params)
      : await sqlExecutor(queryText);
    
    return { rows: rows || [] };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function sql(strings: any, ...values: any[]) {
  try {
    if (typeof strings === 'object' && 'raw' in strings) {
      const result = await sqlExecutor(strings, ...values);
      return result || [];
    }
    const result = await sqlExecutor(strings, values);
    return result || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}