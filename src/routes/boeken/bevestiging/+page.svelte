<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { formatDateNL } from '$lib/utils/dates';

	let { data } = $props();
	const b = data.booking;
</script>

<svelte:head>
	<title>Bevestiging #{b.reference} - de vleesbobijn</title>
	<meta name="description" content="Je boeking bij de vleesbobijn is bevestigd. Bekijk hier alle details van je reservering." />
	<meta property="og:title" content="Boeking bevestigd - de vleesbobijn" />
	<meta property="og:image" content="https://devleesbobijn.be/images/hero-3.webp" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-12">
	<div class="text-center mb-8">
		<div class="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
			✅
		</div>
		<h1 class="text-3xl font-display mb-2">Boeking bevestigd!</h1>
		<p class="text-gray-600">Bedankt {b.customerName}, je boeking is ontvangen.</p>
	</div>

	<div class="bg-white rounded-2xl border p-6 mb-8">
		<h2 class="font-display text-lg mb-4">Boekingsdetails</h2>
		<div class="space-y-3">
			<div class="flex justify-between py-2 border-b">
				<span class="text-gray-600">Referentie</span>
				<span class="font-display">{b.reference}</span>
			</div>
			<div class="flex justify-between py-2 border-b">
				<span class="text-gray-600">Pakket</span>
				<span class="font-medium">{b.packageName}</span>
			</div>
			<div class="flex justify-between py-2 border-b">
				<span class="text-gray-600">Datum</span>
				<span class="font-medium">{formatDateNL(b.rentalDate)}</span>
			</div>
			<div class="flex justify-between py-2 border-b">
				<span class="text-gray-600">Totaalbedrag</span>
				<span class="font-medium">{formatPriceShort(b.totalAmount)}</span>
			</div>
			<div class="flex justify-between py-2">
				<span class="text-gray-600">Voorschot betaald</span>
				<span class="font-display text-primary">{formatPriceShort(b.deposit)}</span>
			</div>
		</div>
	</div>

	<div class="bg-secondary/10 rounded-2xl p-6 mb-8">
		<h3 class="font-display mb-3">Wat nu?</h3>
		<ul class="space-y-2 text-sm">
			<li class="flex items-start gap-2">
				<span class="text-secondary-dark font-display">1.</span>
				<span>Je ontvangt een bevestigingsmail met alle details.</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-secondary-dark font-display">2.</span>
				<span>Haal op de afgesproken datum het materiaal op: <strong>Achterstraat 20, 8540 Deerlijk</strong></span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-secondary-dark font-display">3.</span>
				<span>Betaal het restbedrag ({formatPriceShort(Math.max(0, b.totalAmount - b.deposit))}) bij ophaling.</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-secondary-dark font-display">4.</span>
				<span>Breng het materiaal proper terug voor terugstorting van de waarborg (€250).</span>
			</li>
		</ul>
	</div>

	<div class="text-center space-y-3">
		<p class="text-sm text-gray-500">
			Vragen? Bel ons op <a href="tel:+32479392283" class="text-primary font-display">+32 479 39 22 83</a>
		</p>
		<a href="/" class="inline-block text-primary hover:underline font-medium">← Terug naar homepage</a>
	</div>
</div>
