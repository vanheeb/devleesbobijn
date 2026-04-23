<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { businessConfig } from '$lib/config';

	let { data } = $props();
	const chickenPackages = $derived(data.packages.filter((p) => p.type === 'chicken'));
	const kebabPackages = $derived(data.packages.filter((p) => p.type === 'kebab'));

	const pageTitle = 'de vleesbobijn — Pitta & kebab grill huren in Deerlijk';
	const pageDescription =
		'Huur een pitta/kebab-grill voor jouw feest. Compleet pakket met vlees, broodjes en toebehoren. Regio Deerlijk, West-Vlaanderen.';
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
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="nl_BE" />
	<meta property="og:site_name" content={businessConfig.name} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={ogImage} />
	{@html `<script type="application/ld+json">${JSON.stringify(localBusinessJsonLd)}</` + `script>`}
</svelte:head>

<!-- ── SECTIE 1: HERO — Bold & Feestelijk ── -->
<section class="relative bg-primary overflow-hidden">
	<!-- Decoratieve gele cirkel -->
	<div
		class="absolute -bottom-16 -right-16 w-96 h-96 rounded-full pointer-events-none"
		style="background: #ffdc82; opacity: 0.12"
	></div>

	<div class="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
		<!-- Links: tekst -->
		<div class="relative z-10 flex flex-col justify-center px-8 md:px-14 py-20">
			<!-- Eyebrow label -->
			<span class="inline-block bg-secondary text-primary-dark font-display text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded mb-6 w-fit">
				het feestconcept
			</span>

			<h1 class="font-display text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-none mb-2 tracking-wide">
				Pita &amp; kebab<br />van het spit
				<em class="not-italic text-secondary block">voor bij je thuis.</em>
			</h1>

			<p class="text-white/80 text-base leading-[1.7] mt-5 mb-8 max-w-sm">
				de vleesbobijn is het totaalconcept voor een geslaagd feest bij je thuis.
				Zo bereid je op een eenvoudige en snelle manier zelf de heerlijkste pita's,
				op elke locatie en op elk moment.
			</p>

			<div class="flex flex-col sm:flex-row gap-3">
				<a
					href="/boeken"
					class="font-display text-primary-dark text-base tracking-widest uppercase px-8 py-4 rounded-xl text-center border-[3px] border-secondary bg-secondary transition-all hover:bg-secondary-dark hover:border-secondary-dark"
				>
					Nu boeken
				</a>
				<a
					href="/contact"
					class="font-display text-white text-base tracking-widest uppercase px-8 py-4 rounded-xl text-center border-[3px] border-white/40 transition-colors hover:border-white/70 hover:bg-white/10"
				>
					Contact
				</a>
			</div>
		</div>

		<!-- Rechts: foto met geel frame -->
		<div class="relative hidden lg:block">
			<img
				src="/images/hero-3.webp"
				alt="de vleesbobijn setup"
				class="absolute inset-0 w-full h-full object-cover"
				style="filter: saturate(1.1) contrast(1.05)"
			/>
			<!-- Geel decoratief frame -->
			<div
				class="absolute inset-0 pointer-events-none"
				style="top: 20px; left: -8px; bottom: 20px; right: 20px; border: 4px solid #ffdc82; border-radius: 16px; z-index: 2"
			></div>
		</div>
	</div>
</section>

<!-- ── USP-STRIP ── -->
<div class="bg-secondary grid grid-cols-1 md:grid-cols-3">
	{#each [
		{ icon: '🔥', title: 'Alles inbegrepen', desc: 'Grill, vlees, broodjes, snijmes en gas' },
		{ icon: '🔪', title: 'Zelf snijden', desc: 'Interactief & onvergetelijk gezellig' },
		{ icon: '🏆', title: 'Topkwaliteit', desc: 'Zorgvuldig geselecteerd vlees & brood' }
	] as usp, i}
		<div class="flex items-center gap-4 px-8 py-6 {i < 2 ? 'md:border-r border-primary/15' : ''}">
			<span class="text-3xl">{usp.icon}</span>
			<div>
				<h4 class="font-display text-primary-dark text-base tracking-wide">{usp.title}</h4>
				<p class="text-primary/70 text-sm font-sans font-light">{usp.desc}</p>
			</div>
		</div>
	{/each}
