<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../api";
import { useAuthTokenStore } from "../stores/authToken";

const authTokenStore = useAuthTokenStore();
const router = useRouter();

const onLogout = async () => {
  await authTokenStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            :title="authTokenStore.username"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="My records"
            value="my-records"
            :to="{ name: 'my-records' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-calculator"
            title="New operation"
            value="new-operation"
            :to="{ name: 'new-operation' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            value="logout"
            @click="onLogout"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main><slot /></v-main>
    </v-layout>
  </v-card>
</template>
