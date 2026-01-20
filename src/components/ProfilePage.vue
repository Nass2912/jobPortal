<template>
  <div class="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
    <div class="px-6 py-8">
      <!-- Tab Navigation -->
      <div class="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          @click="setActiveTab('profile')"
          :class="{
            'bg-indigo-500 text-white': activeTab === 'profile',
            'bg-gray-200 text-gray-800': activeTab !== 'profile'
          }"
          class="px-6 py-2 rounded-lg font-medium focus:outline-none"
        >
          User Profile
        </button>

        <button
          type="button"
          @click="setActiveTab('applications')"
          :class="{
            'bg-indigo-500 text-white': activeTab === 'applications',
            'bg-gray-200 text-gray-800': activeTab !== 'applications'
          }"
          class="px-6 py-2 rounded-lg font-medium focus:outline-none"
        >
          Applications
        </button>
      </div>

      <!-- User Profile Tab -->
      <div v-if="activeTab === 'profile'">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          User Profile
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              required
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
              class="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md"
            />
          </div>

          <!-- Bio -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              v-model="bio"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <!-- Skills -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Skills
            </label>

            <div class="flex space-x-2 mb-4">
              <button
                type="button"
                @click="setSkillTab('addSkill')"
                :class="{
                  'bg-indigo-500 text-white': skillTab === 'addSkill',
                  'bg-gray-200': skillTab !== 'addSkill'
                }"
                class="px-4 py-2 rounded-md focus:outline-none"
              >
                Add Skill
              </button>

              <button
                type="button"
                @click="setSkillTab('listSkills')"
                :class="{
                  'bg-indigo-500 text-white': skillTab === 'listSkills',
                  'bg-gray-200': skillTab !== 'listSkills'
                }"
                class="px-4 py-2 rounded-md focus:outline-none"
              >
                List Skills
              </button>
            </div>

            <div v-if="skillTab === 'addSkill'">
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="newSkill"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  placeholder="Enter skill"
                />
                <button
                  type="button"
                  @click="addSkill"
                  :disabled="!newSkill"
                  class="bg-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            <div v-if="skillTab === 'listSkills'">
              <div class="space-y-2">
                <div
                  v-for="(skill, index) in skills"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <span class="text-sm font-medium text-gray-700">
                    {{ skill }}
                  </span>
                  <button
                    type="button"
                    @click="removeSkill(index)"
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CV Upload (job seekers only) -->
          <div
            v-if="profile?.role === 'job_seeker'"
            class="mb-6 border-t pt-4"
          >
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Upload CV
            </label>

            <input
              type="file"
              @change="onCvSelected"
              accept=".pdf,.doc,.docx"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            />

            <p v-if="selectedCvName" class="text-sm text-gray-600 mt-1">
              Selected file: {{ selectedCvName }}
            </p>

            <!-- Uploaded CVs List -->
            <div v-if="uploadedCvs.length" class="mt-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">Your CVs</p>
              <ul class="space-y-1">
                <li
                  v-for="cv in uploadedCvs"
                  :key="cv.id"
                  class="flex items-center justify-between bg-gray-50 border rounded-md px-3 py-2"
                >
                  <span class="text-sm text-gray-700">{{ cv.file_name }}</span>
                  <span class="text-xs text-gray-500">{{ cv.created_at }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Save -->
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <!-- Applications Tab -->
      <div v-if="activeTab === 'applications'">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">
          Applications
        </h2>

        <table class="min-w-full bg-white border rounded-md shadow-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">Job Title</th>
              <th class="py-3 px-6 text-left">Company</th>
              <th class="py-3 px-6 text-left">Date Applied</th>
              <th class="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>

          <tbody class="text-gray-700 text-sm">
            <tr
              v-for="(application, index) in applications"
              :key="index"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-3 px-6">{{ application.jobTitle }}</td>
              <td class="py-3 px-6">{{ application.company }}</td>
              <td class="py-3 px-6">{{ application.dateApplied }}</td>
              <td class="py-3 px-6">
                <span
                  :class="{
                    'text-green-500 font-bold':
                      application.status === 'Accepted',
                    'text-red-500 font-bold':
                      application.status === 'Rejected',
                    'text-yellow-500 font-bold':
                      application.status === 'Pending'
                  }"
                >
                  {{ application.status }}
                </span>
              </td>
            </tr>

            <tr v-if="applications.length === 0">
              <td colspan="4" class="text-center py-4 text-gray-500">
                No applications yet
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
      skillTab: 'addSkill',

      name: '',
      email: '',
      bio: '',

      skills: [],
      newSkill: '',

      applications: [],
      error: null,

      // CV upload state
      selectedCvFile: null,
      selectedCvName: '',

      // Uploaded CVs list
      uploadedCvs: [],
    };
  },

  async mounted() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      this.$router.push('/login');
      return;
    }

    this.user = user;
    this.email = user.email;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      this.error = error.message;
      return;
    }

    this.profile = profile;
    this.name = profile.full_name || '';
    this.bio = profile.bio || '';
    this.skills = profile.skills || [];

    // Auto-open Applications tab after redirect
    if (this.$route.query.tab === 'applications') {
      this.activeTab = 'applications';
    }

    // Load uploaded CVs
    await this.loadCvs();

    // Load real applications from Supabase
    const { data: applicationsData, error: appsError } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        jobs (
          id,
          title,
          company
        )
      `)
      .eq('job_seeker_id', user.id)
      .order('applied_at', { ascending: false });

    if (appsError) {
      console.error(appsError);
    } else {
      this.applications = (applicationsData || []).map((app) => ({
        id: app.id,
        jobTitle: app.jobs?.title || 'Unknown job',
        company: app.jobs?.company || 'Unknown company',
        dateApplied: new Date(app.applied_at).toLocaleDateString(),
        status: this.capitalize(app.status),
      }));
    }
  },

  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },

    setSkillTab(tab) {
      this.skillTab = tab;
    },

    addSkill() {
      if (!this.newSkill) return;
      this.skills.push(this.newSkill);
      this.newSkill = '';
    },

    removeSkill(index) {
      this.skills.splice(index, 1);
    },

    capitalize(text) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
    },

    onCvSelected(e) {
      const file = e.target.files[0];
      if (!file) return;

      this.selectedCvFile = file;
      this.selectedCvName = file.name;
    },

    async loadCvs() {
      const { data, error } = await supabase
        .from('cvs')
        .select('id, file_name, created_at')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        this.uploadedCvs = (data || []).map((cv) => ({
          id: cv.id,
          file_name: cv.file_name,
          created_at: new Date(cv.created_at).toLocaleDateString(),
        }));
      }
    },

    async handleUpdateProfile() {
      // 1) Update profile fields
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: this.name,
          bio: this.bio,
          skills: this.skills,
        })
        .eq('id', this.user.id);

      if (profileError) {
        alert(profileError.message);
        return;
      }

      // 2) Upload CV if selected
      if (this.selectedCvFile) {
        const filePath = `${this.user.id}/${Date.now()}-${this.selectedCvFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, this.selectedCvFile, { upsert: true });

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        const { error: insertError } = await supabase.from('cvs').insert({
          user_id: this.user.id,
          file_path: filePath,
          file_name: this.selectedCvFile.name,
        });

        if (insertError) {
          alert(insertError.message);
          return;
        }

        // Reset CV state
        this.selectedCvFile = null;
        this.selectedCvName = '';

        // Reload CV list
        await this.loadCvs();
      }

      alert('Profile updated successfully');
    },
  },
};
</script>
