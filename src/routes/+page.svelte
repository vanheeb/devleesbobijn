<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { businessConfig } from '$lib/config';

	let { data } = $props();
	const chickenPackages = $derived(data.packages.filter((p) => p.type === 'chicken'));
	const kebabPackages = $derived(data.packages.filter((p) => p.type === 'kebab'));

	const pageTitle = 'De Vleesbobijn — Pitta & kebab grill huren in Deerlijk';
	const pageDescription =
		'Huur een pitta/kebab-grill voor jouw feest. Compleet pakket met vlees, broodjes en toebehoren. Vanaf €250 voor 15-20 personen. Regio Deerlijk, West-Vlaanderen.';
	const siteUrl = 'https://devleesbobijn.be';
	const ogImage = `${siteUrl}/images/hero-3.webp`;

	const localBusinessJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: businessConfig.name,
		description: pageDescription,
		url: siteUrl,
		telephone: businessConfig.phone,
		email: businessConfig.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: businessConfig.address.street,
			postalCode: businessConfig.address.postalCode,
			addressLocality: businessConfig.address.city,
			addressCountry: 'BE'
		},
		image: ogImage,
		priceRange: '€€',
		areaServed: 'West-Vlaanderen'
	};
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={siteUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="nl_BE" />
	<meta property="og:site_name" content={businessConfig.name} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Schema.org LocalBusiness -->
	{@html `<script type="application/ld+json">${JSON.stringify(localBusinessJsonLd)}</` + `script>`}
</svelte:head>

<!-- Hero with background image -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0">
		<img src="/images/hero-3.webp" alt="" class="w-full h-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/80 to-primary/60"></div>
	</div>
	<div class="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
		<div class="max-w-2xl">
			<div class="flex items-center gap-3 mb-6">
				<img src="/images/logo.png" alt="De Vleesbobijn" class="h-16 w-16 rounded-full border-2 border-secondary" />
			</div>
			<h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
				Het unieke feestconcept
				<span class="text-secondary">voor thuis</span>
			</h1>
			<p class="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
				Huur een pitta/kebab-grill voor jouw feest. Compleet pakket met vlees,
				broodjes en alle toebehoren. Jouw gasten snijden zelf het vlees af -
				gegarandeerd de hit van de avond!
			</p>
			<div class="flex flex-col sm:flex-row gap-4">
				<a
					href="/boeken"
					class="inline-block bg-secondary hover:bg-secondary-dark text-primary-dark font-bold px-8 py-4 rounded-xl text-lg transition-colors text-center"
				>
					Nu boeken
				</a>
				<a
					href="/aanbod"
					class="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors text-center backdrop-blur-sm border border-white/20"
				>
					Bekijk aanbod
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Photo gallery strip -->
<section class="bg-secondary/20 py-4">
	<div class="max-w-6xl mx-auto px-4">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
			<img src="/images/hero-1.webp" alt="Pitta broodje met vlees van het spit" class="w-full h-40 object-cover rounded-xl" />
			<img src="/images/hero-2.webp" alt="De Vleesbobijn setup met sauzen" class="w-full h-40 object-cover rounded-xl" />
			<img src="/images/hero-3.webp" alt="Vlees aan het spit" class="w-full h-40 object-cover rounded-xl" />
			<img src="/images/hero-4.webp" alt="Gasten genieten van de grill" class="w-full h-40 object-cover rounded-xl" />
		</div>
	</div>
</section>

<!-- USPs -->
<section class="py-16 md:py-20">
	<div class="max-w-6xl mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="text-center p-6 bg-white rounded-2xl border border-primary/10">
				<div class="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
				<h3 class="font-bold text-lg mb-2">Alles inbegrepen</h3>
				<p class="text-gray-600">Grill, vlees, broodjes, snijmes en gas. Jij zorgt enkel voor de verse groenten.</p>
			</div>
			<div class="text-center p-6 bg-white rounded-2xl border border-primary/10">
				<div class="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">👨‍🍳</div>
				<h3 class="font-bold text-lg mb-2">Zelf snijden</h3>
				<p class="text-gray-600">Jouw gasten snijden zelf het vlees af van het spit. Interactief en gezellig!</p>
			</div>
			<div class="text-center p-6 bg-white rounded-2xl border border-primary/10">
				<div class="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💰</div>
				<h3 class="font-bold text-lg mb-2">Eerlijke prijs</h3>
				<p class="text-gray-600">Vanaf €250 voor 15-20 personen. Prijs = prijs, vrijgesteld van BTW.</p>
			</div>
		</div>
	</div>
</section>

<!-- Packages preview with images -->
<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">Onze pakketten</h2>
			<p class="text-gray-600 max-w-xl mx-auto">
				Kies het pakket dat past bij jouw feest. Van intiem tot groots, wij hebben het perfecte pakket.
			</p>
		</div>

		<!-- Chicken section with image -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
			<div class="md:col-span-1">
				<img src="/images/prijs-kip.webp" alt="Kip prijslijst" class="w-full rounded-2xl shadow-lg" />
			</div>
			<div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each chickenPackages as pkg}
					<div class="bg-surface rounded-2xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
						<div class="text-sm font-medium text-primary mb-1">{pkg.weightKg}kg</div>
						<h4 class="font-bold text-lg mb-2">{pkg.name}</h4>
						<p class="text-gray-600 text-sm mb-3">{pkg.description}</p>
						<p class="text-sm text-gray-500 mb-4">{pkg.includes}</p>
						<div class="flex items-end justify-between">
							<span class="text-2xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Kebab section with image -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
			<div class="md:col-span-1 md:order-last">
				<img src="/images/prijs-kebab.webp" alt="Kebab prijslijst" class="w-full rounded-2xl shadow-lg" />
			</div>
			<div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each kebabPackages as pkg}
					<div class="bg-surface rounded-2xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
						<div class="text-sm font-medium text-primary mb-1">{pkg.weightKg}kg</div>
						<h4 class="font-bold text-lg mb-2">{pkg.name}</h4>
						<p class="text-gray-600 text-sm mb-3">{pkg.description}</p>
						<p class="text-sm text-gray-500 mb-4">{pkg.includes}</p>
						<div class="flex items-end justify-between">
							<span class="text-2xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="text-center">
			<a
				href="/boeken"
				class="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
			>
				Boek nu jouw pakket
			</a>
		</div>
	</div>
