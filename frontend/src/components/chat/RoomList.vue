<script setup>
import { useChatStore } from "../../stores/chat";
const chatStore = useChatStore();
</script>

<template>
  <div
    class="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
  >
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Rooms</h2>
    </div>
    <ul>
      <li v-for="room in chatStore.rooms" :key="room._id">
        <a
          @click.prevent="chatStore.selectRoom(room)"
          href="#"
          :class="[
            'block p-4 text-left w-full text-md font-medium transition-colors duration-200',
            chatStore.activeRoom?._id === room._id
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
        >
          # {{ room.name }}
        </a>
      </li>
    </ul>
  </div>
</template>
