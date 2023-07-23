import test, { expect } from "@playwright/test";
import { listOperations, Operation } from "./fixtures/operations";
import { createRecords, Record } from "./fixtures/records";
import { createUser } from "./fixtures/user";
import { LoginPage } from "./pages/login.page";
import * as crypto from "crypto";
import { MyRecordsPage } from "./pages/my-records.page";

let userId: string;
let operations: Operation[];
const records: Record[] = [];

test.beforeAll(async () => {
  userId = await createUser();
  operations = await listOperations();
  for (let i = 0; i < 100; ++i) {
    // Note that for the sake of tests, amount/userBalance/operationResponse doen't have to make sense according to the same
    // logic that it would in production. I just produced calculed values that are unique and distinguishable
    records.push({
      recordId: crypto.randomUUID(),
      userId,
      operationId: operations[i % operations.length].operationId,
      amount: i,
      date: new Date(),
      isDeleted: false,
      operationResponse: `result ${i}`,
      userBalance: i * 10,
    });
  }
  await createRecords(records);
});

test("When loaded page, should show my records", async ({ page }) => {
  const loginPage = new LoginPage(page);
  loginPage.goto();
  loginPage.doLogin(userId, "1234");

  const myRecordsPage = new MyRecordsPage(page);
  await myRecordsPage.at();

  await expect(myRecordsPage.recordsItems).toHaveCount(10);
});

test("Should handle pagination", async ({ page }) => {
  const user = await createUser();
  const operations = await listOperations();

  await createRecords([
    {
      recordId: crypto.randomUUID(),
      userId: user,
      operationId: operations.find((o) => o.operationType == "addition")!
        .operationId,
      amount: 10,
      date: new Date(),
      isDeleted: false,
      operationResponse: "10",
      userBalance: 10,
    },
  ]);

  const loginPage = new LoginPage(page);
  loginPage.goto();
  loginPage.doLogin(user, "1234");

  const myRecordsPage = new MyRecordsPage(page);
  await myRecordsPage.at();

  console.log("a");
  await expect(myRecordsPage.recordsItems).toHaveCount(1);
  console.log("b");
});
