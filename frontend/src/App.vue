<script setup>
import { ref, onMounted, watch } from "vue";
import Navbar from "./components/ui/Navbar.vue";

// --- Theme Management ---
// Use localStorage to remember the theme, defaulting to light ('false')
const isDark = ref(JSON.parse(localStorage.getItem("isDarkMode") || "false"));

// Watch for changes in the isDark state
watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  // Save the user's preference to localStorage
  localStorage.setItem("isDarkMode", newVal);
});

// When the component first loads, apply the theme from localStorage
onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
};
</script>

<template>
  <!-- This div now has a dark mode background color and a smooth transition -->
  <div
    id="app-layout"
    class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- Pass the theme state and toggle function to the Navbar -->
    <Navbar :is-dark="isDark" @toggle-theme="toggleTheme" />
    <main>
      <router-view />
    </main>
  </div>
</template>