</div>

<!-- ── SECTIE 2: WAT IS HET ── -->
<section class="py-16 md:py-20 bg-surface">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-display mb-3">Wat is de vleesbobijn?</h2>
			<p class="text-gray-600 max-w-lg mx-auto leading-relaxed">
				Een compleet feestconcept waarbij wij alles voorzien en jij enkel geniet.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-white rounded-2xl p-8 border-2 border-primary/10 hover:border-primary/30 transition-colors">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-5">🔥</div>
				<h3 class="font-display text-xl mb-3 text-primary">Alles inbegrepen</h3>
				<p class="text-gray-600 text-sm leading-relaxed">
					Grill, vlees, broodjes en of durums, snijmes en gas. Je ontvangt van ons het volledige
					pakket — jij voorziet enkel de verse groenten. Sauzen kunnen bijbesteld worden.
				</p>
			</div>

			<div class="bg-primary rounded-2xl p-8 text-white">
				<div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-5">🔪</div>
				<h3 class="font-display text-xl mb-3 text-secondary">Zelf snijden</h3>
				<p class="text-white/85 text-sm leading-relaxed">
					Je bereidt je pitta zelf. Jij en je gasten snijden zelf het vlees af van het spit.
					Interactief &amp; gezellig. Niemand vergeet dit feestje met dit unieke concept.
				</p>
			</div>

			<div class="bg-white rounded-2xl p-8 border-2 border-primary/10 hover:border-primary/30 transition-colors">
				<div class="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center text-3xl mb-5">🏆</div>
				<h3 class="font-display text-xl mb-3 text-primary">Topkwaliteit</h3>
				<p class="text-gray-600 text-sm leading-relaxed">
					Onze broodjes en ons pitavlees zijn zorgvuldig geselecteerd op kwaliteit. Samen met onze
					leveranciers stelden we een assortiment samen om van te genieten. Eén hap en je bent overtuigd.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ── TAGLINE-BANNER ── -->
<section class="bg-primary py-12">
	<div class="max-w-3xl mx-auto px-4 text-center">
		<p class="text-white text-xl md:text-2xl font-display leading-relaxed mb-3">
			Op zoek naar een concept waarbij je als gastheer of gastvrouw zelf volop mee kan genieten?
		</p>
		<p class="text-white/80 text-base md:text-lg leading-relaxed">
			Met onze vleesbobijn kan het. Weinig werk, veel sfeer en gasten die zelf hun pita snijden en afwerken.
		</p>
	</div>
</section>

