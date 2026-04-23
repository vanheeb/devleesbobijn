<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login - de vleesbobijn</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<span class="text-4xl">🍖</span>
			<h1 class="text-2xl font-bold mt-2">Admin Login</h1>
			<p class="text-gray-500 text-sm">de vleesbobijn beheer</p>
		</div>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium mb-1">E-mail</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium mb-1">Wachtwoord</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
				/>
			</div>
			<button
				type="submit"
				class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors"
			>
				Inloggen
			</button>
		</form>
	</div>
</div>
