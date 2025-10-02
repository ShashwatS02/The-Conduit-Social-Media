import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

export const useAdminStore = defineStore("admin", () => {
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get("/users");
      users.value = response.data;
    } catch (err) {
      console.error("Failed to fetch users:", err);
      error.value = "Could not load user data. You may not have permission.";
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleUserBan(userId) {
    try {
      const response = await api.put(`/users/${userId}/ban`);
      // Update the user in the local state
      const index = users.value.findIndex((u) => u._id === userId);
      if (index !== -1) {
        users.value[index] = response.data;
      }
    } catch (err) {
      console.error(`Failed to toggle ban for user ${userId}:`, err);
      // Optionally, set an error message to display to the admin
    }
  }

  return { users, isLoading, error, fetchUsers, toggleUserBan };
});
