// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Import View Components
import FeedView from "../views/FeedView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "../views/ProfileView.vue";
import AdminView from "../views/AdminView.vue";
import ChatView from "../views/ChatView.vue";

const routes = [
  {
    path: "/",
    name: "Feed",
    component: FeedView,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/profile/:id",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login if trying to access a protected route without being logged in
    next({ name: "Login" });
  } else if (requiresAdmin && authStore.user?.role !== "admin") {
    // Redirect to feed if a non-admin tries to access an admin route
    next({ name: "Feed" });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
