<template>
	<div class="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
		<div class="px-6 py-8">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">User Profile</h2>
			<form @submit.prevent="handleUpdateProfile">
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
					<label for="bio" class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
					<textarea
						id="bio"
						v-model="bio"
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
					></textarea>
				</div>
				<div class="flex items-center justify-between">
					<button
						type="submit"
						class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Update Profile
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const name = ref('');
const email = ref('');
const bio = ref('');

onMounted(() => {
	// Here you would typically fetch the user's profile data from an API
	// For now, we'll just use some dummy data
	name.value = 'John Doe';
	email.value = 'john@example.com';
	bio.value = 'I am a software developer with 5 years of experience.';
});

const handleUpdateProfile = async () => {
	// Here you would typically make an API call to update the user's profile
	console.log('Updating profile:', { name: name.value, email: email.value, bio: bio.value });

	// For now, we'll just simulate a successful profile update
	alert('Profile updated successfully!');
};
</script>
