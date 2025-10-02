import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import router from "../router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Helper function to safely get user from localStorage
function getInitialUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    // If parsing fails, clear the corrupted item
    localStorage.removeItem("user");
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref(getInitialUser());
  const returnUrl = ref(null);

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    user.value = response.data;
    localStorage.setItem("user", JSON.stringify(response.data));
    // Use router.push, not router.push with a string
    router.push(returnUrl.value || "/");
  }

  async function register(username, email, password) {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    user.value = response.data;
    localStorage.setItem("user", JSON.stringify(response.data));
    router.push("/");
  }

  async function logout() {
    await api.post("/auth/logout");
    user.value = null;
    localStorage.removeItem("user");
    router.push("/login");
  }

  async function getSocketToken() {
    try {
      const response = await api.get("/auth/socket-token");
      return response.data.socketToken;
    } catch (error) {
      console.error("Could not get socket token", error);
      // Maybe handle logout if token is invalid
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  }

  return { user, isLoggedIn, isAdmin, login, register, logout, getSocketToken };
});
