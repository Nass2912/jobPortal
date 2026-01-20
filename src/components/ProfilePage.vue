<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
    <div class="px-6 py-8">

      <!-- Tabs (job seekers only) -->
      <div v-if="profile?.role === 'job_seeker'" class="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          @click="setActiveTab('profile')"
          :class="tabClass('profile')"
          class="px-6 py-2 rounded-lg font-medium"
        >User Profile</button>

        <button
          type="button"
          @click="setActiveTab('applications')"
          :class="tabClass('applications')"
          class="px-6 py-2 rounded-lg font-medium"
        >Applications</button>
      </div>

      <!-- Loading -->
      <div v-if="!user || !profile" class="text-center text-gray-500 py-8">
        Loading profile...
      </div>

      <!-- ================= PROFILE PANEL ================= -->
      <div v-if="profile && (profile.role === 'recruiter' || activeTab === 'profile')">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Profile</h2>

        <form @submit.prevent="handleUpdateProfile">
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" v-model="name" required class="w-full px-3 py-2 border rounded-md" />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" v-model="email" disabled class="w-full px-3 py-2 border bg-gray-100 rounded-md" />
          </div>

          <!-- Bio (job seekers only) -->
          <div v-if="profile.role === 'job_seeker'" class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
            <textarea v-model="bio" rows="4" class="w-full px-3 py-2 border rounded-md"></textarea>
          </div>

          <!-- Skills (job seekers only) -->
          <div v-if="profile.role === 'job_seeker'" class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Skills</label>

            <div class="flex items-center space-x-2 mb-3">
              <input type="text" v-model="newSkill" placeholder="Enter skill" class="w-full px-3 py-2 border rounded-md" />
              <button type="button" @click="addSkill" :disabled="!newSkill" class="bg-indigo-500 text-white px-4 py-2 rounded-md disabled:opacity-50">Add</button>
            </div>

            <div class="space-y-2">
              <div v-for="(skill, index) in skills" :key="index" class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                <span>{{ skill }}</span>
                <button type="button" @click="removeSkill(index)" class="text-red-500 text-lg font-bold">×</button>
              </div>
            </div>
          </div>

          <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">Update Profile</button>
        </form>

        <!-- CV Upload (job seekers only) -->
        <div v-if="profile.role === 'job_seeker'" class="mt-6 border-t pt-4">
          <h3 class="font-bold mb-2">Upload CV</h3>
          <input type="file" @change="uploadCV" />

          <div v-if="cv" class="mt-3 text-sm">
            <strong>Current CV:</strong>
            <a :href="cvUrl" target="_blank" class="text-indigo-600 underline ml-2">{{ cv.file_name }}</a>
          </div>
        </div>
      </div>

      <!-- ================= APPLICATIONS PANEL (JOB SEEKER) ================= -->
      <div v-if="profile?.role === 'job_seeker' && activeTab === 'applications'" class="mt-10">
        <h2 class="text-xl font-bold mb-4">My Applications</h2>

        <!-- Desktop table -->
        <div class="hidden md:block">
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
              <tr v-for="app in applications" :key="app.id" class="border-b">
                <td class="py-3 px-6">{{ app.jobTitle }}</td>
                <td class="py-3 px-6">{{ app.company }}</td>
                <td class="py-3 px-6">{{ app.dateApplied }}</td>
                <td class="py-3 px-6">
                  <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    :class="{
                      'bg-yellow-100 text-yellow-700': app.status === 'pending',
                      'bg-green-100 text-green-700': app.status === 'accepted',
                      'bg-red-100 text-red-700': app.status === 'rejected'
                    }">
                    {{ app.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="applications.length === 0">
                <td colspan="4" class="text-center py-4 text-gray-500">No applications yet</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-4">
          <div v-for="app in applications" :key="app.id" class="border rounded-lg p-4 shadow-sm bg-white">
            <p class="text-sm text-gray-500">Job</p>
            <p class="font-semibold">{{ app.jobTitle }}</p>

            <p class="text-sm text-gray-500 mt-2">Company</p>
            <p>{{ app.company }}</p>

            <p class="text-sm text-gray-500 mt-2">Date</p>
            <p>{{ app.dateApplied }}</p>

            <p class="text-sm text-gray-500 mt-2">Status</p>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-yellow-100 text-yellow-700': app.status === 'pending',
                'bg-green-100 text-green-700': app.status === 'accepted',
                'bg-red-100 text-red-700': app.status === 'rejected'
              }">
              {{ app.status }}
            </span>
          </div>

          <div v-if="applications.length === 0" class="text-center py-6 text-gray-500">
            No applications yet
          </div>
        </div>
      </div>

      <!-- ================= RECRUITER DASHBOARD ================= -->
      <div v-if="profile?.role === 'recruiter'" class="mt-10">

        <!-- Post Job -->
        <div class="flex justify-end mb-6">
          <button @click="$router.push('/post-job')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            + Post New Job
          </button>
        </div>

        <!-- ================= MY JOBS ================= -->
        <h2 class="text-xl font-bold mb-4">My Jobs</h2>

        <!-- Desktop table -->
        <div class="hidden md:block">
          <table class="min-w-full bg-white border rounded-md shadow-sm mb-10">
            <thead>
              <tr class="bg-gray-100 text-gray-600 uppercase text-sm">
                <th class="py-3 px-6 text-left">Title</th>
                <th class="py-3 px-6 text-left">Company</th>
                <th class="py-3 px-6 text-left">Applicants</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in myJobs" :key="job.id" class="border-b">
                <td class="py-3 px-6">{{ job.title }}</td>
                <td class="py-3 px-6">{{ job.company }}</td>
                <td class="py-3 px-6">{{ job.applicantCount }}</td>
              </tr>
              <tr v-if="myJobs.length === 0">
                <td colspan="3" class="text-center py-4 text-gray-500">No jobs posted yet</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-4 mb-10">
          <div v-for="job in myJobs" :key="job.id" class="border rounded-lg p-4 shadow-sm bg-white">
            <p class="text-sm text-gray-500">Title</p>
            <p class="font-semibold">{{ job.title }}</p>

            <p class="text-sm text-gray-500 mt-2">Company</p>
            <p>{{ job.company }}</p>

            <p class="text-sm text-gray-500 mt-2">Applicants</p>
            <p class="font-semibold">{{ job.applicantCount }}</p>
          </div>

          <div v-if="myJobs.length === 0" class="text-center py-6 text-gray-500">
            No jobs posted yet
          </div>
        </div>

        <!-- ================= APPLICATIONS RECEIVED ================= -->
        <h2 class="text-xl font-bold mb-4">Applications Received</h2>

        <!-- Desktop table -->
        <div class="hidden md:block">
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
              <tr v-for="app in applicants" :key="app.id" class="border-b">
                <td class="py-3 px-6">{{ app.candidate }}</td>
                <td class="py-3 px-6">{{ app.jobTitle }}</td>
                <td class="py-3 px-6">
                  <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    :class="{
                      'bg-yellow-100 text-yellow-700': app.status === 'pending',
                      'bg-green-100 text-green-700': app.status === 'accepted',
                      'bg-red-100 text-red-700': app.status === 'rejected'
                    }">
                    {{ app.status }}
                  </span>
                </td>
                <td class="py-3 px-6 space-x-2">
                  <button @click="updateApplicationStatus(app.id, 'accepted')" :disabled="app.status !== 'pending'"
                    class="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-40">Accept</button>
                  <button @click="updateApplicationStatus(app.id, 'rejected')" :disabled="app.status !== 'pending'"
                    class="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40">Reject</button>
                </td>
              </tr>
              <tr v-if="applicants.length === 0">
                <td colspan="4" class="text-center py-4 text-gray-500">No applicants yet</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-4">
          <div v-for="app in applicants" :key="app.id" class="border rounded-lg p-4 shadow-sm bg-white">
            <p class="text-sm text-gray-500">Candidate</p>
            <p class="font-semibold">{{ app.candidate }}</p>

            <p class="text-sm text-gray-500 mt-2">Job</p>
            <p>{{ app.jobTitle }}</p>

            <p class="text-sm text-gray-500 mt-2">Status</p>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-yellow-100 text-yellow-700': app.status === 'pending',
                'bg-green-100 text-green-700': app.status === 'accepted',
                'bg-red-100 text-red-700': app.status === 'rejected'
              }">
              {{ app.status }}
            </span>

            <div class="flex space-x-3 mt-3">
              <button @click="updateApplicationStatus(app.id, 'accepted')" :disabled="app.status !== 'pending'"
                class="flex-1 bg-green-500 text-white py-2 rounded disabled:opacity-40">Accept</button>
              <button @click="updateApplicationStatus(app.id, 'rejected')" :disabled="app.status !== 'pending'"
                class="flex-1 bg-red-500 text-white py-2 rounded disabled:opacity-40">Reject</button>
            </div>
          </div>

          <div v-if="applicants.length === 0" class="text-center py-6 text-gray-500">
            No applicants yet
          </div>
        </div>
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
      myJobs: [],
      cv: null,
      cvUrl: null,
    };
  },

  async mounted() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { this.$router.push('/login'); return; }

    this.user = session.user;
    this.email = session.user.email;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', this.user.id)
      .single();

    this.profile = profile;
    this.name = profile.full_name || '';
    this.bio = profile.bio || '';
    this.skills = profile.skills || [];

    if (profile.role === 'job_seeker') {
      const { data: apps } = await supabase
        .from('applications')
        .select(`id,status,applied_at,jobs:job_id(id,title,company)`)
        .eq('job_seeker_id', this.user.id)
        .order('applied_at', { ascending: false });

      this.applications = (apps || []).map(a => ({
        id: a.id,
        jobTitle: a.jobs?.title || 'Unknown job',
        company: a.jobs?.company || 'Unknown company',
        dateApplied: new Date(a.applied_at).toLocaleDateString(),
        status: a.status,
      }));

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

    if (profile.role === 'recruiter') {
      const { data: jobs } = await supabase
        .from('jobs')
        .select(`id,title,company,applications(id)`)
        .eq('recruiter_id', this.user.id);

      this.myJobs = (jobs || []).map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        applicantCount: j.applications?.length || 0,
      }));

      const { data: apps } = await supabase
        .from('applications')
        .select(`id,status,jobs:job_id(id,title,recruiter_id),profiles:job_seeker_id(id,full_name)`)
        .order('applied_at', { ascending: false });

      this.applicants = (apps || [])
        .filter(a => a.jobs?.recruiter_id === this.user.id)
        .map(a => ({
          id: a.id,
          jobTitle: a.jobs?.title || 'Unknown job',
          candidate: a.profiles?.full_name || 'Unknown',
          status: a.status,
        }));
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

      if (error) return alert(error.message);
      alert('Profile updated');
    },

    async uploadCV(e) {
      const file = e.target.files[0];
      if (!file) return;

      const path = `${this.user.id}/${file.name}`;

      await supabase.storage
        .from('cvs')
        .upload(path, file, { upsert: true });

      await supabase
        .from('cvs')
        .upsert({
          user_id: this.user.id,
          file_name: file.name,
          file_path: path,
        });

      const { data: url } = supabase.storage
        .from('cvs')
        .getPublicUrl(path);

      this.cv = { file_name: file.name };
      this.cvUrl = url.publicUrl;

      alert('CV uploaded');
    },

    async updateApplicationStatus(appId, status) {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', appId);

      if (error) return alert('Failed to update status');

      this.applicants = this.applicants.map(a =>
        a.id === appId ? { ...a, status } : a
      );

      alert(`Application ${status}`);
    },
  },
};
</script>