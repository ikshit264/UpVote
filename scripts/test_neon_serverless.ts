
import { neon } from '@neondatabase/serverless';

async function main() {
    const url = 'postgresql://neondb_owner:npg_NavutlLn59pj@98.89.62.209/neondb?sslmode=require&options=project%3Dep-ancient-feather-ah9l5b8r-pooler';
    const sql = neon(url);

    try {
        console.log('Attempting to connect via Neon Serverless (HTTP)...');
        const result = await sql`SELECT 1 as connected`;
        console.log('Connection successful!', result);
    } catch (error) {
        console.error('Connection failed via Neon Serverless:', error);
    }
}

main();
