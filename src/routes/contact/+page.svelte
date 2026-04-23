<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Contact - de vleesbobijn</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<h1 class="text-3xl md:text-4xl font-bold mb-4">Contact</h1>
		<p class="text-gray-600">Heb je een vraag of wil je een pakket op maat? Neem contact met ons op!</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
		<!-- Contact form -->
		<div>
			<h2 class="text-xl font-bold mb-6">Stuur ons een bericht</h2>

			{#if form?.success}
				<div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-800">
					Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium mb-1">Naam *</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium mb-1">E-mail *</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
					/>
				</div>
				<div>
					<label for="phone" class="block text-sm font-medium mb-1">Telefoon</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
					/>
				</div>
				<div>
					<label for="message" class="block text-sm font-medium mb-1">Bericht *</label>
					<textarea
						id="message"
						name="message"
						rows="5"
						required
						class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-y"
					></textarea>
				</div>
				<button
					type="submit"
					class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-colors"
				>
					Verstuur bericht
				</button>
			</form>
		</div>

		<!-- Contact info -->
		<div>
			<h2 class="text-xl font-bold mb-6">Onze gegevens</h2>

			<div class="space-y-6">
				<div class="bg-white rounded-xl p-6 border">
					<h3 class="font-semibold mb-2">📍 Adres</h3>
					<p class="text-gray-600">Achterstraat 20<br />8540 Deerlijk</p>
					<p class="text-sm text-gray-500 mt-2">Hier haal je het materiaal op en breng je het terug.</p>
				</div>

				<div class="bg-white rounded-xl p-6 border">
					<h3 class="font-semibold mb-2">📞 Telefoon</h3>
					<a href="tel:+32479392283" class="text-primary font-semibold hover:underline">
						+32 479 39 22 83
					</a>
				</div>

				<div class="bg-white rounded-xl p-6 border">
					<h3 class="font-semibold mb-2">✉️ E-mail</h3>
					<a href="mailto:devleesbobijn@gmail.com" class="text-primary font-semibold hover:underline">
						devleesbobijn@gmail.com
					</a>
				</div>

				<div class="bg-white rounded-xl p-6 border">
					<h3 class="font-semibold mb-2">🕐 Beschikbaarheid</h3>
					<p class="text-gray-600">
						Bereikbaar via telefoon en e-mail.<br />
						Ophaling en terugbreng in overleg.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
