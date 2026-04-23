<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPriceShort } from '$lib/utils/pricing';
	import { formatDateNL } from '$lib/utils/dates';

	let { data, form } = $props();
	const b = data.booking;

	const statusLabels: Record<string, string> = {
		pending: 'In afwachting',
		confirmed: 'Bevestigd',
		picked_up: 'Opgehaald',
		returned: 'Teruggebracht',
		completed: 'Afgerond',
		cancelled: 'Geannuleerd'
	};

	const statusFlow = ['pending', 'confirmed', 'picked_up', 'returned', 'completed'];
</script>

<svelte:head>
	<title>Boeking {b.reference} - Admin</title>
</svelte:head>

<div class="mb-6">
	<a href="/admin/boekingen" class="text-sm text-primary hover:underline">← Terug naar boekingen</a>
</div>

<div class="flex items-start justify-between mb-6">
	<div>
		<h1 class="text-2xl font-bold">Boeking {b.reference}</h1>
		<p class="text-gray-500 text-sm">Aangemaakt op {b.createdAt}</p>
	</div>
</div>

{#if form?.success}
	<div class="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 text-green-700 text-sm">
		Status succesvol bijgewerkt!
	</div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<!-- Booking details -->
	<div class="bg-white rounded-xl border p-6">
		<h2 class="font-bold mb-4">Boekingsdetails</h2>
		<dl class="space-y-3">
			<div class="flex justify-between">
				<dt class="text-gray-500">Pakket</dt>
				<dd class="font-medium">{data.packageName}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Datum</dt>
				<dd class="font-medium">{formatDateNL(b.rentalDate)}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Grill</dt>
				<dd class="font-medium">{data.grillName}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Soort feest</dt>
				<dd class="font-medium">{b.eventType || '-'}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Aantal gasten</dt>
				<dd class="font-medium">{b.guestCount || '-'}</dd>
			</div>
			{#if b.notes}
				<div>
					<dt class="text-gray-500 mb-1">Opmerkingen</dt>
					<dd class="text-sm bg-gray-50 rounded-lg p-3">{b.notes}</dd>
				</div>
			{/if}
		</dl>
	</div>

	<!-- Customer -->
	<div class="bg-white rounded-xl border p-6">
		<h2 class="font-bold mb-4">Klantgegevens</h2>
		<dl class="space-y-3">
			<div class="flex justify-between">
				<dt class="text-gray-500">Naam</dt>
				<dd class="font-medium">{b.customerName}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">E-mail</dt>
				<dd><a href="mailto:{b.customerEmail}" class="text-primary hover:underline">{b.customerEmail}</a></dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Telefoon</dt>
				<dd><a href="tel:{b.customerPhone}" class="text-primary hover:underline">{b.customerPhone}</a></dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Adres</dt>
				<dd class="font-medium">{b.customerAddress || '-'}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-gray-500">Gemeente</dt>
				<dd class="font-medium">{b.customerCity || '-'}</dd>
			</div>
		</dl>
	</div>

	<!-- Pricing -->
	<div class="bg-white rounded-xl border p-6">
		<h2 class="font-bold mb-4">Financieel</h2>
		<dl class="space-y-3">
			<div class="flex justify-between">
				<dt class="text-gray-500">Pakketprijs</dt>
				<dd class="font-medium">{formatPriceShort(b.packagePrice)}</dd>
			</div>
			{#each data.extras as extra}
				<div class="flex justify-between text-sm">
					<dt class="text-gray-500">{extra.quantity}x {extra.name}</dt>
					<dd>{formatPriceShort(extra.unitPrice * extra.quantity)}</dd>
				</div>
			{/each}
			<div class="flex justify-between border-t pt-2 font-bold">
				<dt>Totaal</dt>
				<dd class="text-primary">{formatPriceShort(b.totalAmount)}</dd>
			</div>
			<div class="flex justify-between text-sm">
				<dt class="text-gray-500">Voorschot</dt>
				<dd class="{b.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'} font-semibold">
					{formatPriceShort(b.deposit)} ({b.paymentStatus === 'paid' ? 'betaald' : 'in afwachting'})
				</dd>
			</div>
			<div class="flex justify-between text-sm">
				<dt class="text-gray-500">Restbedrag</dt>
				<dd class="font-medium">{formatPriceShort(Math.max(0, b.totalAmount - b.deposit))}</dd>
			</div>
		</dl>
	</div>

	<!-- Status management -->
	<div class="bg-white rounded-xl border p-6">
		<h2 class="font-bold mb-4">Status beheer</h2>

		<div class="mb-4">
			<span class="text-sm text-gray-500">Huidige status:</span>
			<span class="ml-2 font-bold">{statusLabels[b.status] || b.status}</span>
		</div>

		<form method="POST" action="?/updateStatus" use:enhance class="space-y-3">
			<div class="grid grid-cols-2 gap-2">
				{#each statusFlow as status}
					<button
						type="submit"
						name="status"
						value={status}
						disabled={b.status === status}
						class="px-3 py-2 text-sm rounded-lg border font-medium transition-colors
							{b.status === status
								? 'bg-primary text-white border-primary cursor-default'
								: 'bg-white hover:bg-gray-50 border-gray-300'}"
					>
						{statusLabels[status]}
					</button>
				{/each}
				<button
					type="submit"
					name="status"
					value="cancelled"
					disabled={b.status === 'cancelled'}
					class="px-3 py-2 text-sm rounded-lg border font-medium transition-colors col-span-2
						{b.status === 'cancelled'
							? 'bg-red-600 text-white border-red-600'
							: 'bg-white hover:bg-red-50 border-red-300 text-red-600'}"
				>
					Annuleren
				</button>
			</div>
		</form>
	</div>
</div>
