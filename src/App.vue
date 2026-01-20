<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex justify-between items-center">
          <router-link to="/" class="flex items-center">
            <img src="@/assets/logo.png" alt="Logo" class="h-12 mr-3" />
            <span class="text-xl font-semibold text-[#46b7ff]">
              TalentQuest
            </span>
          </router-link>

          <div class="space-x-4">
            <!-- Not logged in -->
            <div v-if="!user">
              <router-link to="/login">
                <button
                  class="px-4 py-2 text-white bg-[#46b7ff] hover:bg-blue-700 rounded-md mr-4"
                >
                  Login
                </button>
              </router-link>

              <router-link to="/signup">
                <button
                  class="px-4 py-2 text-white bg-blue-600 hover:bg-[#46b7ff] rounded-md"
                >
                  Sign Up
                </button>
              </router-link>
            </div>

            <!-- Logged in -->
            <div v-else class="flex items-center space-x-4">
              <!-- Greeting -->
              <div class="flex items-center space-x-2">
                <span class="text-xl font-semibold">
                  Hello 👋, {{ displayName }}
                </span>

                <button
					type="button"
					@click="goToProfile"
					class="focus:outline-none"
					>
					<img
						src="@/assets/image.png"
						alt="User Icon"
						class="cursor-pointer h-8 w-8 rounded-full"
					/>
				</button>
              </div>

              <!-- Logout -->
              <button
                @click="logout"
                class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto px-6 py-8">
      <router-view />
    </main>

    <footer class="bg-white shadow mt-8">
      <div class="container mx-auto px-6 py-3">
        <p class="text-center text-gray-600">
          © {{ new Date().getFullYear() }} TalentQuest. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from './supabaseClient';
import { useRouter } from 'vue-router';

const user = ref(null);
const profile = ref(null);
const router = useRouter();

/**
 * Display name priority:
 * 1) profiles.full_name
 * 2) auth user.email
 */
const displayName = computed(() => {
  if (profile.value?.full_name) return profile.value.full_name;
  if (user.value?.email) return user.value.email;
  return '';
});

onMounted(async () => {
  // Initial session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  user.value = session ? session.user : null;

  if (user.value) {
    await loadProfile(user.value.id);
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session ? session.user : null;
    profile.value = null;

    if (user.value) {
      await loadProfile(user.value.id);
    }
  });
});

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to load profile:', error.message);
  } else {
    profile.value = data;
  }
}

async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
    return;
  }

  user.value = null;
  profile.value = null;
  router.push('/login');
}

function goToProfile() {
  router.push('/profile');
}
</script>
