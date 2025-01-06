<template>
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-gray-800 mb-6">Latest Job Listings</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<!-- This is a placeholder for job listings. We'll implement actual job fetching later. -->
			<div v-for="job in jobs" :key="job.id" class="bg-white shadow rounded-lg p-6">
				<h3 class="text-xl font-semibold text-gray-800 mb-2">{{ job.title }}</h3>
				<p class="text-gray-600 mb-4">{{ job.company }} - {{ job.location }}</p>
				<p class="text-gray-700 mb-4">{{ job.description }}</p>
				<a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">View Details</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

// This is dummy data. In a real application, you'd fetch this from an API.
const jobs = ref([
	{ id: 1, title: 'Frontend Developer', company: 'Tech Co', location: 'Remote', description: 'We are looking for a skilled frontend developer...' },
	{ id: 2, title: 'Backend Engineer', company: 'Data Systems', location: 'New York, NY', description: 'Join our team as a backend engineer...' }
	// Add more dummy jobs as needed
]);
</script>