<!-- ── GELEGENHEDEN ── -->
<section class="py-12 bg-surface">
	<div class="max-w-6xl mx-auto px-4 text-center">
		<p class="text-xs font-display text-gray-400 tracking-widest uppercase mb-5">Perfect voor elk feest</p>
		<div class="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
			{#each ['Communiefeest', 'Verjaardagsfeest', 'Babyborrel', 'Housewarming', 'Trouwfeest', 'Lentefeest', 'Tuinfeest', 'Vrijgezellenfeest', 'Bedrijfsfeest', 'BBQ-alternatief'] as occasion}
				<span class="bg-primary/[0.08] text-primary px-4 py-2 rounded-full text-sm font-display tracking-wide border border-primary/[0.15]">
					{occasion}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ── SECTIE 3: PAKKETTEN ── -->
<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-display mb-3">Onze pakketten</h2>
			<p class="text-gray-600 max-w-xl mx-auto">
				Kies het pakket dat past bij jouw feest. Van intiem tot groots.
			</p>
		</div>

		<!-- Kip -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
			<div class="md:col-span-1">
				<img src="/images/prijs-kip.webp" alt="Kip prijslijst" class="w-full rounded-2xl shadow-lg" />
			</div>
			<div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each chickenPackages as pkg}
					<div class="bg-surface rounded-2xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
						<div class="text-sm font-display text-primary mb-1 tracking-wide">{pkg.weightKg}kg</div>
						<h4 class="font-display text-lg mb-2">{pkg.name}</h4>
						<p class="text-gray-600 text-sm mb-3">{pkg.description}</p>
						<p class="text-sm text-gray-500 mb-4">{pkg.includes}</p>
						<div class="flex items-end justify-between">
							<span class="text-2xl font-display text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Kebab -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
			<div class="md:col-span-1 md:order-last">
				<img src="/images/prijs-kebab.webp" alt="Kebab prijslijst" class="w-full rounded-2xl shadow-lg" />
			</div>
			<div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each kebabPackages as pkg}
					<div class="bg-surface rounded-2xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
						<div class="text-sm font-display text-primary mb-1 tracking-wide">{pkg.weightKg}kg</div>
						<h4 class="font-display text-lg mb-2">{pkg.name}</h4>
						<p class="text-gray-600 text-sm mb-3">{pkg.description}</p>
						<p class="text-sm text-gray-500 mb-4">{pkg.includes}</p>
						<div class="flex items-end justify-between">
							<span class="text-2xl font-display text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-sm text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="text-center">
			<a
				href="/boeken"
				class="inline-block bg-primary hover:bg-primary-dark text-white font-display px-8 py-4 rounded-xl text-lg transition-colors tracking-wide"
			>
				Boek nu jouw pakket
			</a>
		</div>
	</div>
</section>

<!-- ── SECTIE 4: HOE WERKT HET ── -->
<section class="py-16 bg-secondary/10">
	<div class="max-w-6xl mx-auto px-4">
		<h2 class="text-3xl md:text-4xl font-display text-center mb-12">Hoe werkt het?</h2>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			{#each [
				{ step: '1', title: 'Kies je pakket', desc: 'Selecteer kip of kebab in het gewicht dat past bij jouw feest.' },
				{ step: '2', title: 'Kies je datum', desc: 'Bekijk de beschikbaarheid en kies je gewenste datum.' },
				{ step: '3', title: 'Betaal je pakket', desc: 'Betaal veilig online. Bij afhaling wordt nog een waarborg gevraagd van €250.' },
				{ step: '4', title: 'Afhalen & feesten!', desc: 'Haal de grill op in Deerlijk en geniet met je gasten!' }
			] as item}
				<div class="text-center">
					<div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-display mx-auto mb-4">
						{item.step}
					</div>
					<h3 class="font-display text-lg mb-2">{item.title}</h3>
					<p class="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ── SECTIE 5: INSTAGRAM ── -->
<section class="py-16 bg-white">
	<div class="max-w-4xl mx-auto px-4">
		<div class="text-center mb-10">
			<div class="inline-flex items-center gap-2 text-gray-400 mb-3">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
				</svg>
				<span class="text-sm tracking-widest font-display uppercase">Volg ons</span>
			</div>
			<h2 class="text-3xl md:text-4xl font-display mb-2">@devleesbobijn</h2>
			<p class="text-gray-500 text-sm">Bekijk onze sfeerbeelden en feestmomenten</p>
		</div>

		<!--
			INSTAGRAM EMBED — Elfsight
			Stap 1: Ga naar https://elfsight.com/instagram-feed-widget/
			Stap 2: Maak gratis account, verbind @devleesbobijn, kopieer je widget-ID
			Stap 3: Vervang JOUW-WIDGET-ID hieronder door jouw echte ID (bv. "a1b2c3d4-...")
		-->
		<div class="elfsight-app-JOUW-WIDGET-ID" data-elfsight-app-lazy></div>
		<script src="https://static.elfsight.com/platform/platform.js" async></script>

		<div class="text-center mt-8">
			<a
				href={businessConfig.social.instagram}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-display text-sm tracking-wide transition-colors"
			>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
				</svg>
				Bekijk alle posts op Instagram
			</a>
		</div>
	</div>
</section>
