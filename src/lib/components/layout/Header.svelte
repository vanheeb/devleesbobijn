<script lang="ts">
	import { page } from '$app/stores';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/', label: 'de vleesbobijn' },
		{ href: '/aanbod', label: 'Aanbod' },
		{ href: '/boeken', label: 'Boeken' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/over-ons', label: 'Over ons' },
		{ href: '/contact', label: 'Contact' }
	];

	function isActive(href: string, pathname: string) {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="bg-white shadow-sm sticky top-0 z-50">
	<nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
		<a href="/" class="flex items-center gap-2 text-xl text-primary">
			<img src="/images/logo.png" alt="de vleesbobijn" class="h-10 w-10 rounded-full object-cover" />
			<span class="font-display tracking-wide">de vleesbobijn</span>
		</a>

		<!-- Desktop nav -->
		<ul class="hidden md:flex items-center gap-1">
			{#each links as link}
				<li>
					<a
						href={link.href}
						class="px-3 py-2 rounded-lg text-sm font-medium transition-colors
							{isActive(link.href, $page.url.pathname)
								? 'bg-primary text-white'
								: 'text-gray-700 hover:bg-gray-100'}"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li class="ml-2">
				<a
					href="/boeken"
					class="bg-secondary hover:bg-secondary-dark text-primary-dark px-4 py-2 rounded-lg text-sm font-display transition-colors"
				>
					Nu boeken
				</a>
			</li>
		</ul>

		<!-- Mobile burger -->
		<button
			class="md:hidden p-2 text-gray-700"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if mobileOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</nav>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="md:hidden bg-white border-t">
			<ul class="px-4 py-2 space-y-1">
				{#each links as link}
					<li>
						<a
							href={link.href}
							onclick={() => (mobileOpen = false)}
							class="block px-3 py-2 rounded-lg text-sm font-medium
								{isActive(link.href, $page.url.pathname)
									? 'bg-primary text-white'
									: 'text-gray-700 hover:bg-gray-100'}"
						>
							{link.label}
						</a>
					</li>
				{/each}
				<li class="pt-2">
					<a
						href="/boeken"
						onclick={() => (mobileOpen = false)}
						class="block text-center bg-secondary hover:bg-secondary-dark text-primary-dark px-4 py-2 rounded-lg text-sm font-display"
					>
						Nu boeken
					</a>
				</li>
			</ul>
		</div>
	{/if}
</header>
