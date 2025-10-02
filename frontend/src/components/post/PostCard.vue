<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import { usePostsStore } from '../../stores/posts';
import { useAuthStore } from '../../stores/auth';
import CommentsModal from './CommentsModal.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const postsStore = usePostsStore();
const authStore = useAuthStore();

const showCommentsModal = ref(false);
const copied = ref(false); // state for the "Copied!" message

const isLiked = computed(() => {
  // Safely check for likes array and logged in user
  if (!authStore.isLoggedIn || !props.post.likes) return false;
  return props.post.likes.includes(authStore.user._id);
});

const handleLike = () => {
  if (!authStore.isLoggedIn) return;
  postsStore.likePost(props.post._id);
};

const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${props.post._id}`;
    // Safely access author username with a fallback
    const shareData = {
        title: 'Check out this post!',
        text: `"${props.post.content}" by ${props.post.author?.username || 'a user'}`,
        url: postUrl,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            throw new Error('Web Share API not available');
        }
    } catch (err) {
        try {
            await navigator.clipboard.writeText(postUrl);
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);
        } catch (clipboardErr) {
            console.error('Failed to copy to clipboard', clipboardErr);
            alert('Could not copy link to clipboard.');
        }
    }
};

const formattedDate = computed(() => {
  if (!props.post.createdAt) return '';
  return new Date(props.post.createdAt).toLocaleString();
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 transition-colors duration-300">
    <!-- Post Header: Use v-if to ensure post.author exists before rendering -->
    <div v-if="post.author" class="flex items-center mb-4">
      <RouterLink :to="`/profile/${post.author._id}`" class="flex items-center">
        <img
          :src="post.author.profile?.avatar"
          alt="Author's avatar"
          class="h-12 w-12 rounded-full object-cover mr-4 bg-gray-200 dark:bg-gray-700"
          onerror="this.src='https://i.pravatar.cc/150?u=a042581f4e29026704d'"
        />
        <div>
          <p class="font-bold text-gray-800 dark:text-gray-100">{{ post.author.username }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formattedDate }}</p>
        </div>
      </RouterLink>
    </div>

    <!-- Post Content -->
    <p class="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">{{ post.content }}</p>

    <!-- Post Image -->
    <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post image" class="rounded-lg w-full object-cover max-h-[60vh] mb-4" />

    <!-- Action Buttons -->
    <div class="flex justify-between items-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
      <!-- Like Button -->
      <button @click="handleLike" class="flex items-center space-x-2 hover:text-red-500 transition-colors group">
        <HeartIconSolid v-if="isLiked" class="h-7 w-7 text-red-500 transition-transform transform group-hover:scale-110" />
        <HeartIcon v-else class="h-7 w-7 transition-transform transform group-hover:scale-110" />
        <!-- Safely display likes count, defaulting to 0 -->
        <span class="font-semibold">{{ post.likes?.length || 0 }}</span>
      </button>

      <!-- Comment Button -->
      <button @click="showCommentsModal = true" class="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
        <ChatBubbleOvalLeftEllipsisIcon class="h-7 w-7 transition-transform transform group-hover:scale-110" />
        <!-- Safely display comment count, defaulting to 0 -->
        <span class="font-semibold">{{ post.commentCount || 0 }}</span>
      </button>

      <!-- Share Button -->
      <div class="relative">
          <button @click="handleShare" class="flex items-center space-x-2 hover:text-green-500 transition-colors group">
              <ShareIcon class="h-7 w-7 transition-transform transform group-hover:scale-110" />
          </button>
          <div v-if="copied" class="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Copied!
          </div>
      </div>
    </div>
  </div>
  <!-- Use v-if to only mount the modal when it's needed -->
  <CommentsModal v-if="showCommentsModal" :post="post" :show="showCommentsModal" @close="showCommentsModal = false" />
</template>