</section>

<!-- How it works -->
<section class="py-16 bg-secondary/10">
	<div class="max-w-6xl mx-auto px-4">
		<h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Hoe werkt het?</h2>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			{#each [
				{ step: '1', title: 'Kies je pakket', desc: 'Selecteer kip of kebab in het gewicht dat past bij jouw feest.' },
				{ step: '2', title: 'Kies je datum', desc: 'Bekijk de beschikbaarheid en kies je gewenste datum.' },
				{ step: '3', title: 'Betaal voorschot', desc: 'Betaal veilig online via Stripe. Slechts €250 voorschot.' },
				{ step: '4', title: 'Feest!', desc: 'Haal de grill op in Deerlijk en geniet met je gasten!' }
			] as item}
				<div class="text-center">
					<div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
						{item.step}
					</div>
					<h3 class="font-bold mb-2">{item.title}</h3>
					<p class="text-gray-600 text-sm">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Occasions -->
<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4 text-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-6">Perfect voor elk feest</h2>
		<div class="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
			{#each ['Communiefeest', 'Verjaardagsfeest', 'Babyborrel', 'Housewarming', 'Trouwfeest (avondsnack)', 'Lentefeest', 'Tuinfeest', 'Vrijgezellenfeest', 'Bedrijfsfeest', 'BBQ-alternatief'] as occasion}
				<span class="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
					{occasion}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- CTA with background image -->
<section class="relative py-20 overflow-hidden">
	<div class="absolute inset-0">
		<img src="/images/hero-4.webp" alt="" class="w-full h-full object-cover" />
		<div class="absolute inset-0 bg-primary-dark/85"></div>
	</div>
	<div class="relative max-w-3xl mx-auto px-4 text-center text-white">
		<h2 class="text-3xl md:text-4xl font-bold mb-4">Klaar voor een onvergetelijk feest?</h2>
		<p class="text-white/80 text-lg mb-8">
			Boek vandaag nog en verras je gasten met een pitta/kebab grill op jouw feest!
		</p>
		<a
			href="/boeken"
			class="inline-block bg-secondary hover:bg-secondary-dark text-primary-dark font-bold px-10 py-4 rounded-xl text-lg transition-colors"
		>
			Nu boeken
		</a>
	</div>
</section>
