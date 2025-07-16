import { Pool } from "pg"

export interface Project {
  id: string
  name: string
  description: string
  agent_json: any
  vercel_url: string
  created_at: string
}

export const logProjectToPostgres = async (projectData: Omit<Project, 'created_at'>) => {
  try {
    const pool  = new Pool({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: 5432,
            ssl: {
                rejectUnauthorized: false,
            }
        })

        const cols = Object.keys(projectData);
        const values = Object.values(projectData);
        const placeholders = cols.map((_, i) => `$${i + 1}`)
        const sqlInsert =  `
            INSERT INTO projects
            (${cols.join(", ")})
            values (${placeholders})
            RETURNING *;
        `;

        const result = await pool.query(
            sqlInsert,
            values
        );

        return result.rows[0];
  } catch (error) {
    console.error('Error logging to Supabase:', error)
    throw error
  }
} 