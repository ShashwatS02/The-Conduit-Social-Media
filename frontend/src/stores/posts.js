import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// Create a configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const hasMorePosts = ref(true);
  const comments = ref([]);
  const isLoadingComments = ref(false);

  // --- Feed Actions ---

  async function fetchInitialPosts() {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get("/posts/feed?page=1");
      // Safely check if response.data is an array before assigning it.
      if (Array.isArray(response.data)) {
        posts.value = response.data;
        currentPage.value = 1;
        hasMorePosts.value = response.data.length > 0;
      } else {
        // Handle cases where the backend sends something unexpected
        posts.value = [];
        hasMorePosts.value = false;
        console.warn(
          "Received non-array response for initial posts:",
          response.data
        );
      }
    } catch (err) {
      console.error("Failed to fetch initial posts:", err);
      error.value = "Could not load the feed. Please try again later.";
      posts.value = []; // Clear posts on error
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMorePosts() {
    if (isLoading.value || !hasMorePosts.value) return;
    isLoading.value = true;
    try {
      const nextPage = currentPage.value + 1;
      const response = await api.get(`/posts/feed?page=${nextPage}`);
      // Safely check if response.data is an array and has content.
      if (Array.isArray(response.data) && response.data.length > 0) {
        posts.value.push(...response.data); // Use spread syntax to append new posts
        currentPage.value = nextPage;
      } else {
        hasMorePosts.value = false; // No more posts to load
      }
    } catch (err) {
      console.error("Could not load more posts:", err);
      // Don't show a huge error for infinite scroll, just stop loading
      hasMorePosts.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  // --- Post Actions ---

  async function createPost(content, imageFile) {
    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      posts.value.unshift(response.data); // Add new post to the top of the feed
    } catch (err) {
      console.error("Failed to create post:", err);
      // Optionally set an error state to show in the UI
    }
  }

  async function likePost(postId) {
    const post = posts.value.find((p) => p._id === postId);
    if (!post) return;

    // Optimistic update
    const authStore = useAuthStore();
    const isLiked = post.likes.includes(authStore.user._id);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== authStore.user._id);
    } else {
      post.likes.push(authStore.user._id);
    }

    try {
      await api.put(`/posts/${postId}/like`);
    } catch (err) {
      console.error("Failed to update like status:", err);
      // Revert optimistic update on failure
      if (isLiked) {
        post.likes.push(authStore.user._id);
      } else {
        post.likes = post.likes.filter((id) => id !== authStore.user._id);
      }
    }
  }

  // --- Comment Actions ---

  async function fetchComments(postId) {
    isLoadingComments.value = true;
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      if (Array.isArray(response.data)) {
        comments.value = response.data;
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      isLoadingComments.value = false;
    }
  }

  async function addComment(postId, content) {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      comments.value.push(response.data);
      // Update comment count on the post
      const post = posts.value.find((p) => p._id === postId);
      if (post) {
        post.commentCount = (post.commentCount || 0) + 1;
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }

  return {
    posts,
    isLoading,
    error,
    hasMorePosts,
    comments,
    isLoadingComments,
    fetchInitialPosts,
    fetchMorePosts,
    createPost,
    likePost,
    fetchComments,
    addComment,
  };
});
