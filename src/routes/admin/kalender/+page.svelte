<script lang="ts">
	import { enhance } from '$app/forms';
	import AvailabilityCalendar from '$lib/components/calendar/AvailabilityCalendar.svelte';

	let { data, form } = $props();

	let selectedDate = $state('');
	let reason = $state('');
</script>

<svelte:head>
	<title>Kalender - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Kalender beheer</h1>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	<!-- Calendar -->
	<div>
		<AvailabilityCalendar bind:selectedDate />

		{#if selectedDate}
			<div class="mt-4 bg-white rounded-xl border p-4">
				<h3 class="font-bold mb-3">Datum blokkeren: {selectedDate}</h3>

				{#if form?.error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-red-700 text-sm">
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/block" use:enhance class="space-y-3">
					<input type="hidden" name="date" value={selectedDate} />
					<div>
						<label for="reason" class="block text-sm font-medium mb-1">Reden (optioneel)</label>
						<input
							type="text"
							id="reason"
							name="reason"
							bind:value={reason}
							placeholder="bv. Onderhoud, privé, ..."
							class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						/>
					</div>
					<button
						type="submit"
						class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm transition-colors"
					>
						Datum blokkeren
					</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Blocked dates list -->
	<div>
		<h2 class="font-bold mb-4">Geblokkeerde datums</h2>

		{#if data.blockedDates.length === 0}
			<div class="bg-white rounded-xl border p-6 text-center text-gray-500">
				Geen geblokkeerde datums.
			</div>
		{:else}
			<div class="space-y-2">
				{#each data.blockedDates.sort((a, b) => a.date.localeCompare(b.date)) as blocked}
					<div class="bg-white rounded-xl border p-4 flex items-center justify-between">
						<div>
							<span class="font-medium">{blocked.date}</span>
							{#if blocked.reason}
								<span class="text-sm text-gray-500 ml-2">- {blocked.reason}</span>
							{/if}
						</div>
						<form method="POST" action="?/unblock" use:enhance>
							<input type="hidden" name="id" value={blocked.id} />
							<button
								type="submit"
								class="text-red-600 hover:text-red-800 text-sm font-medium"
							>
								Verwijder
							</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
