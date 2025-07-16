import dotenv from 'dotenv';
dotenv.config();
import DatabaseConfig from './databaseConfig';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

const config = new DatabaseConfig(pool);

async function execute() {
    try {
    
        await config.createTables()
    
    } catch (error) {
        console.log(error);

    } finally {
        await pool.end();
    }
}
execute();




