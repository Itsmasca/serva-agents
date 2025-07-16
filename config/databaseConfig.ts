import { Pool } from "pg";

export default class DatabaseConfig {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async createTables(): Promise<void> {
        try {

            const projectsTable = `
                CREATE TABLE projects (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    agent_json JSONB NOT NULL,
                    vercel_url TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
            const tableQueries = [projectsTable];

            for (const query of tableQueries) {
                await this.pool.query(query);
            }

            console.log("✅ All tables created or already exist.");
        } catch (error) {
            console.error("❌ Error creating tables:", error);
            throw error;
        }
    }

    // Validate identifiers to avoid SQL injection
    private validateIdentifier(name: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            throw new Error(`Invalid identifier: ${name}`);
        }
    }

    async addCol(table: string, col: string, dataType: string): Promise<void> {
        this.validateIdentifier(table);
        this.validateIdentifier(col);
        try {
            const sql = `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${col} ${dataType};`;
            await this.pool.query(sql);
            console.log(`✅ Column '${col}' added to '${table}'.`);
        } catch (error) {
            console.error(`❌ Failed to add column '${col}' to '${table}':`, error);
            throw error;
        }
    }

    async removeCol(table: string, col: string): Promise<void> {
        this.validateIdentifier(table);
        this.validateIdentifier(col);
        try {
            const sql = `ALTER TABLE ${table} DROP COLUMN IF EXISTS ${col};`;
            await this.pool.query(sql);
            console.log(`✅ Column '${col}' removed from '${table}'.`);
        } catch (error) {
            console.error(`❌ Failed to remove column '${col}' from '${table}':`, error);
            throw error;
        }
    }

    async editCol(table: string, col: string, newType: string, newDefault?: string): Promise<void> {
        this.validateIdentifier(table);
        this.validateIdentifier(col);
        try {
            const typeSql = `ALTER TABLE ${table} ALTER COLUMN ${col} TYPE ${newType};`;
            await this.pool.query(typeSql);
            console.log(`✅ Column '${col}' in '${table}' type changed to '${newType}'.`);

            if (newDefault !== undefined) {
                const defaultSql = `ALTER TABLE ${table} ALTER COLUMN ${col} SET DEFAULT ${newDefault};`;
                await this.pool.query(defaultSql);
                console.log(`✅ Column '${col}' in '${table}' default set to '${newDefault}'.`);
            }
        } catch (error) {
            console.error(`❌ Failed to edit column '${col}' in '${table}':`, error);
            throw error;
        }
    }

    async direct(sql: string): Promise<any> {
        try {
            const result = await this.pool.query(sql);
            console.log("✅ Query executed.");
            return result
        } catch (error) {
            console.error("❌ Query execution failed:", error);
            throw error;
        }
    }
}
