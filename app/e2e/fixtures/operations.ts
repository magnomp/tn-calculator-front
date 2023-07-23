import { useClient } from "./db";

export type Operation = {
  operationId: string;
  operationType: string;
  cost: number;
};

export async function listOperations() {
  return await useClient(async (client) => {
    const qr = await client.query(
      `select "operationId", "operationId", "operationType", "cost" from "operation"`
    );
    return qr.rows as Operation[];
  });
}
