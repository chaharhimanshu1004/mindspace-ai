import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
});

export { pool };
export default pool;

pool.query("SELECT 1")
    .then(() => {
        console.log("Successfully connected to Database");
    })
    .catch((e: unknown) => {
        console.error("Failed to connect to Database:", e);
        process.exit(1);
    });
