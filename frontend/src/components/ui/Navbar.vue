<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

// This defines the props and events that App.vue will pass to this component.
// This was the missing piece.
defineProps({
  isDark: Boolean,
});
defineEmits(["toggle-theme"]);

const authStore = useAuthStore();
</script>

<template>
  <nav
    class="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RouterLink
              to="/"
              class="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              SocialDashboard
            </RouterLink>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <RouterLink
                to="/"
                class="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Feed
              </RouterLink>
              <template v-if="authStore.isLoggedIn">
                <RouterLink
                  to="/chat"
                  class="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Chat
                </RouterLink>
                <RouterLink
                  :to="`/profile/${authStore.user?._id}`"
                  class="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </RouterLink>
              </template>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <template v-if="authStore.isLoggedIn">
            <button
              @click="authStore.logout"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium mr-4"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mr-4"
            >
              Login
            </RouterLink>
          </template>
          <button
            @click="$emit('toggle-theme')"
            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            <SunIcon v-if="isDark" class="h-6 w-6" />
            <MoonIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
