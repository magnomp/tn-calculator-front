import { useAuthTokenStore } from "@/stores/authToken";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/LoginPage.vue"),
    },
    {
      path: "/",
      name: "my-records",
      meta: { requiresAuth: true },
      component: () => import("../pages/MyRecordsPage.vue"),
    },
    {
      path: "/newoperation",
      name: "new-operation",
      meta: { requiresAuth: true },
      component: () => import("../pages/NewOperationPage.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthTokenStore();
  console.log(
    `Navigating to ${to.name?.toString()}. RequiresAuth: ${
      to.meta.requiresAuth
    }. IsAuthenticated: ${authStore.isAuthenticated}`
  );
  if (to.meta.requiresAuth && !authStore.isAuthenticated)
    next({ name: "login" });
  else if (to.name == "login" && authStore.isAuthenticated)
    next({ name: "my-records" });
  else next();
});

export default router;
