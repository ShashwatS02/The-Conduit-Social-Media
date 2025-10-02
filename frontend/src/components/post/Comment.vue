<script setup>
import { computed } from "vue";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const timeSince = computed(() => {
  const seconds = Math.floor(
    (new Date() - new Date(props.comment.createdAt)) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
});
</script>

<template>
  <div class="flex items-start space-x-4 py-4">
    <img
      :src="
        comment.author?.profile?.avatar ||
        'https://i.pravatar.cc/150?u=' + comment.author?._id
      "
      alt="Author Avatar"
      class="w-10 h-10 rounded-full object-cover"
    />
    <div class="flex-1">
      <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ comment.author?.username || "Anonymous" }}
        </p>
        <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ timeSince }}
      </p>
    </div>
  </div>
</template>
