<template>
  <div class="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-center">
      Post a New Job
    </h2>

    <form @submit.prevent="handlePostJob">

      <!-- Title -->
      <div class="mb-4">
        <label class="block font-bold mb-1">Title</label>
        <input v-model="title" required class="input" />
      </div>

      <!-- Company -->
      <div class="mb-4">
        <label class="block font-bold mb-1">Company</label>
        <input v-model="company" required class="input" />
      </div>

      <!-- Location -->
      <div class="mb-4">
        <label class="block font-bold mb-1">Location</label>
        <input v-model="location" required class="input" />
      </div>

      <!-- Job Type -->
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

      <!-- Experience -->
      <div class="mb-4">
        <label class="block font-bold mb-1">Experience</label>
        <select v-model="experience" required class="input">
          <option value="">Select</option>
          <option>Entry</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>
      </div>

      <!-- Description -->
      <div class="mb-6">
        <label class="block font-bold mb-1">Description</label>
        <textarea
          v-model="description"
          rows="5"
          required
          class="input"
        ></textarea>
      </div>

      <!-- ================= REQUIRED SKILLS (MULTISELECT DROPDOWN) ================= -->
      <div class="mb-6 relative" ref="skillsWrapper">
        <label class="block font-bold mb-2">Required Skills</label>

        <!-- Trigger -->
        <div
          @click.stop="skillsOpen = !skillsOpen"
          class="w-full min-h-[44px] px-3 py-2 border rounded-md cursor-pointer
                 flex flex-wrap gap-2 items-center"
        >
          <span v-if="!selectedSkillIds.length" class="text-gray-400 text-sm">
            Select required skills
          </span>

          <span
            v-for="skill in selectedSkills"
            :key="skill.id"
            class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded
                   flex items-center gap-1"
          >
            {{ skill.name }}
            <button
              type="button"
              @click.stop="removeSkill(skill.id)"
              class="font-bold"
            >
              ×
            </button>
          </span>
        </div>

        <!-- Dropdown -->
        <div
          v-if="skillsOpen"
          class="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto
                 bg-white border rounded-md shadow-lg"
        >
          <label
            v-for="skill in skills"
            :key="skill.id"
            class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              :value="skill.id"
              v-model="selectedSkillIds"
              @click.stop
            />
            <span class="text-sm">{{ skill.name }}</span>
          </label>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded
               disabled:opacity-50 w-full"
      >
        {{ loading ? 'Posting…' : 'Post Job' }}
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
      selectedSkillIds: [],
      skillsOpen: false,
    };
  },

  computed: {
    selectedSkills() {
      return this.skills.filter(s =>
        this.selectedSkillIds.includes(s.id)
      );
    },
  },

  async mounted() {
    // Fetch skills
    const { data: skills } = await supabase
      .from('skills')
      .select('id, name')
      .order('name');

    this.skills = skills || [];

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      this.$router.push('/login');
      return;
    }

    // Role check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'recruiter') {
      this.$router.push('/');
      return;
    }

    document.addEventListener('click', this.closeSkillsDropdown);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeSkillsDropdown);
  },

  methods: {
    closeSkillsDropdown(e) {
      const el = this.$refs.skillsWrapper;
      if (el && !el.contains(e.target)) {
        this.skillsOpen = false;
      }
    },

    removeSkill(id) {
      this.selectedSkillIds = this.selectedSkillIds.filter(s => s !== id);
    },

    async handlePostJob() {
      this.loading = true;

      const { data: { session } } = await supabase.auth.getSession();

      // 1️⃣ Create job
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
        console.error(error);
        return;
      }

      // 2️⃣ Attach skills
      if (this.selectedSkillIds.length) {
        const rows = this.selectedSkillIds.map(skillId => ({
          job_id: job.id,
          skill_id: skillId,
        }));

        await supabase.from('job_skills').insert(rows);
        await supabase.functions.invoke(
          'send-job-match-emails',
          {
            body: { job_id: job.id }
          }
        );
      }

      this.loading = false;
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
