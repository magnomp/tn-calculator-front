<script setup lang="ts">
import LoggedLayout from "../layouts/LoggedLayout.vue";
import { type RecordItem, useApi, OperationType } from "../api";
import { ref } from "vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";

const api = useApi();

const records = ref<RecordItem[]>([]);

const loading = ref(false);
const totalItems = ref(0);

const operationType = ref<OperationType>();

const loadItems = async ({ page, itemsPerPage, search }: any) => {
  loading.value = true;
  try {
    const result = await api.myRecords(
      (page - 1) * itemsPerPage,
      itemsPerPage,
      search
    );
    records.value = result.items;
    totalItems.value = result.total;
  } finally {
    loading.value = false;
  }
};

const headers: any = [
  {
    title: "Operation",
    align: "start",
    sortable: false,
    key: "operationType",
  },
  {
    title: "User balance",
    align: "end",
    sortable: false,
    key: "userBalance",
  },
  {
    title: "amount",
    align: "end",
    sortable: false,
    key: "amount",
  },
  {
    title: "Response",
    align: "start",
    sortable: false,
    key: "response",
  },
  {
    title: "Date",
    align: "start",
    sortable: false,
    key: "date",
    value: (item: any) => new Date(item["date"]).toLocaleString(),
  },
  { title: "Actions", key: "actions", sortable: false },
];

const page = ref(1);
const itemsPerPage = ref(10);
const dialogDelete = ref(false);
const recordIdToRemove = ref("");

const deleteItem = (item: any) => {
  dialogDelete.value = true;
  recordIdToRemove.value = item.recordId;
};

const closeDelete = () => {
  dialogDelete.value = false;
};

const deleteItemConfirm = async () => {
  await api.deleteRecord(recordIdToRemove.value);
  await loadItems({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    search: operationType.value,
  });
  dialogDelete.value = false;
};
</script>

<template>
  <logged-layout>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table-server
      id="records"
      :items-per-page="itemsPerPage"
      :page="page"
      :headers="headers"
      :items-length="totalItems"
      :items="records"
      :search="operationType"
      :loading="loading"
      class="elevation-1"
      item-value="name"
      @update:options="loadItems"
    >
      <template v-slot:tfoot>
        <tr>
          <td>
            <v-select
              v-model="operationType"
              :items="Object.values(OperationType)"
              class="mb-2"
              label="Operation"
            />
          </td>
          <td></td>
        </tr>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
    </v-data-table-server>
  </logged-layout>
</template>
