<script setup lang="ts">
import { useApi } from "@/api";
import { useAuthTokenStore } from "@/stores/authToken";
import { ref } from "vue";
import { useRouter } from "vue-router";

const auth = useAuthTokenStore();

const router = useRouter();

const username = ref("");
const password = ref("");
const showAccountsSnack = ref(false);

const login = async () => {
  const api = useApi();
  const loginResult = await api.login(username.value, password.value);
  if (loginResult) {
    auth.setAuthToken(loginResult.accessToken);
    router.push({ name: "my-records" });
  }
};

const signUp = () => {
  showAccountsSnack.value = true;
  username.value = "demo1@tn.com";
  password.value = "1234";
};
</script>

<template>
  <v-snackbar v-model="showAccountsSnack" multi-line>
    There are five demo accounts available: demo[1..5]@tn.com / 1234

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="showAccountsSnack = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-sheet width="400" class="mx-auto">
      <v-form fast-fail @submit.prevent="login">
        <v-text-field
          id="username"
          v-model="username"
          label="User Name"
        ></v-text-field>

        <v-text-field
          id="password"
          v-model="password"
          label="password"
        ></v-text-field>
        <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>

        <v-btn
          id="login-button"
          type="submit"
          color="primary"
          block
          class="mt-2"
          >Sign in</v-btn
        >
      </v-form>
      <div class="mt-2">
        <p class="text-body-2">
          Don't have an account?
          <a href="#" @click="signUp">Sign Up</a>
        </p>
      </div>
    </v-sheet>
  </div>
</template>
