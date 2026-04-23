<script lang="ts">
	const faqs = [
		{
			q: 'Wat is De Vleesbobijn?',
			a: 'De Vleesbobijn is een origineel totaalconcept dat instaat voor de verhuur van een pitta/kebab-grill met vlees, broodjes, gas en al het nodige materiaal inbegrepen.'
		},
		{
			q: 'Wie doet het kookwerk?',
			a: 'Jouw gasten bereiden hun eigen eten! Ze kunnen zelf het vlees van het spit snijden. Dat maakt het interactief en super gezellig.'
		},
		{
			q: 'Voor welke gelegenheden is dit geschikt?',
			a: 'Communiefeesten, lentefeesten, verjaardagen, housewarming, babyborrels, trouwfeesten (avondsnack), vrijgezellenfeesten, tuinfeesten, bedrijfsfeesten... eigenlijk elk feest!'
		},
		{
			q: 'Welke pakketten bieden jullie aan?',
			a: 'Kip: €250 (5kg), €420 (10kg), €600 (15kg). Kebab: €260 (5kg), €440 (10kg), €630 (15kg). Combinatiepakketten zijn mogelijk op aanvraag.'
		},
		{
			q: 'Hoeveel personen per pakket?',
			a: '5kg = 15-20 personen, 10kg = 30-40 personen, 15kg = 45-60 personen. Dit zijn schattingen en hangt af van de portiegrootte.'
		},
		{
			q: 'Wat zit er allemaal in een pakket?',
			a: 'Grilltoestel met spit, elektrisch snijmes, gasfles, broodjes/durums, vlees en servetten. Sauzen zijn optioneel bij te bestellen aan €10 per liter.'
		},
		{
			q: 'Welke sauzen zijn er?',
			a: 'We hebben 10 soorten: Lookssaus, Cocktailsaus, Currysaus, Samuraisaus, Andalousesaus, Tartaarsaus, Bearnaissaus, Barbecuesaus, Hannibal saus en Mammoutsaus. Allemaal €10 per liter.'
		},
		{
			q: 'Wat moet ik zelf voorzien?',
			a: 'Enkel verse groenten als je die wilt bij je pitta. Denk aan sla, tomaat, ui, komkommer, etc.'
		},
		{
			q: 'Hoe zit het met de waarborg?',
			a: 'Er is een waarborg van €250 die wordt teruggestort bij een propere teruggave van het materiaal. Wordt het materiaal niet gereinigd teruggebracht, dan wordt er €100 reinigingskost aangerekend.'
		},
		{
			q: 'Is er levering aan huis?',
			a: 'Standaard is het ophalen en terugbrengen op ons adres: Achterstraat 20, 8540 Deerlijk. In uitzonderlijke gevallen kunnen we op aanvraag levering voorzien.'
		},
		{
			q: 'Hoe betaal ik?',
			a: 'Je betaalt een voorschot van €250 online via Stripe (veilige betaling). Het restbedrag betaal je bij ophaling.'
		},
		{
			q: 'Kan ik mijn boeking annuleren?',
			a: 'Neem contact met ons op via telefoon of email om een annulering te bespreken. We zoeken altijd naar een passende oplossing.'
		}
	];

	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>Veelgestelde vragen - De Vleesbobijn</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<h1 class="text-3xl md:text-4xl font-bold mb-4">Veelgestelde vragen</h1>
		<p class="text-gray-600">Alles wat je moet weten over De Vleesbobijn</p>
	</div>

	<div class="space-y-3">
		{#each faqs as faq, i}
			<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<button
					onclick={() => toggle(i)}
					class="w-full px-6 py-4 text-left font-semibold flex justify-between items-center hover:bg-gray-50 transition-colors"
				>
					<span>{faq.q}</span>
					<svg
						class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 {openIndex === i ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if openIndex === i}
					<div class="px-6 pb-4 text-gray-600 leading-relaxed">
						{faq.a}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="mt-12 text-center bg-primary/5 rounded-2xl p-8">
		<h2 class="text-xl font-bold mb-2">Nog vragen?</h2>
		<p class="text-gray-600 mb-4">Neem gerust contact met ons op!</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="tel:+32479392283"
				class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
			>
				📞 +32 479 39 22 83
			</a>
			<a
				href="/contact"
				class="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
			>
				✉️ Contactformulier
			</a>
		</div>
	</div>
</div>
