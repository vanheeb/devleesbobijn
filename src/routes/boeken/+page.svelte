<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { formatDateNL } from '$lib/utils/dates';
	import AvailabilityCalendar from '$lib/components/calendar/AvailabilityCalendar.svelte';

	let { data } = $props();

	let step = $state(1);
	let selectedPackageId = $state<number | null>(null);
	let selectedDate = $state('');
	let selectedExtras = $state<Record<number, number>>({});

	// Customer form
	let customerName = $state('');
	let customerEmail = $state('');
	let customerPhone = $state('');
	let customerAddress = $state('');
	let customerCity = $state('');
	let eventType = $state('');
	let guestCount = $state('');
	let notes = $state('');

	let acceptedTerms = $state(false);
	let acceptedPrivacy = $state(false);
	let submitting = $state(false);
	let error = $state('');

	const selectedPackage = $derived(data.packages.find((p) => p.id === selectedPackageId));
	const sauces = data.extras.filter((e) => e.category === 'sauce');
	const equipment = data.extras.filter((e) => e.category === 'equipment');

	const extrasTotal = $derived(
		Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
			const extra = data.extras.find((e) => e.id === Number(id));
			return sum + (extra ? extra.pricePerUnit * qty : 0);
		}, 0)
	);

	const totalAmount = $derived((selectedPackage?.price || 0) + extrasTotal);
	const deposit = 25000; // €250

	function selectPackage(id: number) {
		selectedPackageId = id;
		step = 2;
	}

	function selectDate(date: string) {
		selectedDate = date;
		step = 3;
	}

	function updateExtra(id: number, delta: number) {
		const current = selectedExtras[id] || 0;
		const next = Math.max(0, current + delta);
		if (next === 0) {
			const { [id]: _, ...rest } = selectedExtras;
			selectedExtras = rest;
		} else {
			selectedExtras = { ...selectedExtras, [id]: next };
		}
	}

	function goToStep4() {
		step = 4;
	}

	async function handleSubmit() {
		if (!selectedPackageId || !selectedDate || !customerName || !customerEmail || !customerPhone) {
			error = 'Vul alle verplichte velden in.';
			return;
		}
		if (!acceptedTerms) {
			error = 'Je moet de huurvoorwaarden aanvaarden.';
			return;
		}
		if (!acceptedPrivacy) {
			error = 'Je moet akkoord gaan met de privacyverklaring.';
			return;
		}

		submitting = true;
		error = '';

		try {
			const body = {
				packageId: selectedPackageId,
				rentalDate: selectedDate,
				extras: Object.entries(selectedExtras)
					.filter(([_, qty]) => qty > 0)
					.map(([id, qty]) => ({ extraId: Number(id), quantity: qty })),
				customerName,
				customerEmail,
				customerPhone,
				customerAddress,
				customerCity,
				eventType,
				guestCount: guestCount ? parseInt(guestCount) : null,
				notes,
				acceptedTerms,
				acceptedPrivacy
			};

			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const result = await res.json();

			if (result.url) {
				window.location.href = result.url;
			} else {
				error = result.error || 'Er ging iets mis bij het aanmaken van de betaling.';
			}
		} catch (e) {
			error = 'Er ging iets mis. Probeer het opnieuw.';
		}

		submitting = false;
	}
</script>

