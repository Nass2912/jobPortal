<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">
        Create your account
      </h2>

      <form @submit.prevent="handleSignup">
        <!-- Full name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            v-model="fullName"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            v-model="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Role selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            I am signing up as:
          </label>

          <div class="flex items-center space-x-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="job_seeker"
                v-model="role"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Job Seeker</span>
            </label>

            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="recruiter"
                v-model="role"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Job Poster</span>
            </label>
          </div>
        </div>

        <!-- Error message -->
        <p v-if="error" class="text-red-600 text-sm mb-4">
          {{ error }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-50"
        >
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <h3 class="text-lg font-semibold mb-3">
          Account created successfully
        </h3>

        <p class="text-gray-600 mb-6">
          Please confirm your email address and log in to access your account.
        </p>

        <button
          @click="goToLogin"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabaseClient';
import { useRouter } from 'vue-router';

const router = useRouter();

const fullName = ref('');
const email = ref('');
const password = ref('');
const role = ref('job_seeker');
const error = ref(null);
const loading = ref(false);
const showSuccessModal = ref(false);

async function handleSignup() {
  error.value = null;
  loading.value = true;

  try {
    if (!fullName.value || !email.value || !password.value) {
      throw new Error('Please fill in all fields');
    }

    const cleanEmail = String(email.value).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please enter a valid email address');
    }

    if (password.value.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!role.value) {
      throw new Error('Please select Job Seeker or Job Poster');
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password.value,
      options: {
        data: {
          full_name: String(fullName.value).trim(),
          role: String(role.value),
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    showSuccessModal.value = true;

  } catch (err) {
    error.value =
      err?.message ||
      'Signup failed. Email may already exist or password is too weak.';
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  showSuccessModal.value = false;
  router.push('/login');
}
</script>
