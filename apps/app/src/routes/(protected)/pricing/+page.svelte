<script lang="ts">
	import AppNav from '$lib/components/AppNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);
	let errorMessage = $state('');

	async function subscribe() {
		isLoading = true;
		errorMessage = '';

		try {
			const res = await fetch('/billing', { method: 'POST' });
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.message ?? 'Failed to start checkout');
			}
			const { url } = await res.json();
			window.location.href = url;
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Something went wrong';
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Pricing</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<AppNav email={data.user.email} />

	<main class="mx-auto max-w-5xl px-4 py-16">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900">Simple pricing</h1>
			<p class="mt-4 text-lg text-gray-500">One plan. Everything included.</p>
		</div>

		<div class="mx-auto mt-12 max-w-sm">
			<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
				<h2 class="text-xl font-semibold text-gray-900">Pro</h2>
				<div class="mt-4 flex items-baseline gap-1">
					<span class="text-4xl font-bold text-gray-900">$10</span>
					<span class="text-gray-500">/ month</span>
				</div>

				<ul class="mt-6 space-y-3 text-sm text-gray-600">
					<li class="flex items-center gap-2">
						<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						Full access to all features
					</li>
					<li class="flex items-center gap-2">
						<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						Priority support
					</li>
					<li class="flex items-center gap-2">
						<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						Cancel anytime
					</li>
				</ul>

				{#if errorMessage}
					<p class="mt-4 text-sm text-red-600">{errorMessage}</p>
				{/if}

				{#if data.isSubscribed}
					<div class="mt-8 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
						You're already subscribed
					</div>
				{:else}
					<button
						onclick={subscribe}
						disabled={isLoading}
						class="mt-8 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
					>
						{isLoading ? 'Redirecting to Stripe…' : 'Subscribe — $10/mo'}
					</button>
				{/if}
			</div>
		</div>
	</main>
</div>
