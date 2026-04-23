<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';

	let { data } = $props();
	const chickenPkgs = data.packages.filter((p) => p.type === 'chicken');
	const kebabPkgs = data.packages.filter((p) => p.type === 'kebab');
	const sauces = data.extras.filter((e) => e.category === 'sauce');
	const equipment = data.extras.filter((e) => e.category === 'equipment');
</script>

<svelte:head>
	<title>Aanbod & Prijzen - De Vleesbobijn</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<h1 class="text-3xl md:text-4xl font-bold mb-4">Aanbod & Prijzen</h1>
		<p class="text-gray-600 max-w-xl mx-auto">
			Een heerlijke vleesbobijn voor een eerlijke prijs. Al onze prijzen zijn vrijgesteld van BTW.
		</p>
	</div>

	<!-- Product images -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<img src="/images/prijs-kip.webp" alt="Kip prijslijst De Vleesbobijn" class="w-full rounded-2xl shadow-lg" />
		<img src="/images/prijs-kebab.webp" alt="Kebab prijslijst De Vleesbobijn" class="w-full rounded-2xl shadow-lg" />
	</div>

	<!-- Chicken packages -->
	<h2 class="text-2xl font-bold mb-6 text-primary">🐔 Kip pakketten</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
		{#each chickenPkgs as pkg}
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex justify-between items-start mb-3">
					<div>
						<h3 class="font-bold text-lg">{pkg.name}</h3>
						<p class="text-sm text-gray-500">{pkg.includes}</p>
					</div>
					<span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
						{pkg.weightKg}kg
					</span>
				</div>
				<p class="text-gray-600 text-sm mb-4">{pkg.description}</p>
				<div class="border-t pt-4 flex justify-between items-center">
					<span class="text-2xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
					<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} personen</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Kebab packages -->
	<h2 class="text-2xl font-bold mb-6 text-primary">🥙 Kebab pakketten</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
		{#each kebabPkgs as pkg}
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex justify-between items-start mb-3">
					<div>
						<h3 class="font-bold text-lg">{pkg.name}</h3>
						<p class="text-sm text-gray-500">{pkg.includes}</p>
					</div>
					<span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
						{pkg.weightKg}kg
					</span>
				</div>
				<p class="text-gray-600 text-sm mb-4">{pkg.description}</p>
				<div class="border-t pt-4 flex justify-between items-center">
					<span class="text-2xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
					<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} personen</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- What's included -->
	<div class="bg-accent/5 rounded-2xl p-8 mb-12">
		<h2 class="text-2xl font-bold mb-4">Wat zit er in elk pakket?</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each [
				'Pitta/kebab-grill met spit',
				'Vlees (kip of kebab)',
				'Broodjes en/of durums',
				'Elektrisch snijmes',
				'Gasfles',
				'Servetten'
			] as item}
				<div class="flex items-center gap-3">
					<span class="text-accent font-bold text-lg">✓</span>
					<span>{item}</span>
				</div>
			{/each}
		</div>
		<p class="text-sm text-gray-500 mt-4">
			Enkel verse groenten moet je zelf voorzien.
		</p>
	</div>

	<!-- Sauces -->
	<h2 class="text-2xl font-bold mb-6">🥫 Sauzen</h2>
	<p class="text-gray-600 mb-4">Optioneel bij te bestellen - {formatPriceShort(sauces[0]?.pricePerUnit || 1000)} per liter</p>
	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
		{#each sauces as sauce}
			<div class="bg-white rounded-xl p-4 border text-center">
				<span class="font-medium text-sm">{sauce.name}</span>
			</div>
		{/each}
	</div>

	<!-- Equipment -->
	{#if equipment.length > 0}
		<h2 class="text-2xl font-bold mb-6">🔧 Extra materiaal</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
			{#each equipment as item}
				<div class="bg-white rounded-xl p-4 border flex justify-between items-center">
					<span class="font-medium">{item.name}</span>
					<span class="text-primary font-bold">{formatPriceShort(item.pricePerUnit)}/{item.unit}</span>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Deposit info -->
	<div class="bg-secondary/10 rounded-2xl p-8 mb-8">
		<h2 class="text-2xl font-bold mb-4">Waarborg & praktisch</h2>
		<ul class="space-y-3">
			<li class="flex items-start gap-3">
				<span class="text-secondary font-bold">€250</span>
				<span>Waarborg (wordt teruggestort bij propere teruggave van materiaal)</span>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-secondary font-bold">€100</span>
				<span>Reinigingskost indien materiaal niet proper wordt teruggebracht</span>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-secondary font-bold">📍</span>
				<span>Ophalen en terugbrengen: Achterstraat 20, 8540 Deerlijk</span>
			</li>
		</ul>
	</div>

	<div class="text-center">
		<a
			href="/boeken"
			class="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
		>
			Direct boeken
		</a>
	</div>
</div>
