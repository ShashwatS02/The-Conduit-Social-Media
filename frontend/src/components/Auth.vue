<script setup>
import { ref, inject } from "vue";
import { useAuthStore } from "../stores/auth";

// Inject the dark mode state from App.vue
const isDarkMode = inject("isDarkMode");

const authStore = useAuthStore();
const isLogin = ref(true);

const form = ref({
  username: "",
  email: "",
  password: "",
});

const error = ref(null);
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password);
    } else {
      await authStore.register(
        form.value.username,
        form.value.email,
        form.value.password
      );
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || "An unexpected error occurred.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center pt-12">
    <div class="w-full max-w-md">
      <div
        class="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all duration-500 hover:scale-105"
      >
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-3 text-center text-lg font-semibold transition-colors duration-300',
              isLogin
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400',
            ]"
          >
            Login
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-3 text-center text-lg font-semibold transition-colors duration-300',
              !isLogin
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400',
            ]"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <transition name="slide-fade" mode="out-in">
            <h2
              :key="isLogin"
              class="text-3xl font-bold text-center text-gray-800 dark:text-white"
            >
              {{ isLogin ? "Welcome Back!" : "Create an Account" }}
            </h2>
          </transition>

          <transition-group name="form-field">
            <div v-if="!isLogin" key="username">
              <label for="username" class="sr-only">Username</label>
              <input
                v-model="form.username"
                id="username"
                name="username"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Username"
              />
            </div>

            <div key="email">
              <label for="email" class="sr-only">Email address</label>
              <input
                v-model="form.email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Email address"
              />
            </div>

            <div key="password">
              <label for="password" class="sr-only">Password</label>
              <input
                v-model="form.password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Password"
              />
            </div>
          </transition-group>

          <transition name="slide-fade">
            <div
              v-if="error"
              class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md"
              role="alert"
            >
              <p class="font-bold">Error</p>
              <p>{{ error }}</p>
            </div>
          </transition>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-all duration-300"
            >
              <span
                v-if="isLoading"
                class="absolute left-0 inset-y-0 flex items-center pl-3"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{
                isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign in"
                  : "Create Account"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transitions for form fields */
.form-field-enter-active,
.form-field-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.form-field-enter-from,
.form-field-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* Transitions for titles and error messages */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
