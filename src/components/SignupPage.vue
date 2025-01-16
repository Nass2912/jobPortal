<template>
	<div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
		<div class="px-6 py-8">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
			<form @submit.prevent="handleSignup">
				<div class="mb-4">
					<label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
					<input
						type="text"
						id="name"
						v-model="name"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
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
				<div class="mb-4">
					<label for="role" class="block text-gray-700 text-sm font-bold mb-2"
						>Are you a job seeker or searching for talents to join your team?</label
					>
					<select
						id="role"
						v-model="role"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					>
						<option disabled value="">Select below</option>
						<option value="job seeker">Job Seeker</option>
						<option value="job publisher">Job Publisher</option>
					</select>
				</div>
				<div class="flex items-center justify-between">
					<button
						type="submit"
						class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Sign Up
					</button>
					<router-link to="/login" class="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800">
						Already have an account?
					</router-link>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signUp } from '../supabaseClient'; // Assuming you've updated this function

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');

const handleSignup = async () => {
	try {
		// Supabase sign-up with role
		const { data, error } = await signUp(email.value, password.value, role.value, name.value);

		if (error) {
			console.error('Signup error:', error.message);
			return;
		}

		console.log('User signed up:', data);
		alert('Signup successful! Please check your email to confirm your account.');
		router.push('/login'); // Redirect to login page
	} catch (err) {
		console.error('Unexpected error:', err);
		alert('An unexpected error occurred. Please try again.');
	}
};
</script>
