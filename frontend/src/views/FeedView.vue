<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { usePostsStore } from "../stores/posts";
import PostComposer from "../components/post/PostComposer.vue";
import PostCard from "../components/post/PostCard.vue";

const postsStore = usePostsStore();
const loader = ref(null); // A ref to the invisible trigger element at the bottom

let observer; // This will hold our Intersection Observer instance

onMounted(() => {
  // Fetch the first page of posts when the component loads
  postsStore.fetchInitialPosts();

  // Create the Intersection Observer
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      // If the trigger element is on screen and we're not already loading...
      if (
        entry &&
        entry.isIntersecting &&
        !postsStore.isLoading &&
        postsStore.hasMorePosts
      ) {
        // ...fetch the next page of posts.
        postsStore.fetchMorePosts();
      }
    },
    {
      // Start loading 200px before the trigger is visible for a smoother experience
      rootMargin: "200px",
    }
  );

  // If the loader element exists, start observing it
  if (loader.value) {
    observer.observe(loader.value);
  }
});

// This ensures the observer always has something to watch, even if the loader appears later
watch(loader, (newLoader) => {
  if (newLoader) {
    observer.observe(newLoader);
  }
});

// Clean up the observer when we leave the page to prevent memory leaks
onUnmounted(() => {
  if (loader.value) {
    observer.unobserve(loader.value);
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <PostComposer class="mb-8" />

    <div
      v-if="postsStore.error"
      class="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6"
      role="alert"
    >
      <strong class="font-bold">Oops!</strong>
      <span class="block sm:inline ml-2">{{ postsStore.error }}</span>
    </div>

    <div v-if="postsStore.posts.length > 0" class="space-y-6">
      <PostCard v-for="post in postsStore.posts" :key="post._id" :post="post" />
    </div>

    <!-- This is the invisible trigger element for our infinite scroll -->
    <div ref="loader" class="h-10"></div>

    <!-- Show beautiful loading skeletons while fetching more posts -->
    <div v-if="postsStore.isLoading" class="space-y-6 mt-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 animate-pulse"
      >
        <div class="flex items-center mb-4">
          <div
            class="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 mr-4"
          ></div>
          <div class="w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Show a message when all posts have been loaded -->
    <div
      v-if="!postsStore.hasMorePosts && postsStore.posts.length > 0"
      class="text-center text-gray-500 dark:text-gray-400 mt-10"
    >
      <p>You've reached the end of the feed!</p>
    </div>
  </div>
</template>
