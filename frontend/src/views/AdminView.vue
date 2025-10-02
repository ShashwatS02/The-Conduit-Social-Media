<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "../stores/admin";
import { useAuthStore } from "../stores/auth";
import {
  ArrowPathIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
} from "@heroicons/vue/24/solid";

const adminStore = useAdminStore();
const authStore = useAuthStore();

onMounted(() => {
  adminStore.fetchUsers();
});
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto">
      <header class="mb-8">
        <h1
          class="text-3xl font-bold text-gray-900 dark:text-white flex items-center"
        >
          <ShieldCheckIcon class="h-8 w-8 mr-3 text-blue-500" />
          Admin Dashboard
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          User Management
        </p>
      </header>

      <!-- Loading State -->
      <div
        v-if="adminStore.isLoading"
        class="flex justify-center items-center py-20"
      >
        <ArrowPathIcon class="h-12 w-12 text-blue-500 animate-spin" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="adminStore.error"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <h2 class="text-2xl font-bold text-red-500">An Error Occurred</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ adminStore.error }}
        </p>
      </div>

      <!-- User Table -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Role
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr
                v-for="user in adminStore.users"
                :key="user._id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded-full object-cover"
                        :src="
                          user.profile?.avatar ||
                          `https://i.pravatar.cc/150?u=${user._id}`
                        "
                        alt="User Avatar"
                      />
                    </div>
                    <div class="ml-4">
                      <div
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ user.username }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="
                      user.isBanned
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    "
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.isBanned ? "Banned" : "Active" }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize"
                >
                  {{ user.role }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    v-if="authStore.user._id !== user._id"
                    @click="adminStore.toggleUserBan(user._id)"
                    :class="[
                      'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors',
                      user.isBanned
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white',
                    ]"
                  >
                    <NoSymbolIcon class="h-5 w-5" />
                    <span>{{ user.isBanned ? "Unban" : "Ban" }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
