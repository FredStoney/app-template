<script lang="ts">
	import AppNav from '$lib/components/AppNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<AppNav email={data.user.email} />

	<main class="mx-auto max-w-5xl px-4 py-10">
		<h1 class="text-2xl font-bold text-gray-900">Settings</h1>

		<div class="mt-6 space-y-6">
			<!-- Profile -->
			<section class="rounded-2xl bg-white p-8 shadow-sm">
				<h2 class="text-base font-semibold text-gray-900">Profile</h2>
				<p class="mt-1 text-sm text-gray-500">Your account information from Google.</p>

				<div class="mt-6 flex items-center gap-5">
					{#if data.user.image}
						<img
							src={data.user.image}
							alt={data.user.name}
							referrerpolicy="no-referrer"
							class="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
						/>
					{:else}
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-500">
							{data.user.name?.charAt(0).toUpperCase() ?? '?'}
						</div>
					{/if}
					<div>
						<p class="text-sm font-medium text-gray-900">{data.user.name}</p>
						<p class="text-sm text-gray-500">{data.user.email}</p>
					</div>
				</div>

				<dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Name</dt>
						<dd class="mt-1 text-sm font-medium text-gray-900">{data.user.name}</dd>
					</div>
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
						<dd class="mt-1 text-sm font-medium text-gray-900">{data.user.email}</dd>
					</div>
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Account ID</dt>
						<dd class="mt-1 font-mono text-xs text-gray-600">{data.user.id}</dd>
					</div>
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Sign-in provider</dt>
						<dd class="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-900">
							<svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
							</svg>
							Google
						</dd>
					</div>
				</dl>
			</section>
		</div>
	</main>
</div>
