<script setup>
import { ref, nextTick, watch } from "vue";
import { useChatStore } from "../../stores/chat";
import { useAuthStore } from "../../stores/auth";
import { PaperAirplaneIcon } from "@heroicons/vue/24/solid";

const chatStore = useChatStore();
const authStore = useAuthStore();
const newMessage = ref("");
const chatContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

watch(
  () => chatStore.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

const handleSendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value.trim());
    newMessage.value = "";
  }
};
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header
      class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <h1 class="text-xl font-bold text-gray-800 dark:text-white">
        # {{ chatStore.activeRoom?.name || "Chat" }}
      </h1>
    </header>

    <!-- Message List -->
    <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto space-y-4">
      <div
        v-for="msg in chatStore.messages"
        :key="msg._id"
        class="flex"
        :class="
          msg.sender._id === authStore.user._id
            ? 'justify-end'
            : 'justify-start'
        "
      >
        <div class="flex items-end max-w-xs md:max-w-md">
          <img
            v-if="msg.sender._id !== authStore.user._id"
            :src="
              msg.sender.profile?.avatar ||
              `https://i.pravatar.cc/150?u=${msg.sender._id}`
            "
            alt="avatar"
            class="h-8 w-8 rounded-full mr-3"
          />
          <div>
            <div
              v-if="msg.sender._id !== authStore.user._id"
              class="text-xs text-gray-500 dark:text-gray-400 mb-1"
            >
              {{ msg.sender.username }}
            </div>
            <div
              class="px-4 py-2 rounded-xl"
              :class="
                msg.sender._id === authStore.user._id
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              "
            >
              {{ msg.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Form -->
    <div
      class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <form @submit.prevent="handleSendMessage" class="flex items-center">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type a message..."
          class="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="ml-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PaperAirplaneIcon class="h-6 w-6" />
        </button>
      </form>
    </div>
  </div>
</template>
