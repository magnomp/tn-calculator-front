import * as crypto from 'crypto'
import { useClient } from './db'

export async function createUser(): Promise<string> {
    const id = crypto.randomUUID()
    await useClient(async (client) => {
        await client.query(`insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ($1, $2, 'active', 500, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`, [id, id])
    })
    
    return id
}