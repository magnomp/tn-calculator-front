<script setup lang="ts">
import LoggedLayout from "../layouts/LoggedLayout.vue";
import {
  OperationType,
  useApi,
  NotEnoughBalanceException,
  BadRequestException,
} from "../api";
import { computed, ref } from "vue";

const api = useApi();

const operation = ref(OperationType.addition);
const firstValue = ref(0);
const secondValue = ref(0);

const snackText = ref<string | undefined>("");
const showSnack = ref(false);

const firstLabel = computed(() => {
  switch (operation.value) {
    case OperationType.addition:
      return "A";
    case OperationType.division:
      return "Dividend";
    case OperationType.multiplication:
      return "A";
    case OperationType.random_string:
      return "";
    case OperationType.square_root:
      return "Radicand";
    case OperationType.subtraction:
      return "A";
    default:
      return "";
  }
});

const secondLabel = computed(() => {
  switch (operation.value) {
    case OperationType.addition:
      return "B";
    case OperationType.division:
      return "Divisor";
    case OperationType.multiplication:
      return "B";
    case OperationType.random_string:
      return "";
    case OperationType.square_root:
      return "";
    case OperationType.subtraction:
      return "B";
    default:
      return "";
  }
});

const firstVisible = computed(() => {
  return operation.value != OperationType.random_string;
});

const secondVisible = computed(() => {
  return (
    operation.value != OperationType.square_root &&
    operation.value != OperationType.random_string
  );
});

const perform = async () => {
  if (operation.value == OperationType.addition) {
    return await api.addition({
      a: parseFloat(firstValue.value),
      b: parseFloat(secondValue.value),
    });
  } else if (operation.value == OperationType.subtraction) {
    return await api.subtraction({
      a: parseFloat(firstValue.value),
      b: parseFloat(secondValue.value),
    });
  } else if (operation.value == OperationType.multiplication) {
    return await api.multiplication({
      a: parseFloat(firstValue.value),
      b: parseFloat(secondValue.value),
    });
  } else if (operation.value == OperationType.division) {
    return await api.division({
      dividend: parseFloat(firstValue.value),
      divisor: parseFloat(secondValue.value),
    });
  } else if (operation.value == OperationType.square_root) {
    return await api.sqrt(parseFloat(firstValue.value));
  } else if (operation.value == OperationType.random_string) {
    return await api.randomString();
  }
};

const onSubmit = async () => {
  try {
    const value = await perform();
    snackText.value = `Result is ${value?.toString()}`;
    showSnack.value = true;
  } catch (e) {
    if (e instanceof NotEnoughBalanceException) {
      snackText.value = "Not enough balance";
      showSnack.value = true;
    } else if (e instanceof BadRequestException) {
      snackText.value = e.message;
      showSnack.value = true;
    }
  }
};

const form = ref(false);
</script>

<template>
  <logged-layout>
    <v-snackbar v-model="showSnack">
      {{ snackText }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="showSnack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-sheet class="pa-12" rounded>
      <v-card class="mx-auto px-6 py-8" max-width="344">
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-select
            v-model="operation"
            :items="Object.values(OperationType)"
            class="mb-2"
            label="Operation"
          />

          <v-text-field
            v-if="firstVisible"
            v-model="firstValue"
            :label="firstLabel"
          ></v-text-field>

          <v-text-field
            v-if="secondVisible"
            v-model="secondValue"
            :label="secondLabel"
          ></v-text-field>

          <br />

          <v-btn
            :disabled="!form"
            :loading="loading"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
          >
            Perform
          </v-btn>
        </v-form>
      </v-card>
    </v-sheet>
  </logged-layout>
</template>
