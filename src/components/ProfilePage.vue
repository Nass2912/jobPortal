<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
    <div class="px-6 py-8">

      <!-- Tabs (job seekers only) -->
      <div
        v-if="profile?.role === 'job_seeker'"
        class="flex justify-center space-x-4 mb-6"
      >
        <button
          type="button"
          @click="setActiveTab('profile')"
          :class="tabClass('profile')"
          class="px-6 py-2 rounded-lg font-medium"
        >
          User Profile
        </button>

        <button
          type="button"
          @click="setActiveTab('applications')"
          :class="tabClass('applications')"
          class="px-6 py-2 rounded-lg font-medium"
        >
          Applications
        </button>
      </div>

      <hr v-if="profile?.role === 'job_seeker'" class="my-6 border-gray-200" />

      <!-- Loading -->
      <div v-if="!user || !profile" class="text-center text-gray-500 py-8">
        Loading profile...
      </div>

      <!-- PROFILE PANEL -->
      <div
        v-if="profile && (profile.role === 'recruiter' || activeTab === 'profile')"
      >
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          Profile
        </h2>

        <form @submit.prevent="handleUpdateProfile">
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              v-model="name"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              v-model="email"
              disabled
              class="w-full px-3 py-2 border bg-gray-100 rounded-md"
            />
          </div>

          <!-- Bio (job seekers only) -->
          <div v-if="profile.role === 'job_seeker'" class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              v-model="bio"
              rows="4"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <!-- Skills (job seekers only) -->
          <div v-if="profile.role === 'job_seeker'" class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Skills
            </label>

            <div class="flex items-center space-x-2 mb-3">
              <input
                type="text"
                v-model="newSkill"
                placeholder="Enter skill"
                class="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                @click="addSkill"
                :disabled="!newSkill"
                class="bg-indigo-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(skill, index) in skills"
                :key="index"
                class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
              >
                <span>{{ skill }}</span>
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="text-red-500 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Save -->
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
              Update Profile
            </button>
          </div>
        </form>

        <!-- CV Upload (job seekers only) -->
        <div
          v-if="profile.role === 'job_seeker'"
          class="mt-6 border-t pt-4"
        >
          <h3 class="font-bold mb-2">Upload CV</h3>

          <input type="file" @change="uploadCV" />

          <div v-if="cv" class="mt-3 text-sm">
            <strong>Current CV:</strong>
            <a
              :href="cvUrl"
              target="_blank"
              class="text-indigo-600 underline ml-2"
            >
              {{ cv.file_name }}
            </a>
          </div>
        </div>
      </div>

      <!-- APPLICATIONS PANEL (job seekers only) -->
      <div
        v-if="profile?.role === 'job_seeker' && activeTab === 'applications'"
        class="mt-6"
      >
        <h2 class="text-xl font-bold mb-4">My Applications</h2>

        <table class="min-w-full bg-white border rounded-md shadow-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-600 uppercase text-sm">
              <th class="py-3 px-6 text-left">Job</th>
              <th class="py-3 px-6 text-left">Company</th>
              <th class="py-3 px-6 text-left">Date</th>
              <th class="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="app in applications"
              :key="app.id"
              class="border-b"
            >
              <td class="py-3 px-6">{{ app.jobTitle }}</td>
              <td class="py-3 px-6">{{ app.company }}</td>
              <td class="py-3 px-6">{{ app.dateApplied }}</td>
              <td class="py-3 px-6">{{ app.status }}</td>
            </tr>

            <tr v-if="applications.length === 0">
              <td colspan="4" class="text-center py-4 text-gray-500">
                No applications yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recruiter actions -->
      <div
        v-if="profile?.role === 'recruiter'"
        class="flex justify-end mb-6"
      >
        <button
          @click="$router.push('/post-job')"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          + Post New Job
        </button>
      </div>

      <!-- APPLICANTS (recruiters only) -->
      <div
        v-if="profile?.role === 'recruiter'"
        class="mt-10"
      >
        <h2 class="text-xl font-bold mb-4">Applicants</h2>

        <table class="min-w-full bg-white border rounded-md shadow-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-600 uppercase text-sm">
              <th class="py-3 px-6 text-left">Candidate</th>
              <th class="py-3 px-6 text-left">Job</th>
              <th class="py-3 px-6 text-left">Status</th>
              <th class="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="app in applicants"
              :key="app.id"
              class="border-b"
            >
              <td class="py-3 px-6">{{ app.candidate }}</td>
              <td class="py-3 px-6">{{ app.jobTitle }}</td>
              <td class="py-3 px-6">{{ app.status }}</td>
              <td class="py-3 px-6 space-x-2">
                <button
                  @click="updateApplicationStatus(app.id, 'accepted')"
                  class="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  @click="updateApplicationStatus(app.id, 'rejected')"
                  class="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>

            <tr v-if="applicants.length === 0">
              <td colspan="4" class="text-center py-4 text-gray-500">
                No applicants yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import { supabase } from '../supabaseClient';

