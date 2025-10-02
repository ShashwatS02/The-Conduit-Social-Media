<script setup>
import { ref } from "vue";
import { usePostsStore } from "../../stores/posts";
import { PhotoIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../stores/auth";

const postsStore = usePostsStore();
const authStore = useAuthStore();
const content = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);
const isLoading = ref(false);
const error = ref(null);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  const fileInput = document.getElementById("image-upload");
  if (fileInput) {
    fileInput.value = "";
  }
};

const handleSubmit = async () => {
  if (!content.value.trim() && !imageFile.value) {
    error.value = "You can't submit an empty post.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    await postsStore.createPost(content.value, imageFile.value);
    content.value = "";
    removeImage();
  } catch (err) {
    error.value = err.message || "An unexpected error occurred while posting.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    v-if="authStore.isLoggedIn"
    class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-300"
  >
    <div class="flex items-start space-x-4">
      <!-- Safely display avatar with a fallback -->
      <img
        :src="authStore.user?.profile?.avatar"
        alt="Your avatar"
        class="h-12 w-12 rounded-full object-cover bg-gray-200"
        onerror="this.src='https://i.pravatar.cc/150?u=a042581f4e29026704d'"
      />
      <div class="flex-1">
        <form @submit.prevent="handleSubmit">
          <textarea
            v-model="content"
            class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-3 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition resize-none"
            rows="3"
            placeholder="What's on your mind?"
          ></textarea>

          <div v-if="imagePreview" class="mt-4 relative group">
            <img
              :src="imagePreview"
              alt="Image preview"
              class="rounded-lg max-h-60 w-auto"
            />
            <button
              @click="removeImage"
              type="button"
              class="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black/75 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-400">
            {{ error }}
          </div>

          <div class="mt-4 flex justify-between items-center">
            <label
              for="image-upload"
              class="cursor-pointer text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <PhotoIcon class="h-8 w-8" />
              <input
                id="image-upload"
                type="file"
                @change="handleFileChange"
                class="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
            </label>
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-transform transform active:scale-95"
            >
              <span v-if="!isLoading">Post</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
