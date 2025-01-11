<template>
	<div class="flex flex-col min-h-screen bg-gray-100">
		<header class="bg-white shadow">
			<nav class="container mx-auto px-6 py-3">
				<div class="flex justify-between items-center">
					<router-link to="/" class="flex items-center">
						<img src="@/assets/logo.png" alt="Logo" class="h-12 mr-3" />
						<span class="text-xl font-semibold text-[#46b7ff]">Grow Your Career</span>
					</router-link>
					<div class="space-x-4">
						<!-- Replace Login and Sign Up links with buttons -->
						<router-link to="/login">
							<button class="px-4 py-2 text-white bg-[#46b7ff] hover:bg-blue-700 rounded-md">Login</button>
						</router-link>
						<router-link to="/signup">
							<button class="px-4 py-2 text-white bg-blue-600 hover:bg-[#46b7ff] rounded-md">Sign Up</button>
						</router-link>
						<!-- <router-link to="/add-job" class="text-gray-600 hover:text-gray-800">Add Job</router-link>
						<router-link to="/profile" class="text-gray-600 hover:text-gray-800">Profile</router-link> -->
					</div>
				</div>
			</nav>
		</header>

		<main class="flex-grow container mx-auto px-6 py-8">
			<router-view></router-view>
		</main>

		<footer class="bg-white shadow mt-8">
			<div class="container mx-auto px-6 py-3">
				<p class="text-center text-gray-600">© {{ new Date().getFullYear() }} Grow Your Career. All rights reserved.</p>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'App'
};
</script>
