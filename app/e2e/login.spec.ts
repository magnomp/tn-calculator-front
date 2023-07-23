import { test } from "@playwright/test";
import { createUser } from "./fixtures/user";
import { LoginPage } from "./pages/login.page";
import { MyRecordsPage } from "./pages/my-records.page";

test("After sucessfull login should be redirected to my records page", async ({
  page,
}) => {
  const user = await createUser()
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.at();
  await loginPage.doLogin(user, "1234");

  const operationsPage = new MyRecordsPage(page);
  await operationsPage.at();
});