export default {
  data() {
    return {
      user: null,
      profile: null,

      activeTab: 'profile',

      name: '',
      email: '',
      bio: '',
      skills: [],
      newSkill: '',

      applications: [],
      applicants: [],

      cv: null,
      cvUrl: null,
    };
  },

  async mounted() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      this.$router.push('/login');
      return;
    }

    this.user = session.user;
    this.email = session.user.email;

    // Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', this.user.id)
      .single();

    this.profile = profile;
    this.name = profile.full_name || '';
    this.bio = profile.bio || '';
    this.skills = profile.skills || [];

    // Job seeker applications
    if (profile.role === 'job_seeker') {
      const { data: apps } = await supabase
        .from('applications')
        .select('id,status,applied_at,jobs(title,company)')
        .eq('job_seeker_id', this.user.id)
        .order('applied_at', { ascending: false });

      this.applications = (apps || []).map(a => ({
        id: a.id,
        jobTitle: a.jobs?.title || 'Unknown',
        company: a.jobs?.company || 'Unknown',
        dateApplied: new Date(a.applied_at).toLocaleDateString(),
        status: a.status,
      }));
    }

    // Recruiter applicants
    if (profile.role === 'recruiter') {
      const { data: apps } = await supabase
        .from('applications')
        .select('id,status,jobs(title),profiles(full_name)')
        .eq('jobs.recruiter_id', this.user.id);

      this.applicants = (apps || []).map(a => ({
        id: a.id,
        jobTitle: a.jobs?.title || 'Unknown',
        candidate: a.profiles?.full_name || 'Unknown',
        status: a.status,
      }));
    }

    // CV
    if (profile.role === 'job_seeker') {
      const { data: cvs } = await supabase
        .from('cvs')
        .select('file_name,file_path')
        .eq('user_id', this.user.id)
        .maybeSingle();

      if (cvs) {
        this.cv = cvs;
        const { data: url } = supabase.storage
          .from('cvs')
          .getPublicUrl(cvs.file_path);

        this.cvUrl = url.publicUrl;
      }
    }
  },

  methods: {
    tabClass(tab) {
      return this.activeTab === tab
        ? 'bg-indigo-500 text-white'
        : 'bg-gray-200 text-gray-800';
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    addSkill() {
      if (!this.newSkill) return;
      this.skills.push(this.newSkill);
      this.newSkill = '';
    },

    removeSkill(index) {
      this.skills.splice(index, 1);
    },

    async handleUpdateProfile() {
      const payload = { full_name: this.name };

      if (this.profile.role === 'job_seeker') {
        payload.bio = this.bio;
        payload.skills = this.skills;
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', this.user.id);

      if (error) {
        alert(error.message);
        return;
      }

      alert('Profile updated');
    },

    async uploadCV(e) {
      const file = e.target.files[0];
      if (!file) return;

      const path = `${this.user.id}/${file.name}`;

      await supabase.storage.from('cvs').upload(path, file, { upsert: true });

      await supabase.from('cvs').upsert({
        user_id: this.user.id,
        file_name: file.name,
        file_path: path,
      });

      const { data: url } = supabase.storage.from('cvs').getPublicUrl(path);

      this.cv = { file_name: file.name };
      this.cvUrl = url.publicUrl;

      alert('CV uploaded');
    },

    async updateApplicationStatus(appId, status) {
      await supabase
        .from('applications')
        .update({ status })
        .eq('id', appId);

      this.applicants = this.applicants.map(a =>
        a.id === appId ? { ...a, status } : a
      );
    },
  },
};
</script>
