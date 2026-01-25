<template>
  <div class="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-center">
      Post a New Job
    </h2>

    <form @submit.prevent="handlePostJob">
      <div class="mb-4">
        <label class="block font-bold mb-1">Title</label>
        <input v-model="title" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block font-bold mb-1">Company</label>
        <input v-model="company" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block font-bold mb-1">Location</label>
        <input v-model="location" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block font-bold mb-1">Job Type</label>
        <select v-model="jobType" required class="input">
          <option value="">Select</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block font-bold mb-1">Experience</label>
        <select v-model="experience" required class="input">
          <option value="">Select</option>
          <option>Entry</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block font-bold mb-1">Description</label>
        <textarea v-model="description" rows="5" required class="input"></textarea>
      </div>

      <!-- ================= REQUIRED SKILLS ================= -->
      <div class="mt-6">
        <label class="block text-gray-700 font-bold mb-2">
          Required Skills
        </label>

        <div class="grid grid-cols-2 gap-2">
          <label v-for="skill in skills" :key="skill.id" class="flex items-center space-x-2">
            <input type="checkbox" :value="skill.id" v-model="selectedSkills" />
            <span>{{ skill.name }}</span>
          </label>
        </div>
      </div>


      <button type="submit" :disabled="loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded disabled:opacity-50">
        {{ loading ? 'Posting...' : 'Post Job' }}
      </button>
    </form>
  </div>
</template>

<script>
import { supabase } from '../supabaseClient';

export default {
  data() {
    return {
      title: '',
      company: '',
      location: '',
      jobType: '',
      experience: '',
      description: '',
      loading: false,
      skills: [],
      selectedSkills: [],
    };
  },

  async mounted() {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('name');

    this.skills = data || [];
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      this.$router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'recruiter') {
      alert('Only recruiters can post jobs.');
      this.$router.push('/');
    }
  },

  methods: {
    async handlePostJob() {
      this.loading = true;

      const { data: { session } } = await supabase.auth.getSession();

      // 1️⃣ Insert job AND get it back
      const { data: job, error } = await supabase
        .from('jobs')
        .insert({
          title: this.title,
          company: this.company,
          location: this.location,
          job_type: this.jobType,
          experience: this.experience,
          description: this.description,
          recruiter_id: session.user.id,
        })
        .select()
        .single();

      if (error) {
        this.loading = false;
        alert(error.message);
        return;
      }

      // 2️⃣ Insert job skills using returned job.id
      if (this.selectedSkills.length) {
        const rows = this.selectedSkills.map(skillId => ({
          job_id: job.id,
          skill_id: skillId,
        }));

        const { error: skillsError } = await supabase
          .from('job_skills')
          .insert(rows);

        if (skillsError) {
          console.error(skillsError);
          alert('Job created, but skills failed to save');
        }
      }

      this.loading = false;

      alert('Job posted successfully!');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
</style>
