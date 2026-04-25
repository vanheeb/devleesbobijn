<script lang="ts">
	import { MONTH_NAMES, DAY_NAMES, getDaysInMonth, getFirstDayOfMonth, toISODate } from '$lib/utils/dates';
	import { bookingConfig } from '$lib/config';

	type AvailabilityMap = Record<string, { available: number; total: number }>;

	let {
		selectedDate = $bindable(''),
		onSelect
	}: {
		selectedDate?: string;
		onSelect?: (date: string) => void;
	} = $props();

	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let availability = $state<AvailabilityMap>({});
	let loading = $state(false);

	const today = toISODate(new Date());
	// Earliest selectable date = today + minAdvanceDays
	const minSelectableDate = (() => {
		const d = new Date();
		d.setDate(d.getDate() + bookingConfig.minAdvanceDays);
		return toISODate(d);
	})();

	async function fetchAvailability() {
		loading = true;
		try {
			const res = await fetch(`/api/availability?month=${currentMonth}&year=${currentYear}`);
			availability = await res.json();
		} catch (e) {
			console.error('Failed to fetch availability', e);
		}
		loading = false;
	}

	// Fetch on mount and when month changes
	$effect(() => {
		// Depend on currentMonth and currentYear
		void currentMonth;
		void currentYear;
		fetchAvailability();
	});

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function getDateStr(day: number): string {
		return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	}

	function getStatus(dateStr: string): 'available' | 'limited' | 'full' | 'past' {
		if (dateStr < minSelectableDate) return 'past';
		const data = availability[dateStr];
		if (!data) return 'past';
		if (data.available === 0) return 'full';
		if (data.available < data.total) return 'limited';
		return 'available';
	}

	function handleSelect(day: number) {
		const dateStr = getDateStr(day);
		const status = getStatus(dateStr);
		if (status === 'past' || status === 'full') return;
		selectedDate = dateStr;
		onSelect?.(dateStr);
	}

	function canGoPrev(): boolean {
		const now = new Date();
		return currentYear > now.getFullYear() || (currentYear === now.getFullYear() && currentMonth > now.getMonth());
	}

	const daysInMonth = $derived(getDaysInMonth(currentYear, currentMonth));
	const firstDay = $derived(getFirstDayOfMonth(currentYear, currentMonth));
</script>

<div class="bg-white rounded-2xl border p-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<button
			onclick={prevMonth}
			disabled={!canGoPrev()}
			class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<h3 class="font-bold text-lg">
			{MONTH_NAMES[currentMonth]} {currentYear}
		</h3>
		<button
			onclick={nextMonth}
			class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<!-- Day names -->
	<div class="grid grid-cols-7 gap-1 mb-2">
		{#each DAY_NAMES as name}
			<div class="text-center text-xs font-semibold text-gray-500 py-1">{name}</div>
		{/each}
	</div>

	<!-- Days grid -->
	<div class="grid grid-cols-7 gap-1">
		<!-- Empty cells for offset -->
		{#each Array(firstDay) as _}
			<div></div>
		{/each}

		{#each Array(daysInMonth) as _, i}
			{@const day = i + 1}
			{@const dateStr = getDateStr(day)}
			{@const status = getStatus(dateStr)}
			{@const isSelected = dateStr === selectedDate}
			<button
				onclick={() => handleSelect(day)}
				disabled={status === 'past' || status === 'full'}
				class="aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-all
					{status === 'past' ? 'text-gray-300 cursor-not-allowed' : ''}
					{status === 'full' ? 'bg-red-50 text-red-300 cursor-not-allowed' : ''}
					{status === 'limited' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer' : ''}
					{status === 'available' ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer' : ''}
					{isSelected ? 'ring-2 ring-primary bg-primary text-white hover:bg-primary-dark' : ''}"
			>
				{day}
			</button>
		{/each}
	</div>

	<!-- Legend -->
	<div class="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs text-gray-500">
		<div class="flex items-center gap-1.5">
			<div class="w-3 h-3 rounded bg-green-50 border border-green-200"></div>
			<span>Beschikbaar</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-3 h-3 rounded bg-amber-50 border border-amber-200"></div>
			<span>Nog 1 vrij</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
			<span>Volzet</span>
		</div>
	</div>

	{#if loading}
		<div class="text-center text-sm text-gray-400 mt-2">Laden...</div>
	{/if}
</div>
