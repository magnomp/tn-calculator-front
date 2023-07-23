import { useClient } from "./db";

export type Record = {
  recordId: string;
  userId: string;
  operationId: string;
  amount: number;
  userBalance: number;
  operationResponse: string;
  date: Date;
  isDeleted: boolean;
};

export function createRecords(records: Record[]) {
  useClient(async (client) => {
    for (const r of records) {
      client.query(
        `insert into "record"("recordId", "userId", "operationId", "amount", "userBalance", "operationResponse", "date", "isDeleted") values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          r.recordId,
          r.userId,
          r.operationId,
          r.amount,
          r.userBalance,
          r.operationResponse,
          r.date,
          r.isDeleted,
        ]
      );
    }
  });
}
