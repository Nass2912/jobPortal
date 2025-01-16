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
				<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">User Profile</h2>
				<form @submit.prevent="handleUpdateProfile">
					<!-- Name Field -->
					<div class="mb-4">
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
						<input
							type="text"
							id="name"
							v-model="name"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
							required
						/>
					</div>

					<!-- Email Field -->
					<div class="mb-4">
						<label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
						<input
							type="email"
							id="email"
							v-model="email"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
							required
						/>
					</div>

					<!-- Bio Field -->
					<div class="mb-6">
						<label for="bio" class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
						<textarea
							id="bio"
							v-model="bio"
							rows="4"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
						></textarea>
					</div>

					<!-- Skills Tab/Card System -->
					<div class="mb-6">
						<label for="skills" class="block text-gray-700 text-sm font-bold mb-2">Skills</label>
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
						<!-- Add Skill -->
						<div v-if="skillTab === 'addSkill'">
							<div class="flex items-center space-x-2">
								<input
									type="text"
									v-model="newSkill"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
									placeholder="Enter skill"
								/>
								<button
									@click="addSkill"
									:disabled="!newSkill"
									class="bg-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
								>
									Add
								</button>
							</div>
						</div>
						<!-- List Skills -->
						<div v-if="skillTab === 'listSkills'">
							<div class="space-y-2">
								<div v-for="(skill, index) in skills" :key="index" class="flex items-center space-x-2">
									<span class="text-sm font-medium text-gray-700">{{ skill }}</span>
									<button @click="removeSkill(index)" class="text-red-500 hover:text-red-700 focus:outline-none">Remove</button>
								</div>
							</div>
						</div>
					</div>
					<!-- Save Button -->
					<div class="flex items-center justify-between">
						<button
							type="submit"
							class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Update Profile
						</button>
					</div>
				</form>
			</div>

			<!-- Applications Tab -->
			<div v-if="activeTab === 'applications'">
				<h2 class="text-2xl font-bold text-center text-gray-800 mb-4">Applications</h2>
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
						<tr v-for="(application, index) in applications" :key="index" class="border-b hover:bg-gray-50">
							<td class="py-3 px-6">{{ application.jobTitle }}</td>
							<td class="py-3 px-6">{{ application.company }}</td>
							<td class="py-3 px-6">{{ application.dateApplied }}</td>
							<td class="py-3 px-6">
								<span
									:class="{
										'text-green-500 font-bold': application.status === 'Accepted',
										'text-red-500 font-bold': application.status === 'Rejected',
										'text-yellow-500 font-bold': application.status === 'Pending'
									}"
								>
									{{ application.status }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State variables
const activeTab = ref('profile'); // Default tab
const skillTab = ref('addSkill'); // Default skill tab
const name = ref('');
const email = ref('');
const bio = ref('');
const phone = ref('');
const location = ref('');
const skills = ref([]);
const newSkill = ref('');
const applications = ref([]);

// Mock data
onMounted(() => {
	name.value = 'John Doe';
	email.value = 'john@example.com';
	bio.value = 'I am a software developer.';
	phone.value = '123-456-7890';
	location.value = 'New York, USA';
	skills.value = ['JavaScript', 'Vue.js', 'Node.js'];
	applications.value = [
		{ jobTitle: 'Frontend Developer', company: 'TechCorp', dateApplied: '2025-01-10', status: 'Accepted' },
		{ jobTitle: 'Backend Developer', company: 'CodeWorks', dateApplied: '2025-01-12', status: 'Rejected' },
		{ jobTitle: 'Full Stack Developer', company: 'Innovatech', dateApplied: '2025-01-14', status: 'Pending' }
	];
});

// Tab handling
const setActiveTab = (tab) => (activeTab.value = tab);
const setSkillTab = (tab) => (skillTab.value = tab);

// Form and skill handlers
const handleUpdateProfile = () => alert('Profile updated successfully!');
const addSkill = () => {
	if (newSkill.value && !skills.value.includes(newSkill.value)) {
		skills.value.push(newSkill.value);
		newSkill.value = '';
	}
};
const removeSkill = (index) => skills.value.splice(index, 1);
</script>

<style scoped></style>
