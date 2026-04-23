<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/boekingen', label: 'Boekingen', icon: '📋' },
		{ href: '/admin/kalender', label: 'Kalender', icon: '📅' },
		{ href: '/admin/instellingen', label: 'Instellingen', icon: '⚙️' }
	];

	function isActive(href: string, pathname: string) {
		if (href === '/admin') return pathname === '/admin';
		return pathname.startsWith(href);
	}

	let sidebarOpen = $state(false);
</script>

<!-- Admin layout overrides the public layout -->
{#if $page.url.pathname === '/admin/login'}
	{@render children()}
{:else}
	<div class="flex min-h-[calc(100vh-4rem)]">
		<!-- Sidebar -->
		<aside class="hidden md:flex w-56 bg-gray-900 text-white flex-col">
			<div class="p-4 border-b border-gray-800">
				<h2 class="font-bold text-sm text-gray-400 uppercase">Admin Panel</h2>
			</div>
			<nav class="flex-1 p-2">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1
							{isActive(item.href, $page.url.pathname)
								? 'bg-primary text-white'
								: 'text-gray-300 hover:bg-gray-800'}"
					>
						<span>{item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
			<div class="p-4 border-t border-gray-800">
				<form method="POST" action="/admin/login?/logout">
					<a href="/" class="block text-xs text-gray-500 hover:text-gray-300 mb-2">← Naar website</a>
				</form>
			</div>
		</aside>

		<!-- Mobile nav -->
		<div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 px-2 py-1">
			<div class="flex justify-around">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex flex-col items-center py-2 px-3 text-xs
							{isActive(item.href, $page.url.pathname) ? 'text-primary' : 'text-gray-500'}"
					>
						<span class="text-lg">{item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Main content -->
		<div class="flex-1 p-6 md:p-8 pb-20 md:pb-8 overflow-auto">
			{@render children()}
		</div>
	</div>
{/if}
