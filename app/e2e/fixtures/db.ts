import * as pg from 'pg'

const pool = new pg.Pool({
    user: "postgres",
    password: "postgres",
    database: "tncalc",
    port: 5432,
    host: "localhost"
})

export async function useClient<T>(action: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect()
    try {
        return await action(client)
    }
    finally {
        client.release()
    }
}