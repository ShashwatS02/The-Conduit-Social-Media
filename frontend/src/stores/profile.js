import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// Setup axios instance consistent with other stores
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export const useProfileStore = defineStore("profile", () => {
  // --- State ---
  const user = ref(null);
  const posts = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // --- Actions ---

  // Fetches a user's public profile information
  async function fetchUserProfile(userId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/users/${userId}`);
      user.value = response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Could not load user profile.";
      user.value = null; // Clear user data on error
    } finally {
      isLoading.value = false;
    }
  }

  // Fetches all posts made by a specific user
  async function fetchUserPosts(userId) {
    // No separate loading state for posts to keep UI smoother
    try {
      const response = await api.get(`/users/${userId}/posts`);
      posts.value = response.data;
    } catch (err) {
      // Don't set the main error, just log it, as the profile might still be visible
      console.error("Could not load user posts:", err);
      posts.value = []; // Clear posts on error
    }
  }

  // Uploads a new avatar for the logged-in user
  async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.put("/users/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newAvatarUrl = response.data.avatarUrl;

      // Optimistically update the local state for an instant UI change
      if (user.value) {
        user.value.profile.avatar = newAvatarUrl;
      }

      // Return the new URL so the component can update other stores (like authStore)
      return newAvatarUrl;
    } catch (err) {
      console.error("Avatar upload failed:", err);
      // Re-throw the error so the component can display a message
      throw new Error(err.response?.data?.message || "Avatar upload failed.");
    }
  }

  return {
    user,
    posts,
    isLoading,
    error,
    fetchUserProfile,
    fetchUserPosts,
    uploadAvatar,
  };
});
