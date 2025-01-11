<template>
	<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-4xl font-extrabold text-gray-900 text-center mb-10">Discover Your Next Career Opportunity</h1>

			<!-- Search and Filters -->
			<div class="bg-white shadow-md rounded-lg p-6 mb-8">
				<div class="mb-4">
					<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Jobs</label>
					<input
						id="search"
						v-model="searchQuery"
						type="text"
						placeholder="Enter job title, company, or keywords..."
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label for="jobType" class="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
						<select
							id="jobType"
							v-model="selectedJobType"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="">All Job Types</option>
							<option value="Full-time">Full-time</option>
							<option value="Part-time">Part-time</option>
							<option value="Contract">Contract</option>
							<option value="Internship">Internship</option>
						</select>
					</div>
					<div>
						<label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
						<select
							id="location"
							v-model="selectedLocation"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="">All Locations</option>
							<option value="Remote">Remote</option>
							<option value="New York, NY">New York, NY</option>
							<option value="San Francisco, CA">San Francisco, CA</option>
							<option value="London, UK">London, UK</option>
						</select>
					</div>
					<div>
						<label for="experience" class="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
						<select
							id="experience"
							v-model="selectedExperience"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="">All Levels</option>
							<option value="Entry">Entry Level</option>
							<option value="Mid">Mid Level</option>
							<option value="Senior">Senior Level</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Job Listings -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="job in filteredJobs"
					:key="job.id"
					class="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="p-6">
						<div class="flex justify-between items-start mb-4">
							<h3 class="text-xl font-semibold text-gray-900">{{ job.title }}</h3>
							<span
								:class="[
									'px-2 py-1 text-xs font-semibold rounded-full',
									job.jobType === 'Full-time'
										? 'bg-green-100 text-green-800'
										: job.jobType === 'Part-time'
										? 'bg-blue-100 text-blue-800'
										: job.jobType === 'Contract'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-purple-100 text-purple-800'
								]"
							>
								{{ job.jobType }}
							</span>
						</div>
						<p class="text-gray-600 mb-2">{{ job.company }}</p>
						<p class="text-gray-600 mb-4 flex items-center">
							<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							{{ job.location }}
						</p>
						<p class="text-gray-700 mb-4">{{ job.description }}</p>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-500">Posted {{ job.postedDate }}</span>
							<a
								href="#"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Apply Now
								<svg class="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- No Results Message -->
			<p v-if="filteredJobs.length === 0" class="text-center text-gray-600 mt-8 bg-white shadow-md rounded-lg p-6">
				No job listings found matching your criteria. Please try adjusting your search or filters.
			</p>

			<!-- Pagination -->
			<div class="mt-8 flex justify-center">
				<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
					<a
						href="#"
						class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
					>
						<span class="sr-only">Previous</span>
						<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
					<a
						href="#"
						aria-current="page"
						class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
					>
						1
					</a>
					<a
						href="#"
						class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
					>
						2
					</a>
					<a
						href="#"
						class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
					>
						3
					</a>
					<a
						href="#"
						class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
					>
						<span class="sr-only">Next</span>
						<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const jobs = ref([
	{
		id: 1,
		title: 'Senior Frontend Developer',
		company: 'Tech Innovators',
		location: 'Remote',
		jobType: 'Full-time',
		experience: 'Senior',
		description: 'Join our team to build cutting-edge web applications using Vue.js and modern frontend technologies.',
		postedDate: '2 days ago'
	},
	{
		id: 2,
		title: 'Backend Engineer',
		company: 'Data Systems Inc.',
		location: 'New York, NY',
		jobType: 'Full-time',
		experience: 'Mid',
		description: "We're seeking a talented backend engineer to develop robust APIs and microservices using Node.js and PostgreSQL.",
		postedDate: '1 week ago'
	},
	{
		id: 3,
		title: 'UX/UI Designer',
		company: 'Creative Solutions',
		location: 'San Francisco, CA',
		jobType: 'Contract',
		experience: 'Mid',
		description: "Help us create intuitive and beautiful user interfaces for our clients' web and mobile applications.",
		postedDate: '3 days ago'
	},
	{
		id: 4,
		title: 'DevOps Specialist',
		company: 'Cloud Innovations',
		location: 'Remote',
		jobType: 'Part-time',
		experience: 'Senior',
		description: 'We need an experienced DevOps engineer to optimize our CI/CD pipelines and improve system reliability.',
		postedDate: '5 days ago'
	},
	{
		id: 5,
		title: 'Data Scientist',
		company: 'AI Research Lab',
		location: 'London, UK',
		jobType: 'Full-time',
		experience: 'Senior',
		description: 'Join our team to develop machine learning models and analyze complex datasets for groundbreaking AI research.',
		postedDate: '1 day ago'
	},
	{
		id: 6,
		title: 'Junior Web Developer',
		company: 'StartUp Nexus',
		location: 'Remote',
		jobType: 'Internship',
		experience: 'Entry',
		description: 'Great opportunity for a recent graduate to gain hands-on experience in full-stack web development.',
		postedDate: '4 days ago'
	}
]);

const searchQuery = ref('');
const selectedJobType = ref('');
const selectedLocation = ref('');
const selectedExperience = ref('');

const filteredJobs = computed(() => {
	return jobs.value.filter((job) => {
		const matchesSearch =
			job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			job.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			job.description.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesJobType = selectedJobType.value === '' || job.jobType === selectedJobType.value;
		const matchesLocation = selectedLocation.value === '' || job.location === selectedLocation.value;
		const matchesExperience = selectedExperience.value === '' || job.experience === selectedExperience.value;

		return matchesSearch && matchesJobType && matchesLocation && matchesExperience;
	});
});
</script>
