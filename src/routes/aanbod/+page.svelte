<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';

	let { data } = $props();
	const chickenPkgs = data.packages.filter((p) => p.type === 'chicken');
	const kebabPkgs = data.packages.filter((p) => p.type === 'kebab');
	const sauces = data.extras.filter((e) => e.category === 'sauce');
	const equipment = data.extras.filter((e) => e.category === 'equipment');
</script>

<svelte:head>
	<title>Aanbod & Prijzen - de vleesbobijn</title>
	<meta name="description" content="Bekijk onze pita en kebab pakketten. Kip vanaf €250, kebab vanaf €260. Inclusief grill, vlees, broodjes en gas. Prijzen zijn excl. BTW." />
	<meta property="og:title" content="Aanbod & Prijzen - de vleesbobijn" />
	<meta property="og:description" content="Bekijk onze pita en kebab pakketten. Kip vanaf €250, kebab vanaf €260. Inclusief grill, vlees, broodjes en gas." />
	<meta property="og:image" content="https://devleesbobijn.be/images/hero-3.webp" />
	<meta property="og:url" content="https://devleesbobijn.be/aanbod" />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://devleesbobijn.be/aanbod" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<h1 class="text-3xl md:text-4xl font-display mb-4">Aanbod & Prijzen</h1>
		<p class="text-gray-600 max-w-xl mx-auto">
			Een heerlijke vleesbobijn voor een eerlijke prijs. Al onze prijzen zijn vrijgesteld van BTW.
		</p>
		<p class="text-sm text-gray-500 mt-2">Standaard tot 15kg op stock. Tot 40kg (120+ gasten) beschikbaar op aanvraag.</p>
	</div>

	<!-- Productafbeeldingen -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<img src="/images/prijs-kip.webp" alt="Kip prijslijst de vleesbobijn" class="w-full rounded-2xl shadow-lg" />
		<img src="/images/prijs-kebab.webp" alt="Kebab prijslijst de vleesbobijn" class="w-full rounded-2xl shadow-lg" />
	</div>

	<!-- Kip pakketten -->
	<h2 class="text-2xl font-display mb-6 text-primary">Kip pakketten</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
		{#each chickenPkgs as pkg}
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex justify-between items-start mb-3">
					<div>
						<h3 class="font-display text-lg">{pkg.name}</h3>
						<p class="text-sm text-gray-500">{pkg.includes}</p>
					</div>
					<span class="bg-secondary text-primary-dark text-xs font-display px-2 py-1 rounded">
						{pkg.weightKg}kg
					</span>
				</div>
				<p class="text-gray-600 text-sm mb-4">{pkg.description}</p>
				<div class="border-t pt-4 flex justify-between items-center">
					<span class="text-2xl font-display text-primary">{formatPriceShort(pkg.price)}</span>
					<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} personen</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Kebab pakketten -->
	<h2 class="text-2xl font-display mb-6 text-primary">Kebab pakketten</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
		{#each kebabPkgs as pkg}
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex justify-between items-start mb-3">
					<div>
						<h3 class="font-display text-lg">{pkg.name}</h3>
						<p class="text-sm text-gray-500">{pkg.includes}</p>
					</div>
					<span class="bg-secondary text-primary-dark text-xs font-display px-2 py-1 rounded">
						{pkg.weightKg}kg
					</span>
				</div>
				<p class="text-gray-600 text-sm mb-4">{pkg.description}</p>
				<div class="border-t pt-4 flex justify-between items-center">
					<span class="text-2xl font-display text-primary">{formatPriceShort(pkg.price)}</span>
					<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} personen</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Grote groepen -->
	<div class="bg-primary rounded-2xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
		<div>
			<h3 class="font-display text-xl mb-1">Meer dan 60 gasten?</h3>
			<p class="text-white/80 text-sm">Tot 40kg vlees (120+ personen) is mogelijk op aanvraag. Neem contact op voor een offerte op maat.</p>
		</div>
		<a href="/contact" class="flex-shrink-0 bg-secondary text-primary-dark font-display px-6 py-3 rounded-xl hover:bg-secondary-dark transition-colors whitespace-nowrap">
			Vraag een offerte aan
		</a>
	</div>

	<!-- Wat zit erin -->
	<div class="bg-primary/5 rounded-2xl p-8 mb-12">
		<h2 class="text-2xl font-display mb-4">Wat zit er in elk pakket?</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each [
				'Pita/kebab-grill met spit',
				'Vlees (kip of kebab)',
				'Broodjes en/of durums',
				'Elektrisch snijmes',
				'Gasfles',
				'Servetten'
			] as item}
				<div class="flex items-center gap-3">
					<span class="text-secondary-dark font-display text-lg">✓</span>
					<span>{item}</span>
				</div>
			{/each}
		</div>
		<p class="text-sm text-gray-500 mt-4">Enkel verse groenten moet je zelf voorzien.</p>
	</div>

	<!-- Sauzen -->
	<h2 class="text-2xl font-display mb-2">Sauzen</h2>
	<p class="text-gray-600 mb-4">Optioneel bij te bestellen — {formatPriceShort(sauces[0]?.pricePerUnit || 1000)} per liter</p>
	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
		{#each sauces as sauce}
			<div class="bg-white rounded-xl p-4 border text-center">
				<span class="font-medium text-sm">{sauce.name}</span>
			</div>
		{/each}
	</div>


	<!-- Waarborg -->
	<div class="bg-secondary/10 rounded-2xl p-8 mb-8">
		<h2 class="text-2xl font-display mb-4">Waarborg & praktisch</h2>
		<ul class="space-y-3">
			<li class="flex items-start gap-3">
				<span class="text-secondary-dark font-display">€250</span>
				<span>Waarborg (wordt teruggestort bij propere teruggave van materiaal)</span>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-secondary-dark font-display">€100</span>
				<span>Reinigingskost indien materiaal niet proper wordt teruggebracht</span>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-secondary-dark font-display">📍</span>
				<span>Ophalen en terugbrengen: Achterstraat 20, 8540 Deerlijk</span>
			</li>
		</ul>
	</div>

	<div class="text-center">
		<a href="/boeken" class="inline-block bg-primary hover:bg-primary-dark text-white font-display px-8 py-4 rounded-xl text-lg transition-colors">
			Direct boeken
		</a>
	</div>
</div>
