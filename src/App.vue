<template>
	<div class="flex flex-col min-h-screen bg-gray-100">
		<header class="bg-white shadow">
			<nav class="container mx-auto px-6 py-3">
				<div class="flex justify-between items-center">
					<router-link to="/" class="text-xl font-semibold text-gray-800">Grow Your Career</router-link>
					<div class="space-x-4">
						<router-link to="/login" class="text-gray-600 hover:text-gray-800">Login</router-link>
						<router-link to="/signup" class="text-gray-600 hover:text-gray-800">Sign Up</router-link>
						<router-link to="/add-job" class="text-gray-600 hover:text-gray-800">Add Job</router-link>
						<router-link to="/profile" class="text-gray-600 hover:text-gray-800">Profile</router-link>
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
