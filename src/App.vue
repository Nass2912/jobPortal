<template>
	<div class="flex flex-col min-h-screen bg-gray-100">
		<header class="bg-white shadow">
			<nav class="container mx-auto px-6 py-3">
				<div class="flex justify-between items-center">
					<router-link to="/" class="flex items-center">
						<img src="@/assets/logo.png" alt="Logo" class="h-12 mr-3" />
						<span class="text-xl font-semibold text-[#46b7ff]">Grow Your Career</span>
					</router-link>
					<div class="space-x-4">
						<!-- Conditionally render login/signup or logout -->
						<div v-if="!user">
							<router-link to="/login">
								<button class="px-4 py-2 text-white bg-[#46b7ff] hover:bg-blue-700 rounded-md mr-4">Login</button>
							</router-link>
							<router-link to="/signup">
								<button class="px-4 py-2 text-white bg-blue-600 hover:bg-[#46b7ff] rounded-md">Sign Up</button>
							</router-link>
						</div>
						<div v-else class="flex items-center space-x-4">
							<!-- User Icon and Greeting -->
							<div class="flex items-center space-x-2">
								<!-- Use the uploaded icon -->
								<span class="text-xl font-semibold">Hello 👋, {{ user.user_metadata.name || user.email }}</span>
								<img @click="goToProfile" src="@/assets/image.png" alt="User Icon" class="cursor-pointer h-8 w-8 rounded-full" />
							</div>
							<!-- <button @click="logout" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md">Logout</button> -->
						</div>
					</div>
				</div>
			</nav>
		</header>

		<main class="flex-grow container mx-auto px-6 py-8">
			<router-view></router-view>
		</main>

		<footer class="bg-white shadow mt-8">
			<div class="container mx-auto px-6 py-3">
				<p class="text-center text-gray-600">© {{ new Date().getFullYear() }} Grow Your Career. All rights reserved.</p>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from './supabaseClient';
import { useRouter } from 'vue-router';

// Declare reactive variable for the user
const user = ref(null);
const router = useRouter();

// Check if a user is already signed in when the component is mounted
onMounted(async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	user.value = session ? session.user : null;
	console.log(user.value);

	// Listen for auth state changes
	supabase.auth.onAuthStateChange((_event, session) => {
		user.value = session ? session.user : null;
	});
});

// Logout function
// const logout = async () => {
// 	const { error } = await supabase.auth.signOut();
// 	if (error) {
// 		console.error('Logout error:', error.message);
// 	} else {
// 		user.value = null; // Clear user data after logging out
// 	}
// };

// Function to navigate to the profile page
const goToProfile = () => {
	router.push('/profile');
};
</script>
