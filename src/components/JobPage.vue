<template>
	<div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
		<div class="mb-6">
			<h2 class="text-3xl font-bold text-gray-800">{{ job.title }}</h2>
			<p class="text-lg text-gray-600 mt-2">{{ job.company }}</p>
			<p class="text-sm text-gray-500">{{ job.location }}</p>
			<div class="mt-4">
				<p class="text-gray-700">{{ job.description }}</p>
			</div>
		</div>

		<div class="mt-6">
			<h3 class="text-2xl font-semibold text-gray-800">Requirements</h3>
			<ul class="list-disc pl-5 text-gray-700">
				<li v-for="(requirement, index) in job.requirements" :key="index">{{ requirement }}</li>
			</ul>
		</div>

		<div class="mt-6">
			<h3 class="text-2xl font-semibold text-gray-800">Benefits</h3>
			<ul class="list-disc pl-5 text-gray-700">
				<li v-for="(benefit, index) in job.benefits" :key="index">{{ benefit }}</li>
			</ul>
		</div>

		<div class="mt-8 flex justify-center">
			<button @click="applyForJob" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">Apply Now</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const job = ref({
	title: '',
	company: '',
	location: '',
	description: '',
	requirements: [],
	benefits: []
});

// Fetch job data based on job ID (from route params)
onMounted(() => {
	const jobId = route.params.id; // Assuming the job ID is passed as a route parameter
	fetchJobDetails(jobId);
});

// Dummy function to simulate fetching job details from a backend
const fetchJobDetails = async () => {
	// Replace this with your actual API call to fetch job details
	const mockJobData = {
		title: 'Software Engineer',
		company: 'TechCorp',
		location: 'San Francisco, CA',
		description: 'Join our dynamic team to build world-class software solutions...',
		requirements: [
			'Bachelor’s degree in Computer Science or related field',
			'Proficient in JavaScript, Vue.js, Node.js',
			'Excellent problem-solving skills'
		],
		benefits: ['Health insurance', 'Paid time off', '401(k) matching']
	};

	job.value = mockJobData; // Setting the mock data for demonstration
};

const applyForJob = () => {
	alert('You have successfully applied for the job!');
	// Here, you can add functionality to handle job application (e.g., save to database, send email, etc.)
};
</script>

<style scoped>
/* Add some custom styling */
</style>
