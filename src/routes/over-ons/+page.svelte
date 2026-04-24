<svelte:head>
	<title>Over ons - de vleesbobijn</title>
	<meta name="description" content="Ontdek het verhaal achter de vleesbobijn. Gevestigd in Deerlijk, bedienen we feesten in heel West-Vlaanderen met een uniek pita/kebab-concept." />
	<meta property="og:title" content="Over ons - de vleesbobijn" />
	<meta property="og:description" content="Ontdek het verhaal achter de vleesbobijn. Gevestigd in Deerlijk, bedienen we feesten in heel West-Vlaanderen." />
	<meta property="og:image" content="https://devleesbobijn.be/images/hero-3.webp" />
	<meta property="og:url" content="https://devleesbobijn.be/over-ons" />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://devleesbobijn.be/over-ons" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<img src="/images/logo.png" alt="de vleesbobijn logo" class="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-secondary" />
		<h1 class="text-3xl md:text-4xl font-display mb-4">Over de vleesbobijn</h1>
		<p class="text-gray-600 text-lg">Het unieke feestconcept voor thuis</p>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
		<img src="/images/Vleesbobbijn-115.jpg" alt="Vlees snijden aan het spit" class="w-full h-48 object-cover rounded-xl" />
		<img src="/images/Vleesbobbijn-128.jpg" alt="Volle pita met sauzen" class="w-full h-48 object-cover rounded-xl" />
		<img src="/images/Vleesbobbijn-155.jpg" alt="Gasten aan de grill" class="w-full h-48 object-cover rounded-xl" />
		<img src="/images/hero-pita-closeup.jpeg" alt="Close-up van een lekkere pita" class="w-full h-48 object-cover rounded-xl" />
	</div>

	<div class="bg-white rounded-2xl p-8 border mb-6">
		<div class="flex flex-col md:flex-row gap-8 items-center mb-6">
			<img src="/images/over-ons-oprichters.jpg" alt="De oprichters van de vleesbobijn" class="w-full md:w-64 h-64 object-cover rounded-2xl flex-shrink-0" />
			<div>
				<h2 class="text-2xl font-display mb-4">Ons verhaal</h2>
		<p class="text-gray-700 leading-relaxed mb-4">
			de vleesbobijn is ontstaan vanuit een simpel idee: wat als je de gezelligheid van een
			pita/kebab-zaak naar je eigen feest kon brengen? Geen gedoe met catering, geen dure kok,
			maar een interactieve belevenis waar je gasten zelf aan de slag gaan.
		</p>
		<p class="text-gray-700 leading-relaxed mb-4">
			Met onze professionele grills en zorgvuldig samengestelde pakketten brengen we alles
			wat je nodig hebt recht naar jouw feest. Het enige wat jij moet doen? De verse groenten
			voorzien en genieten van je gasten die zelf hun pita samenstellen.
		</p>
		<p class="text-gray-700 leading-relaxed">
			Gevestigd in het hart van Deerlijk, bedienen we feesten in heel de regio.
			Van kleine verjaardagen tot grote communiefeesten — wij hebben het juiste pakket
			voor elke gelegenheid.
		</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
		<div class="bg-primary/5 rounded-2xl p-6">
			<h3 class="font-display text-lg mb-3 text-primary">Wat maakt ons uniek?</h3>
			<ul class="space-y-2 text-gray-700">
				{#each ['Totaalconcept: alles inbegrepen', 'Interactieve beleving voor gasten', 'Professioneel materiaal', 'Eerlijke, transparante prijzen'] as item}
					<li class="flex items-start gap-2">
						<span class="text-primary mt-1">✓</span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="bg-secondary/10 rounded-2xl p-6">
			<h3 class="font-display text-lg mb-4 text-secondary-dark">Onze cijfers</h3>
			<div class="space-y-4">
				<div>
					<span class="text-3xl font-display text-secondary-dark">250+</span>
					<p class="text-gray-600 text-sm">Feesten verzorgd</p>
				</div>
				<div>
					<span class="text-3xl font-display text-secondary-dark">10</span>
					<p class="text-gray-600 text-sm">Saussoorten beschikbaar</p>
				</div>
				<div>
					<span class="text-3xl font-display text-secondary-dark">⭐⭐⭐⭐⭐</span>
					<p class="text-gray-600 text-sm">Blije feestgangers</p>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-2xl p-8 border text-center">
		<h2 class="text-2xl font-display mb-4">Klaar om te boeken?</h2>
		<p class="text-gray-600 mb-6">Maak van jouw volgende feest een onvergetelijke belevenis!</p>
		<a href="/boeken" class="inline-block bg-primary hover:bg-primary-dark text-white font-display px-8 py-4 rounded-xl text-lg transition-colors">
			Nu boeken
		</a>
	</div>
</div>
