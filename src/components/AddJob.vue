<template>
	<div class="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
		<div class="px-6 py-8">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Add New Job</h2>
			<form @submit.prevent="handleAddJob">
				<div class="mb-4">
					<label for="title" class="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
					<input
						type="text"
						id="title"
						v-model="title"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
				<div class="mb-4">
					<label for="company" class="block text-gray-700 text-sm font-bold mb-2">Company</label>
					<input
						type="text"
						id="company"
						v-model="company"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
				<div class="mb-4">
					<label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location</label>
					<input
						type="text"
						id="location"
						v-model="location"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					/>
				</div>
				<div class="mb-6">
					<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
					<textarea
						id="description"
						v-model="description"
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						required
					></textarea>
				</div>
				<div class="flex items-center justify-between">
					<button
						type="submit"
						class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Add Job
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');
const company = ref('');
const location = ref('');
const description = ref('');

const handleAddJob = async () => {
	// Here you would typically make an API call to add the job
	console.log('Adding job:', { title: title.value, company: company.value, location: location.value, description: description.value });

	// For now, we'll just simulate a successful job addition
	alert('Job added successfully!');
	router.push('/');
};
</script>
