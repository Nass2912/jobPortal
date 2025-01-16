<template>
	<div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
		<div class="px-6 py-8">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
			<form @submit.prevent="handleLogin">
				<div class="mb-4">
					<label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
					<input
						type="email"
						id="email"
						v-model="email"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
				<div class="mb-6">
					<label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
					<input
						type="password"
						id="password"
						v-model="password"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
				<div class="flex items-center justify-between">
					<button
						type="submit"
						class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Sign In
					</button>
					<router-link to="/signup" class="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800">
						Don't have an account?
					</router-link>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../supabaseClient';

const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
	try {
		// Supabase sign-in
		const { data, error } = await login(email.value, password.value);

		if (error) {
			console.error('Login error:', error.message);
			return;
		}

		console.log('User logged in:', data);
		router.push('/'); // Redirect to the home page
	} catch (err) {
		console.error('Unexpected error:', err);
	}
};
</script>
