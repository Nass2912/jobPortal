<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-600">
        Loading job...
      </div>

      <!-- Job -->
      <div v-else-if="job">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ job.title }}
        </h1>

        <p class="text-gray-600 mb-2">
          <strong>Company:</strong> {{ job.company || 'Unknown Company' }}
        </p>

        <p class="text-gray-600 mb-2">
          <strong>Location:</strong> {{ job.location || 'Not specified' }}
        </p>

        <p class="text-gray-600 mb-2">
          <strong>Job Type:</strong> {{ job.jobType }}
        </p>

        <p class="text-gray-600 mb-2">
          <strong>Experience:</strong> {{ job.experience }}
        </p>

        <p class="text-gray-700 mt-6 whitespace-pre-line">
          {{ job.description }}
        </p>

        <div class="mt-8 flex justify-between items-center">
          <span class="text-sm text-gray-500">
            Posted {{ job.postedDate }}
          </span>

          <button
            @click="openApplyModal"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Apply Now
          </button>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="text-center text-red-500">
        Job not found.
      </div>
    </div>

    <!-- Apply Modal -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4">Apply for this job</h3>

        <!-- Not logged in -->
        <div v-if="!user">
          <p class="text-gray-600 mb-4">
            You must be logged in to apply.
          </p>
          <button
            @click="goToLogin"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Login
          </button>
        </div>

        <!-- Wrong role -->
        <div v-else-if="profile?.role !== 'job_seeker'">
          <p class="text-gray-600 mb-4">
            Only job seekers can apply for jobs.
          </p>
          <button
            @click="closeApplyModal"
            class="px-4 py-2 bg-gray-400 text-white rounded-md"
          >
            Close
          </button>
        </div>

        <!-- No CV -->
        <div v-else-if="cvs.length === 0">
          <p class="text-gray-600 mb-4">
            You must upload a CV before applying.
          </p>
          <button
            @click="goToProfile"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Upload CV
          </button>
        </div>

        <!-- Apply form -->
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select CV
          </label>

          <select
            v-model="selectedCvId"
            class="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          >
            <option disabled value="">Select a CV</option>
            <option
              v-for="cv in cvs"
              :key="cv.id"
              :value="cv.id"
            >
              {{ cv.file_name }}
            </option>
          </select>

          <div class="flex justify-end space-x-2">
            <button
              @click="closeApplyModal"
              class="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>

            <button
              :disabled="!selectedCvId || applying"
              @click="submitApplication"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              {{ applying ? 'Applying...' : 'Apply' }}
            </button>
          </div>

          <p v-if="applyError" class="text-red-500 mt-3 text-sm">
            {{ applyError }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../supabaseClient';

const route = useRoute();
const router = useRouter();

const job = ref(null);
const loading = ref(true);
const error = ref(null);

const user = ref(null);
const profile = ref(null);
const cvs = ref([]);

const showApplyModal = ref(false);
const selectedCvId = ref('');
const applying = ref(false);
const applyError = ref(null);

onMounted(async () => {
  loading.value = true;

  // Load job
  const { data: jobData, error: fetchError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', route.params.id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    error.value = fetchError.message;
  } else {
    job.value = {
      id: jobData.id,
      title: jobData.title,
      company: jobData.company || 'Company',
      location: jobData.location,
      jobType: jobData.job_type || 'Full-time',
      experience: jobData.experience || 'Mid',
      description: jobData.description,
      postedDate: timeAgo(jobData.created_at),
    };
  }

  // Load user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (authUser) {
    user.value = authUser;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    profile.value = profileData;

    if (profileData?.role === 'job_seeker') {
      const { data: cvsData } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', authUser.id);

      cvs.value = cvsData || [];
    }
  }

  loading.value = false;
});

function openApplyModal() {
  showApplyModal.value = true;
}

function closeApplyModal() {
  showApplyModal.value = false;
  applyError.value = null;
}

function goToLogin() {
  router.push('/login');
}

function goToProfile() {
  router.push('/profile');
}

async function submitApplication() {
  if (!user.value || !selectedCvId.value) return;

  applying.value = true;
  applyError.value = null;

  // Prevent duplicate applications
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', job.value.id)
    .eq('job_seeker_id', user.value.id)
    .maybeSingle();

  if (existing) {
    applyError.value = 'You have already applied for this job.';
    applying.value = false;
    return;
  }

  const { error: insertError } = await supabase
    .from('applications')
    .insert({
      job_id: job.value.id,
      job_seeker_id: user.value.id,
      cv_id: selectedCvId.value,
      status: 'pending',
    });

  if (insertError) {
    applyError.value = insertError.message;
    applying.value = false;
    return;
  }

  applying.value = false;closeApplyModal();
  closeApplyModal();
  router.push({
  path: '/profile',
  query: { tab: 'applications' },
  });
}

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}
</script>
