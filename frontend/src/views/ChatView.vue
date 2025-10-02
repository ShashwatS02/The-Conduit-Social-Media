<script setup>
import { onMounted, onUnmounted } from "vue";
import { useChatStore } from "../stores/chat";
import { useAuthStore } from "../stores/auth";
import RoomList from "../components/chat/RoomList.vue";
import ChatWindow from "../components/chat/ChatWindow.vue";

const chatStore = useChatStore();
const authStore = useAuthStore();

onMounted(async () => {
  // Fetch the short-lived token securely from our new backend endpoint
  const authToken = await authStore.getSocketToken();

  if (authToken) {
    chatStore.connectSocket(authToken);
    chatStore.fetchRooms();
  }
});

onUnmounted(() => {
  chatStore.disconnectSocket();
});
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)]">
    <!-- Full height minus navbar -->
    <!-- Room List Panel -->
    <aside class="w-1/4 md:w-1/5 h-full">
      <RoomList />
    </aside>

    <!-- Chat Window Panel -->
    <main class="w-3/4 md:w-4/5 h-full">
      <ChatWindow />
    </main>
  </div>
</template>
