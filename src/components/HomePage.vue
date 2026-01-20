<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Discover Your Next Career Opportunity
      </h1>

      <!-- Search and Filters -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Search Jobs
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter job title, company, or keywords..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
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
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              v-model="selectedLocation"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Port Louis">Port Louis</option>
              <option value="Moka">Moka</option>
              <option value="Ebene">Ebene</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
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

      <!-- Loading -->
      <p v-if="loading" class="text-center text-gray-600">
        Loading jobs...
      </p>

      <!-- Job Listings -->
      <div v-else class="space-y-6">
        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ job.title }}
              </h3>

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

            <p class="text-gray-600 mb-2">
              {{ job.company || 'Unknown Company' }}
            </p>

            <p class="text-gray-600 mb-4 flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ job.location || 'Not specified' }}
            </p>

            <p class="text-gray-700 mb-4">
              {{ job.description }}
            </p>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Posted {{ job.postedDate }}
              </span>

              <button
                @click="goToShowPage(job.id)"
                class="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <p
        v-if="!loading && filteredJobs.length === 0"
        class="text-center text-gray-600 mt-8 bg-white shadow-md rounded-lg p-6"
      >
        Login or Signup to view jobs
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabaseClient';

const router = useRouter();

const jobs = ref([]);
const loading = ref(true);
const user = ref(null);

const searchQuery = ref('');
const selectedJobType = ref('');
const selectedLocation = ref('');
const selectedExperience = ref('');

// --- Fetch user + jobs ---
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  user.value = session?.user || null;

  if (!user.value) {
    // ❌ Not logged in → show no jobs
    jobs.value = [];
    loading.value = false;
    return;
  }

  // ✅ Logged in → fetch jobs
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
  } else {
    jobs.value = data || [];
  }

  loading.value = false;
});

// --- Filters ---
const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesJobType =
      selectedJobType.value === '' ||
      job.job_type === selectedJobType.value;

    const matchesLocation =
      selectedLocation.value === '' ||
      job.location === selectedLocation.value;

    const matchesExperience =
      selectedExperience.value === '' ||
      job.experience === selectedExperience.value;

    return (
      matchesSearch &&
      matchesJobType &&
      matchesLocation &&
      matchesExperience
    );
  });
});

// --- Navigation ---
const goToShowPage = (jobId) => {
  router.push(`/job/${jobId}`);
};
</script>
