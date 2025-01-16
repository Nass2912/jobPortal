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
								<span class="text-xl font-semibold">Hello 👋, {{ user.user_metadata.name || user.email }}</span>
							</div>
							<button @click="logout" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md">Logout</button>
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

<script>
import { supabase } from './supabaseClient';

export default {
	name: 'App',
	data() {
		return {
			user: null // This will store the current user
		};
	},
	async created() {
		// Check if a user is already signed in
		const {
			data: { session }
		} = await supabase.auth.getSession();
		this.user = session ? session.user : null;
		console.log(this.user);

		// Listen for auth state changes
		supabase.auth.onAuthStateChange((_event, session) => {
			this.user = session ? session.user : null;
		});
	},
	methods: {
		// Logout function
		async logout() {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error('Logout error:', error.message);
			} else {
				this.user = null; // Clear user data after logging out
			}
		}
	}
};
</script>
