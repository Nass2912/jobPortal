<template>
	<div class="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
		<div class="px-6 py-8">
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

				<!-- Phone Field -->
				<div class="mb-4">
					<label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
					<input
						type="text"
						id="phone"
						v-model="phone"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
					/>
				</div>

				<!-- Location Field -->
				<div class="mb-4">
					<label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location</label>
					<input
						type="text"
						id="location"
						v-model="location"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
					/>
				</div>

				<!-- Skills Tab/ Card System -->
				<div class="mb-6">
					<label for="skills" class="block text-gray-700 text-sm font-bold mb-2">Skills</label>

					<!-- Skill Tabs -->
					<div class="flex space-x-2 mb-4">
						<button
							type="button"
							@click="setActiveTab('addSkill')"
							:class="{ 'bg-indigo-500 text-white': activeTab === 'addSkill', 'bg-gray-200': activeTab !== 'addSkill' }"
							class="px-4 py-2 rounded-md focus:outline-none"
						>
							Add Skill
						</button>
						<button
							type="button"
							@click="setActiveTab('listSkills')"
							:class="{ 'bg-indigo-500 text-white': activeTab === 'listSkills', 'bg-gray-200': activeTab !== 'listSkills' }"
							class="px-4 py-2 rounded-md focus:outline-none"
						>
							List Skills
						</button>
					</div>

					<!-- Add Skill Card -->
					<div v-if="activeTab === 'addSkill'" class="mb-4">
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

					<!-- List Skills Card -->
					<div v-if="activeTab === 'listSkills'">
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
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const name = ref('');
const email = ref('');
const bio = ref('');
const phone = ref('');
const location = ref('');
const skills = ref([]);
const newSkill = ref('');
const activeTab = ref('addSkill'); // Default active tab is "Add Skill"

// Mock profile data
onMounted(() => {
	name.value = 'John Doe';
	email.value = 'john@example.com';
	bio.value = 'I am a software developer with 5 years of experience.';
	phone.value = '123-456-7890';
	location.value = 'New York, USA';
	skills.value = ['JavaScript', 'Vue.js', 'Node.js'];
});

// Handle Profile Update
const handleUpdateProfile = async () => {
	// Normally, you'd make an API call here to update the user profile
	console.log('Updating profile:', {
		name: name.value,
		email: email.value,
		bio: bio.value,
		phone: phone.value,
		location: location.value,
		skills: skills.value
	});

	// Simulate successful update
	alert('Profile updated successfully!');
};

// Handle Skill Addition
const addSkill = () => {
	if (newSkill.value && !skills.value.includes(newSkill.value)) {
		skills.value.push(newSkill.value);
		newSkill.value = ''; // Reset skill input field
	}
};

// Handle Skill Removal
const removeSkill = (index) => {
	skills.value.splice(index, 1);
};

// Handle Tab Change
const setActiveTab = (tab) => {
	activeTab.value = tab;
};
</script>

<style scoped>
/* Add custom styles for tabs and cards */
</style>
