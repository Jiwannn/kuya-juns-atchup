import { neon } from '@neondatabase/serverless';

// Create the SQL executor
const sqlExecutor = neon(process.env.POSTGRES_URL!);


export async function sql(strings: any, ...values: any[]) {
  try {
    // Execute the query with the template literal
    const result = await sqlExecutor(strings, ...values);
    return result || [];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}


export default sql;