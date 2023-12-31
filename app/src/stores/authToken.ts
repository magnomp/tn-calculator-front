import { defineStore } from "pinia";
import { client } from "@/axios";
import jwt_decode from "jwt-decode";

let refreshPromise: Promise<string | undefined> | undefined;

export const useAuthTokenStore = defineStore("authTokenStore", {
  state: () => ({
    authToken: undefined as string | undefined,
    expiresAt: 0,
    username: "",
  }),

  getters: {
    isAuthenticated(): boolean {
      return this.authToken != undefined;
    },
  },

  actions: {
    setAuthToken(token: string | undefined) {
      this.authToken = token;
      if (token) {
        const decoded = jwt_decode<{ exp: number; email: string }>(token);
        this.expiresAt = decoded.exp;
        this.username = decoded.email;
      }
    },
    async logout() {
      await client.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      });
      this.setAuthToken(undefined);
    },
    async refresh(): Promise<string | undefined> {
      const result = await client.post("/auth/refresh");
      console.log("refresh result: ", result);
      if (result.status == 200) {
        console.log("Token renewed");
        this.setAuthToken(result.data["accessToken"]);
        return result.data["accessToken"];
      } else {
        console.log("Couldn`t renew token");
      }
    },

    async getAuthToken(): Promise<string | undefined> {
      console.log("Requesting access token");
      if (!this.authToken) return undefined;

      const now = Math.floor(new Date().getTime() / 1000);
      console.log("now: ", now, " expires: ", this.expiresAt);
      if (now < this.expiresAt - 5) {
        console.log("Não expirou");
        return this.authToken!;
      }

      console.log("Expirou, requisitando novo");
      if (!refreshPromise) {
        console.log("Iniciando refresh");
        refreshPromise = this.refresh();
        refreshPromise.finally(() => {
          console.log("Refresh retornou");
          refreshPromise = undefined;
        });
      }

      return refreshPromise;
    },
  },
});
