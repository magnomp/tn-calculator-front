import { expect, Page } from "@playwright/test";

export class MyRecordsPage {
  public readonly recordsTable = this.page.locator("table");
  public readonly recordsItems = this.page.locator("table tbody tr");

  constructor(private readonly page: Page) {}

  async go() {
    await this.page.goto("/#/");
  }

  async at() {
    await expect(this.page).toHaveURL(/#\//);
    await expect(this.recordsTable).toBeVisible();
  }
}
