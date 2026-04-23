<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { formatDateShort } from '$lib/utils/dates';

	let { data } = $props();

	let statusFilter = $state('all');

	const statusLabels: Record<string, string> = {
		pending: 'In afwachting',
		confirmed: 'Bevestigd',
		picked_up: 'Opgehaald',
		returned: 'Teruggebracht',
		completed: 'Afgerond',
		cancelled: 'Geannuleerd'
	};

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		confirmed: 'bg-green-100 text-green-800',
		picked_up: 'bg-blue-100 text-blue-800',
		returned: 'bg-purple-100 text-purple-800',
		completed: 'bg-gray-100 text-gray-800',
		cancelled: 'bg-red-100 text-red-800'
	};

	const filtered = $derived(
		statusFilter === 'all'
			? data.bookings
			: data.bookings.filter((b) => b.status === statusFilter)
	);
</script>

<svelte:head>
	<title>Boekingen - Admin</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold">Boekingen</h1>
	<span class="text-sm text-gray-500">{data.bookings.length} totaal</span>
</div>

<!-- Filters -->
<div class="flex flex-wrap gap-2 mb-6">
	<button
		onclick={() => (statusFilter = 'all')}
		class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
			{statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
	>
		Alles
	</button>
	{#each Object.entries(statusLabels) as [key, label]}
		<button
			onclick={() => (statusFilter = key)}
			class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
				{statusFilter === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
		>
			{label}
		</button>
	{/each}
</div>

{#if filtered.length === 0}
	<div class="bg-white rounded-xl border p-8 text-center text-gray-500">
		Geen boekingen gevonden met deze filter.
	</div>
{:else}
	<div class="bg-white rounded-xl border overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 text-left">
					<tr>
						<th class="px-4 py-3 font-semibold">Ref</th>
						<th class="px-4 py-3 font-semibold">Datum</th>
						<th class="px-4 py-3 font-semibold">Klant</th>
						<th class="px-4 py-3 font-semibold">Pakket</th>
						<th class="px-4 py-3 font-semibold">Totaal</th>
						<th class="px-4 py-3 font-semibold">Status</th>
						<th class="px-4 py-3 font-semibold">Betaling</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each filtered as booking}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3 font-mono text-xs">{booking.reference}</td>
							<td class="px-4 py-3">{formatDateShort(booking.rentalDate)}</td>
							<td class="px-4 py-3">
								<div class="font-medium">{booking.customerName}</div>
								<div class="text-xs text-gray-500">{booking.customerPhone}</div>
							</td>
							<td class="px-4 py-3">{booking.packageName}</td>
							<td class="px-4 py-3 font-semibold">{formatPriceShort(booking.totalAmount)}</td>
							<td class="px-4 py-3">
								<span class="px-2 py-1 rounded-full text-xs font-semibold {statusColors[booking.status] || ''}">
									{statusLabels[booking.status] || booking.status}
								</span>
							</td>
							<td class="px-4 py-3">
								<span class="text-xs {booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}">
									{booking.paymentStatus === 'paid' ? 'Betaald' : 'In afwachting'}
								</span>
							</td>
							<td class="px-4 py-3">
								<a href="/admin/boekingen/{booking.id}" class="text-primary hover:underline text-sm">
									Bekijk
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
