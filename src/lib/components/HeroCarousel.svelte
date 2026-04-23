<script lang="ts">
	type Slide = { src: string; alt: string };

	let { slides }: { slides: Slide[] } = $props();

	let current = $state(0);

	$effect(() => {
		const timer = setInterval(() => {
			current = (current + 1) % slides.length;
		}, 4500);
		return () => clearInterval(timer);
	});

	function prev() {
		current = (current - 1 + slides.length) % slides.length;
	}

	function next() {
		current = (current + 1) % slides.length;
	}
</script>

<div class="relative w-full h-full overflow-hidden">
	{#each slides as slide, i}
		<img
			src={slide.src}
			alt={slide.alt}
			class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 {i === current ? 'opacity-100' : 'opacity-0'}"
		/>
	{/each}

	<!-- Pijlen -->
	<button
		onclick={prev}
		aria-label="Vorige foto"
		class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<button
		onclick={next}
		aria-label="Volgende foto"
		class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>

	<!-- Dots -->
	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
		{#each slides as _, i}
			<button
				onclick={() => (current = i)}
				aria-label="Ga naar foto {i + 1}"
				class="w-2 h-2 rounded-full transition-all {i === current ? 'bg-white w-5' : 'bg-white/50'}"
			></button>
		{/each}
	</div>
</div>
