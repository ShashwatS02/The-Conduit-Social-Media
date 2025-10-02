<script setup>
import { ref, onMounted } from "vue";
// This line is now corrected from 'usePostStore' to 'usePostsStore'
import { usePostsStore } from "../../stores/posts";
import { useAuthStore } from "../../stores/auth";
import Comment from "./Comment.vue";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const postsStore = usePostsStore();
const authStore = useAuthStore();
const newComment = ref("");
const isLoading = ref(false);

onMounted(() => {
  // Fetch comments when the modal is first mounted/shown
  if (props.post._id) {
    postsStore.fetchComments(props.post._id);
  }
});

const handleSubmitComment = async () => {
  if (!newComment.value.trim()) return;
  isLoading.value = true;
  await postsStore.addComment(props.post._id, newComment.value);
  newComment.value = "";
  isLoading.value = false;
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh] transition-all duration-300 transform scale-95"
      :class="{ 'scale-100': show }"
    >
      <!-- Modal Header -->
      <div
        class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Comments
        </h3>
        <button
          @click="emit('close')"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <XMarkIcon class="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <!-- Comments List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-if="postsStore.isLoadingComments"
          class="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          Loading comments...
        </div>
        <div v-else-if="postsStore.comments.length > 0">
          <Comment
            v-for="comment in postsStore.comments"
            :key="comment._id"
            :comment="comment"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No comments yet. Be the first to reply!</p>
        </div>
      </div>

      <!-- Comment Input Form -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          @submit.prevent="handleSubmitComment"
          class="flex items-center space-x-3"
        >
          <img
            :src="authStore.user?.profile?.avatar"
            alt="Your avatar"
            class="h-10 w-10 rounded-full object-cover"
          />
          <input
            v-model="newComment"
            type="text"
            placeholder="Add a comment..."
            class="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            :disabled="isLoading || !newComment.trim()"
            class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-50 transition"
          >
            <PaperAirplaneIcon class="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
