import { neon } from '@neondatabase/serverless';

// Create SQL executor
const sqlExecutor = neon(process.env.POSTGRES_URL!);

// For tagged template literals - this is the default export
export default async function sql(strings: any, ...values: any[]) {
  try {
    // Execute the tagged template query
    const result = await sqlExecutor(strings, ...values);
    return result || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Named export for backward compatibility
export { sql as sqlTag };