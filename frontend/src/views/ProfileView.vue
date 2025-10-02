<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useProfileStore } from "../stores/profile";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/post/PostCard.vue";
import { ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const profileStore = useProfileStore();
const authStore = useAuthStore();

const userId = ref(route.params.id);

// Fetch profile data when the component is created or the route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      userId.value = newId;
      profileStore.fetchUserProfile(newId);
      profileStore.fetchUserPosts(newId);
    }
  },
  { immediate: true }
);

const isOwnProfile = computed(() => {
  return authStore.isLoggedIn && authStore.user._id === userId.value;
});

const avatarInput = ref(null);
const isUploading = ref(false);
const uploadError = ref(null);

const onAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  uploadError.value = null;

  try {
    const newAvatarUrl = await profileStore.uploadAvatar(file);
    // The store will optimistically update the user profile,
    // so we just need to refresh the authStore's user object
    if (isOwnProfile.value) {
      // This ensures the avatar in the navbar also updates
      authStore.user.profile.avatar = newAvatarUrl;
    }
  } catch (error) {
    uploadError.value = error.message || "Failed to upload avatar.";
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="profileStore.isLoading" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">Loading profile...</p>
    </div>
    <div
      v-else-if="profileStore.error"
      class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative"
    >
      <strong class="font-bold">Oops!</strong>
      <span class="block sm:inline">{{ profileStore.error }}</span>
    </div>
    <div v-else-if="profileStore.user" class="space-y-8">
      <!-- Profile Header -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
      >
        <div class="relative group">
          <img
            :src="profileStore.user.profile.avatar"
            alt="User Avatar"
            class="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-blue-500 dark:ring-blue-400"
          />
          <div
            v-if="isOwnProfile"
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-300 cursor-pointer"
            @click="!isUploading && avatarInput.click()"
          >
            <button
              class="opacity-0 group-hover:opacity-100 text-white"
              :disabled="isUploading"
            >
              <ArrowUpOnSquareIcon class="h-8 w-8" />
            </button>
            <input
              type="file"
              ref="avatarInput"
              @change="onAvatarChange"
              accept="image/*"
              class="hidden"
            />
          </div>
        </div>
        <div class="text-center sm:text-left">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ profileStore.user.username }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ profileStore.user.email }}
          </p>
          <div
            v-if="isUploading"
            class="mt-2 text-sm text-blue-600 dark:text-blue-400"
          >
            Uploading...
          </div>
          <div v-if="uploadError" class="mt-2 text-sm text-red-500">
            {{ uploadError }}
          </div>
        </div>
      </div>

      <!-- User's Posts -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Posts by {{ profileStore.user.username }}
        </h2>
        <div v-if="profileStore.posts.length > 0" class="space-y-6">
          <PostCard
            v-for="post in profileStore.posts"
            :key="post._id"
            :post="post"
          />
        </div>
        <div
          v-else
          class="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <p class="text-gray-500 dark:text-gray-400">
            This user hasn't posted anything yet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
