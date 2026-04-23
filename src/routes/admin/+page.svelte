<script lang="ts">
	import { formatPriceShort } from '$lib/utils/pricing';
	import { formatDateShort } from '$lib/utils/dates';

	let { data } = $props();

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
</script>

<svelte:head>
	<title>Dashboard - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Dashboard</h1>

<!-- Stats -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
	<div class="bg-white rounded-xl p-5 border">
		<div class="text-3xl font-extrabold text-primary">{data.stats.total}</div>
		<div class="text-sm text-gray-500">Totaal boekingen</div>
	</div>
	<div class="bg-white rounded-xl p-5 border">
		<div class="text-3xl font-extrabold text-green-600">{data.stats.confirmed}</div>
		<div class="text-sm text-gray-500">Bevestigd</div>
	</div>
	<div class="bg-white rounded-xl p-5 border">
		<div class="text-3xl font-extrabold text-secondary-dark">{data.stats.today}</div>
		<div class="text-sm text-gray-500">Vandaag</div>
	</div>
</div>

<!-- Upcoming bookings -->
<h2 class="text-lg font-bold mb-4">Komende boekingen</h2>

{#if data.upcomingBookings.length === 0}
	<div class="bg-white rounded-xl border p-8 text-center text-gray-500">
		Geen komende boekingen gevonden.
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
						<th class="px-4 py-3 font-semibold">Bedrag</th>
						<th class="px-4 py-3 font-semibold">Status</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each data.upcomingBookings as booking}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3 font-mono text-xs">{booking.reference}</td>
							<td class="px-4 py-3 font-medium">{formatDateShort(booking.rentalDate)}</td>
							<td class="px-4 py-3">
								<div>{booking.customerName}</div>
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
