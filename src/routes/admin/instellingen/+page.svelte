<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Instellingen - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Instellingen</h1>

{#if form?.success}
	<div class="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 text-green-700 text-sm">
		{form.message || 'Opgeslagen!'}
	</div>
{/if}

<!-- Grills -->
<section class="mb-8">
	<h2 class="text-lg font-bold mb-4">Grills</h2>
	<div class="space-y-3">
		{#each data.grills as grill}
			<div class="bg-white rounded-xl border p-4 flex items-center justify-between">
				<div>
					<span class="font-medium">{grill.name}</span>
					<span class="text-sm text-gray-500 ml-2">({grill.type})</span>
				</div>
				<form method="POST" action="?/toggleGrill" use:enhance>
					<input type="hidden" name="grillId" value={grill.id} />
					<input type="hidden" name="active" value={grill.active ? 'false' : 'true'} />
					<button
						type="submit"
						class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
							{grill.active
								? 'bg-green-100 text-green-700 hover:bg-green-200'
								: 'bg-red-100 text-red-700 hover:bg-red-200'}"
					>
						{grill.active ? 'Actief' : 'Inactief'}
					</button>
				</form>
			</div>
		{/each}
	</div>
</section>

<!-- Packages -->
<section class="mb-8">
	<h2 class="text-lg font-bold mb-4">Pakket prijzen</h2>
	<div class="space-y-3">
		{#each data.packages as pkg}
			<form method="POST" action="?/updatePackagePrice" use:enhance
				class="bg-white rounded-xl border p-4 flex items-center justify-between gap-4"
			>
				<div class="flex-1">
					<span class="font-medium">{pkg.name}</span>
					<span class="text-sm text-gray-500 ml-2">({pkg.weightKg}kg {pkg.type})</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="hidden" name="packageId" value={pkg.id} />
					<span class="text-gray-500">€</span>
					<input
						type="number"
						name="price"
						value={(pkg.price / 100).toFixed(0)}
						step="1"
						min="0"
						class="w-24 px-3 py-1.5 rounded-lg border border-gray-300 text-right font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
					/>
					<button
						type="submit"
						class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg font-medium transition-colors"
					>
						Opslaan
					</button>
				</div>
			</form>
		{/each}
	</div>
</section>

<!-- Extras -->
<section>
	<h2 class="text-lg font-bold mb-4">Extra's prijzen</h2>
	<div class="space-y-3">
		{#each data.extras as extra}
			<form method="POST" action="?/updateExtraPrice" use:enhance
				class="bg-white rounded-xl border p-4 flex items-center justify-between gap-4"
			>
				<div class="flex-1">
					<span class="font-medium">{extra.name}</span>
					<span class="text-sm text-gray-500 ml-2">per {extra.unit}</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="hidden" name="extraId" value={extra.id} />
					<span class="text-gray-500">€</span>
					<input
						type="number"
						name="price"
						value={(extra.pricePerUnit / 100).toFixed(0)}
						step="1"
						min="0"
						class="w-24 px-3 py-1.5 rounded-lg border border-gray-300 text-right font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
					/>
					<button
						type="submit"
						class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg font-medium transition-colors"
					>
						Opslaan
					</button>
				</div>
			</form>
		{/each}
	</div>
</section>
