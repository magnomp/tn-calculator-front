import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("#username");
    this.loginButton = page.locator("#login-button");
    this.password = page.locator("#password");
  }

  async at() {
    return expect(this.page.url()).toMatch(/#\/login$/);
  }

  async goto() {
    await this.page.goto("/#/login");
  }

  async doLogin(username: string, password: string) {
    await this.username.type(username);
    await this.password.type(password);
    await this.loginButton.click();
  }
}
