<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">

    <!-- ================= LOADING GUARD ================= -->
    <div v-if="!profile" class="text-center text-gray-500">
      Loading profile...
    </div>

    <!-- ================= MAIN CONTENT ================= -->
    <div v-else>

      <!-- ================= JOB SEEKER TABS ================= -->
      <div
        v-if="profile.role === 'job_seeker'"
        class="flex justify-center gap-4 mb-8"
      >
        <button
          @click="activeTab = 'profile'"
          :class="tabClass('profile')"
          class="px-6 py-2 rounded"
        >
          Profile
        </button>
        <button
          @click="activeTab = 'applications'"
          :class="tabClass('applications')"
          class="px-6 py-2 rounded"
        >
          Applications
        </button>
      </div>

      <!-- ================= RECRUITER DASHBOARD ================= -->
      <div v-if="profile.role === 'recruiter'" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Recruiter Dashboard</h2>

        <!-- My Jobs -->
        <h3 class="font-semibold mb-2">My Jobs</h3>
        <table v-if="myJobs.length" class="min-w-full border mb-8">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Title</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in myJobs" :key="job.id" class="border-t">
              <td class="p-2">{{ job.title }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-gray-400 mb-8">No jobs posted yet.</p>

        <!-- Applications Received -->
        <h3 class="font-semibold mb-2">Applications Received</h3>
        <table v-if="applicants.length" class="min-w-full border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Candidate</th>
              <th class="p-2 text-left">Job</th>
              <th class="p-2 text-left">Status</th>
              <th class="p-2 text-left">CV</th>
              <th class="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applicants" :key="app.id" class="border-t">
              <td class="p-2">{{ app.candidate }}</td>
              <td class="p-2">{{ app.jobTitle }}</td>
              <td class="p-2 capitalize">{{ app.status }}</td>

              <td class="p-2">
                <a
                  v-if="app.cvUrl"
                  :href="app.cvUrl"
                  target="_blank"
                  class="text-indigo-600 underline"
                >
                  View CV
                </a>
                <span v-else class="text-gray-400 italic">No CV</span>
              </td>

              <td class="p-2">
                <div class="flex gap-2">
                  <button
                    @click="updateApplicationStatus(app.id, 'accepted')"
                    :disabled="app.status !== 'pending'"
                    class="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-40"
                  >
                    Accept
                  </button>
                  <button
                    @click="updateApplicationStatus(app.id, 'rejected')"
                    :disabled="app.status !== 'pending'"
                    class="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-gray-400">No applications yet.</p>
      </div>

      <!-- ================= PROFILE ================= -->
      <div v-if="activeTab === 'profile'">
        <h2 class="text-2xl font-bold mb-6">Profile</h2>

        <form @submit.prevent="handleUpdateProfile">

          <label class="block mb-3">
            Name
            <input v-model="name" class="input" />
          </label>

          <label class="block mb-3">
            Email
            <input v-model="email" disabled class="input bg-gray-100" />
          </label>

          <!-- Bio -->
          <label v-if="profile.role === 'job_seeker'" class="block mb-4">
            Bio
            <textarea v-model="bio" rows="3" class="input"></textarea>
          </label>

          <!-- ================= SKILLS ================= -->
          <div
            v-if="profile.role === 'job_seeker'"
            class="relative mb-6"
            ref="skillsWrapper"
          >
            <label class="block mb-1">Skills</label>

            <div
              @click.stop="skillsOpen = !skillsOpen"
              class="input cursor-pointer flex flex-wrap gap-2"
            >
              <span v-if="!selectedSkillIds.length" class="text-gray-400">
                Select skills
              </span>

              <span
                v-for="skill in selectedSkills"
                :key="skill.id"
                class="bg-indigo-100 px-2 py-1 rounded text-sm"
              >
                {{ skill.name }}
                <button
                  type="button"
                  @click.stop="removeSkill(skill.id)"
                  class="ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            </div>

            <div
              v-if="skillsOpen"
              class="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto"
            >
              <label
                v-for="skill in allSkills"
                :key="skill.id"
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  :value="skill.id"
                  v-model="selectedSkillIds"
                />
                {{ skill.name }}
              </label>
            </div>
          </div>

          <!-- ================= CV ================= -->
          <div v-if="profile.role === 'job_seeker'" class="mb-6">
            <label class="block mb-2">CV</label>
            <input type="file" @change="uploadCV" />
            <div v-if="cv" class="mt-2">
              <a :href="cvUrl" target="_blank" class="text-indigo-600 underline">
                {{ cv.file_name }}
              </a>
            </div>
          </div>

          <button
            type="submit"
            :disabled="savingProfile"
            class="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            {{ savingProfile ? 'Saving...' : 'Update Profile' }}
          </button>
        </form>

        <!-- ================= PASSWORD ================= -->
        <div class="mt-8 border-t pt-6">
          <h3 class="font-semibold mb-3">Change Password</h3>

          <input
            v-model="newPassword"
            type="password"
            placeholder="New password"
            class="input mb-2"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="input mb-2"
          />

          <p v-if="passwordError" class="text-red-600 text-sm">
            {{ passwordError }}
          </p>
          <p v-if="passwordSuccess" class="text-green-600 text-sm">
            {{ passwordSuccess }}
          </p>

          <button
            @click="changePassword"
            :disabled="changingPassword"
            class="bg-red-500 text-white px-5 py-2 rounded"
          >
            {{ changingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>

      <!-- ================= JOB SEEKER APPLICATIONS ================= -->
      <div
        v-if="profile.role === 'job_seeker' && activeTab === 'applications'"
      >
        <h2 class="text-xl font-bold mb-4">My Applications</h2>

        <table v-if="applications.length" class="min-w-full border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Job</th>
              <th class="p-2 text-left">Company</th>
              <th class="p-2 text-left">Date</th>
              <th class="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.id" class="border-t">
              <td class="p-2">{{ app.jobTitle }}</td>
              <td class="p-2">{{ app.company }}</td>
              <td class="p-2">{{ app.dateApplied }}</td>
              <td class="p-2">{{ app.status }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-gray-400">No applications yet.</p>
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

      allSkills: [],
      selectedSkillIds: [],
      skillsOpen: false,

      myJobs: [],
      applicants: [],
      applications: [],

      cv: null,
      cvUrl: null,

      savingProfile: false,

      newPassword: '',
      confirmPassword: '',
      changingPassword: false,
      passwordError: '',
      passwordSuccess: '',
    };
  },

  computed: {
    selectedSkills() {
      return this.allSkills.filter(s =>
        this.selectedSkillIds.includes(s.id)
      );
    },
  },

  async mounted() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return this.$router.push('/login');

    this.user = session.user;
    this.email = session.user.email;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    this.profile = profile;
    this.name = profile.full_name || '';
    this.bio = profile.bio || '';

    if (profile.role === 'job_seeker') {
      const { data: skills } = await supabase.from('skills').select('*');
      this.allSkills = skills || [];

      const { data: ps } = await supabase
        .from('profile_skills')
        .select('skill_id')
        .eq('profile_id', session.user.id);

      this.selectedSkillIds = ps.map(p => p.skill_id);

      const { data: cvs } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (cvs?.length) {
        this.cv = cvs[0];
        const { data } = await supabase.storage
          .from('cvs')
          .createSignedUrl(cvs[0].file_path, 3600);
        this.cvUrl = data.signedUrl;
      }

      const { data: apps } = await supabase
        .from('applications')
        .select(`id, status, applied_at, jobs(title,company)`)
        .eq('job_seeker_id', session.user.id);

      this.applications = apps.map(a => ({
        id: a.id,
        jobTitle: a.jobs.title,
        company: a.jobs.company,
        dateApplied: new Date(a.applied_at).toLocaleDateString(),
        status: a.status,
      }));
    }

    if (profile.role === 'recruiter') {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id,title')
        .eq('recruiter_id', session.user.id);

      this.myJobs = jobs || [];

      const jobIds = this.myJobs.map(j => j.id);
      if (jobIds.length) {
        const { data: apps } = await supabase
          .from('applications')
          .select(`id,status,job_id,job_seeker_id,profiles:job_seeker_id(full_name)`)
          .in('job_id', jobIds);

        this.applicants = await Promise.all(
          apps.map(async a => {
            const { data: cv } = await supabase
              .from('cvs')
              .select('*')
              .eq('user_id', a.job_seeker_id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            let cvUrl = null;
            if (cv) {
              const { data } = await supabase.storage
                .from('cvs')
                .createSignedUrl(cv.file_path, 3600);
              cvUrl = data?.signedUrl;
            }

            return {
              id: a.id,
              jobTitle: this.myJobs.find(j => j.id === a.job_id)?.title,
              candidate: a.profiles?.full_name || 'Unknown',
              status: a.status,
              cvUrl,
            };
          })
        );
      }
    }

    document.addEventListener('click', this.closeSkillsDropdown);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeSkillsDropdown);
  },

  methods: {
    tabClass(tab) {
      return this.activeTab === tab
        ? 'bg-indigo-500 text-white'
        : 'bg-gray-200';
    },

    closeSkillsDropdown(e) {
      if (this.$refs.skillsWrapper && !this.$refs.skillsWrapper.contains(e.target)) {
        this.skillsOpen = false;
      }
    },

    removeSkill(id) {
      this.selectedSkillIds = this.selectedSkillIds.filter(s => s !== id);
    },

    async handleUpdateProfile() {
      this.savingProfile = true;

      await supabase.from('profiles').update({
        full_name: this.name,
        bio: this.bio,
      }).eq('id', this.user.id);

      await supabase.from('profile_skills').delete().eq('profile_id', this.user.id);

      if (this.selectedSkillIds.length) {
        await supabase.from('profile_skills').insert(
          this.selectedSkillIds.map(id => ({
            profile_id: this.user.id,
            skill_id: id,
          }))
        );
      }

      this.savingProfile = false;
    },

    async uploadCV(e) {
      const file = e.target.files[0];
      if (!file) return;

      const path = `${this.user.id}/${Date.now()}-${file.name}`;

      await supabase.storage.from('cvs').upload(path, file, { upsert: true });
      await supabase.from('cvs').insert({
        user_id: this.user.id,
        file_name: file.name,
        file_path: path,
      });

      const { data } = await supabase.storage
        .from('cvs')
        .createSignedUrl(path, 3600);

      this.cv = { file_name: file.name };
      this.cvUrl = data.signedUrl;
    },

    async changePassword() {
      this.passwordError = '';
      this.passwordSuccess = '';
      this.changingPassword = true;

      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match';
        this.changingPassword = false;
        return;
      }

      await supabase.auth.updateUser({ password: this.newPassword });

      this.passwordSuccess = 'Password updated successfully';
      this.newPassword = '';
      this.confirmPassword = '';
      this.changingPassword = false;
    },

    async updateApplicationStatus(id, status) {
      await supabase.from('applications').update({ status }).eq('id', id);

      await supabase.functions.invoke('send-application-status-email', {
        body: { application_id: id, status },
      });

      this.applicants = this.applicants.map(a =>
        a.id === id ? { ...a, status } : a
      );
    },
  },
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
</style>
