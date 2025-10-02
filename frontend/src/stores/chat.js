import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: "/api/chat",
  withCredentials: true,
});

export const useChatStore = defineStore("chat", () => {
  const rooms = ref([]);
  const activeRoom = ref(null);
  const messages = ref([]);
  const socket = ref(null);
  const isLoading = ref(false);

  function connectSocket(authToken) {
    if (socket.value) return;

    // Use a special socket token if available, otherwise this setup assumes
    // the JWT is accessible (e.g., not httpOnly in this specific case for simplicity)
    socket.value = io({ auth: { token: authToken } });

    socket.value.on("connect", () => {
      console.log("Connected to chat server!");
    });

    socket.value.on("newMessage", (message) => {
      if (activeRoom.value && message.chatRoom === activeRoom.value._id) {
        messages.value.push(message);
      }
    });
  }

  function disconnectSocket() {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  }

  async function fetchRooms() {
    const response = await api.get("/rooms");
    rooms.value = response.data;
    // Automatically select the first room
    if (rooms.value.length > 0) {
      await selectRoom(rooms.value[0]);
    }
  }

  async function selectRoom(room) {
    isLoading.value = true;
    activeRoom.value = room;
    messages.value = [];

    // Join socket room
    if (socket.value) {
      socket.value.emit("joinRoom", room._id);
    }

    const response = await api.get(`/rooms/${room._id}/messages`);
    messages.value = response.data;
    isLoading.value = false;
  }

  function sendMessage(content) {
    if (!socket.value || !activeRoom.value) return;

    socket.value.emit("sendMessage", {
      roomId: activeRoom.value._id,
      content,
    });
  }

  return {
    rooms,
    activeRoom,
    messages,
    isLoading,
    connectSocket,
    disconnectSocket,
    fetchRooms,
    selectRoom,
    sendMessage,
  };
});