<svelte:head>
	<title>Boeken - de vleesbobijn</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
	<div class="text-center mb-8">
		<h1 class="text-3xl md:text-4xl font-bold mb-4">Boek jouw Vleesbobijn</h1>
		<p class="text-gray-600">Volg de stappen hieronder om je boeking af te ronden.</p>
	</div>

	<!-- Progress bar -->
	<div class="flex items-center justify-center gap-2 mb-10">
		{#each [
			{ n: 1, label: 'Pakket' },
			{ n: 2, label: 'Datum' },
			{ n: 3, label: "Extra's" },
			{ n: 4, label: 'Gegevens' }
		] as s}
			<div class="flex items-center gap-2">
				<div
					class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
						{step >= s.n ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}"
				>
					{step > s.n ? '✓' : s.n}
				</div>
				<span class="text-sm font-medium hidden sm:inline {step >= s.n ? 'text-primary' : 'text-gray-400'}">
					{s.label}
				</span>
			</div>
			{#if s.n < 4}
				<div class="w-8 h-0.5 {step > s.n ? 'bg-primary' : 'bg-gray-200'}"></div>
			{/if}
		{/each}
	</div>

	<!-- Step 1: Package selection -->
	{#if step === 1}
		<div>
			<h2 class="text-xl font-bold mb-6">Kies je pakket</h2>

			<h3 class="font-semibold text-gray-500 mb-3">🐔 Kip</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				{#each data.packages.filter((p) => p.type === 'chicken') as pkg}
					<button
						onclick={() => selectPackage(pkg.id)}
						class="text-left bg-white rounded-xl p-5 border-2 transition-all hover:shadow-md
							{selectedPackageId === pkg.id ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/30'}"
					>
						<div class="font-bold text-lg mb-1">{pkg.name}</div>
						<div class="text-sm text-gray-500 mb-2">{pkg.includes}</div>
						<div class="text-sm text-gray-600 mb-3">{pkg.description}</div>
						<div class="flex justify-between items-end">
							<span class="text-xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-xs text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</button>
				{/each}
			</div>

			<h3 class="font-semibold text-gray-500 mb-3">🥙 Kebab</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each data.packages.filter((p) => p.type === 'kebab') as pkg}
					<button
						onclick={() => selectPackage(pkg.id)}
						class="text-left bg-white rounded-xl p-5 border-2 transition-all hover:shadow-md
							{selectedPackageId === pkg.id ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/30'}"
					>
						<div class="font-bold text-lg mb-1">{pkg.name}</div>
						<div class="text-sm text-gray-500 mb-2">{pkg.includes}</div>
						<div class="text-sm text-gray-600 mb-3">{pkg.description}</div>
						<div class="flex justify-between items-end">
							<span class="text-xl font-extrabold text-primary">{formatPriceShort(pkg.price)}</span>
							<span class="text-xs text-gray-500">{pkg.servesMin}-{pkg.servesMax} pers.</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Step 2: Date selection -->
	{#if step === 2}
		<div>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold">Kies je datum</h2>
				<button onclick={() => (step = 1)} class="text-sm text-primary hover:underline">
					← Terug naar pakketten
				</button>
			</div>

			{#if selectedPackage}
				<div class="bg-primary/5 rounded-xl p-4 mb-6 flex justify-between items-center">
					<span class="font-medium">{selectedPackage.name}</span>
					<span class="font-bold text-primary">{formatPriceShort(selectedPackage.price)}</span>
				</div>
			{/if}

			<AvailabilityCalendar bind:selectedDate onSelect={selectDate} />
		</div>
	{/if}

	<!-- Step 3: Extras -->
	{#if step === 3}
		<div>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold">Extra's toevoegen</h2>
				<button onclick={() => (step = 2)} class="text-sm text-primary hover:underline">
					← Terug naar datum
				</button>
			</div>

			<div class="bg-primary/5 rounded-xl p-4 mb-6">
				<div class="flex justify-between items-center">
					<span class="font-medium">{selectedPackage?.name}</span>
					<span class="font-bold text-primary">{formatPriceShort(selectedPackage?.price || 0)}</span>
				</div>
				<div class="text-sm text-gray-600 mt-1">{formatDateNL(selectedDate)}</div>
			</div>

			<h3 class="font-semibold mb-4">🥫 Sauzen - €10 per liter</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
				{#each sauces as sauce}
					<div class="bg-white rounded-xl p-4 border flex items-center justify-between">
						<span class="font-medium">{sauce.name}</span>
						<div class="flex items-center gap-3">
							<button
								onclick={() => updateExtra(sauce.id, -1)}
								disabled={!selectedExtras[sauce.id]}
								class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold disabled:opacity-30 transition-colors"
							>
								-
							</button>
							<span class="w-6 text-center font-bold">{selectedExtras[sauce.id] || 0}</span>
							<button
								onclick={() => updateExtra(sauce.id, 1)}
								class="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center font-bold transition-colors"
							>
								+
							</button>
						</div>
					</div>
				{/each}
			</div>

			{#if equipment.length > 0}
				<h3 class="font-semibold mb-4">🔧 Extra materiaal</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
					{#each equipment as item}
						<div class="bg-white rounded-xl p-4 border flex items-center justify-between">
							<div>
								<span class="font-medium">{item.name}</span>
								<span class="text-sm text-gray-500 ml-2">{formatPriceShort(item.pricePerUnit)}/{item.unit}</span>
							</div>
							<div class="flex items-center gap-3">
								<button
									onclick={() => updateExtra(item.id, -1)}
									disabled={!selectedExtras[item.id]}
									class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold disabled:opacity-30 transition-colors"
								>
									-
								</button>
								<span class="w-6 text-center font-bold">{selectedExtras[item.id] || 0}</span>
								<button
									onclick={() => updateExtra(item.id, 1)}
									class="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center font-bold transition-colors"
								>
									+
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if extrasTotal > 0}
				<div class="bg-secondary/10 rounded-xl p-4 mb-6">
					<div class="flex justify-between">
						<span>Extra's totaal:</span>
						<span class="font-bold">{formatPriceShort(extrasTotal)}</span>
					</div>
				</div>
			{/if}

			<button
				onclick={goToStep4}
				class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl text-lg transition-colors"
			>
				Verder naar gegevens
			</button>
		</div>
	{/if}

	<!-- Step 4: Customer details + summary -->
	{#if step === 4}
		<div>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold">Jouw gegevens</h2>
				<button onclick={() => (step = 3)} class="text-sm text-primary hover:underline">
					← Terug naar extra's
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<!-- Form -->
				<div class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium mb-1">Naam *</label>
						<input
							type="text"
							id="name"
							bind:value={customerName}
							required
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium mb-1">E-mail *</label>
						<input
							type="email"
							id="email"
							bind:value={customerEmail}
							required
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="phone" class="block text-sm font-medium mb-1">Telefoon *</label>
						<input
							type="tel"
							id="phone"
							bind:value={customerPhone}
							required
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="address" class="block text-sm font-medium mb-1">Adres</label>
						<input
							type="text"
							id="address"
							bind:value={customerAddress}
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="city" class="block text-sm font-medium mb-1">Gemeente</label>
						<input
							type="text"
							id="city"
							bind:value={customerCity}
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="eventType" class="block text-sm font-medium mb-1">Soort feest</label>
						<select
							id="eventType"
							bind:value={eventType}
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						>
							<option value="">Selecteer...</option>
							<option value="communion">Communiefeest</option>
							<option value="birthday">Verjaardagsfeest</option>
							<option value="wedding">Trouwfeest</option>
							<option value="babyshower">Babyborrel</option>
							<option value="housewarming">Housewarming</option>
							<option value="bachelor">Vrijgezellenfeest</option>
							<option value="garden">Tuinfeest</option>
							<option value="corporate">Bedrijfsfeest</option>
							<option value="other">Anders</option>
						</select>
					</div>
					<div>
						<label for="guests" class="block text-sm font-medium mb-1">Aantal gasten (schatting)</label>
						<input
							type="number"
							id="guests"
							bind:value={guestCount}
							min="1"
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div>
						<label for="notes" class="block text-sm font-medium mb-1">Opmerkingen</label>
						<textarea
							id="notes"
							bind:value={notes}
							rows="3"
							class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-y"
						></textarea>
					</div>
				</div>

				<!-- Summary -->
				<div>
					<div class="bg-white rounded-2xl border p-6 sticky top-20">
						<h3 class="font-bold text-lg mb-4">Overzicht</h3>

						<div class="space-y-3 mb-6">
							<div class="flex justify-between">
								<span>{selectedPackage?.name}</span>
								<span class="font-semibold">{formatPriceShort(selectedPackage?.price || 0)}</span>
							</div>

							{#each Object.entries(selectedExtras).filter(([_, qty]) => qty > 0) as [id, qty]}
								{@const extra = data.extras.find((e) => e.id === Number(id))}
								{#if extra}
									<div class="flex justify-between text-sm text-gray-600">
										<span>{qty}x {extra.name}</span>
										<span>{formatPriceShort(extra.pricePerUnit * qty)}</span>
									</div>
								{/if}
							{/each}
						</div>

						<div class="border-t pt-3 space-y-2">
							<div class="flex justify-between text-sm">
								<span>Datum</span>
								<span class="font-medium">{formatDateNL(selectedDate)}</span>
							</div>
							<div class="flex justify-between font-bold text-lg">
								<span>Totaal</span>
								<span class="text-primary">{formatPriceShort(totalAmount)}</span>
							</div>
						</div>

						<div class="bg-secondary/10 rounded-xl p-4 mt-4">
							<div class="flex justify-between font-bold">
								<span>Nu te betalen (voorschot)</span>
								<span class="text-secondary-dark">{formatPriceShort(deposit)}</span>
							</div>
							<p class="text-xs text-gray-500 mt-1">
								Restbedrag ({formatPriceShort(Math.max(0, totalAmount - deposit))}) bij ophaling
							</p>
						</div>

						<div class="mt-5 space-y-3 text-sm">
							<label class="flex items-start gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={acceptedTerms}
									class="mt-1 w-4 h-4 accent-primary"
								/>
								<span class="text-gray-700">
									Ik aanvaard de
									<a href="/voorwaarden" target="_blank" rel="noopener" class="text-primary underline">huurvoorwaarden</a>
									(€250 waarborg, €100 reinigingskost bij niet-propere teruggave).
								</span>
							</label>
							<label class="flex items-start gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={acceptedPrivacy}
									class="mt-1 w-4 h-4 accent-primary"
								/>
								<span class="text-gray-700">
									Ik ga akkoord met de
									<a href="/privacy" target="_blank" rel="noopener" class="text-primary underline">privacyverklaring</a>.
								</span>
							</label>
						</div>

						{#if error}
							<div class="bg-red-50 border border-red-200 rounded-xl p-3 mt-4 text-red-700 text-sm">
								{error}
							</div>
						{/if}

						<button
							onclick={handleSubmit}
							disabled={submitting || !customerName || !customerEmail || !customerPhone || !acceptedTerms || !acceptedPrivacy}
							class="w-full mt-6 bg-secondary hover:bg-secondary-dark disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-lg transition-colors"
						>
							{#if submitting}
								Laden...
							{:else}
								Betaal {formatPriceShort(deposit)} voorschot
							{/if}
						</button>

						<p class="text-xs text-gray-500 text-center mt-3">
							Veilige betaling via Stripe. Je wordt doorgestuurd naar een beveiligd betaalformulier.
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
