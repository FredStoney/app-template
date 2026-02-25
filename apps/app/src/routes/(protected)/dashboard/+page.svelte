<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isSigningOut = $state(false);

	async function signOut() {
		isSigningOut = true;
		await authClient.signOut();
		goto('/auth/login');
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
			<div class="flex items-center gap-4">
				{#if data.user.image}
					<img
						src={data.user.image}
						alt={data.user.name}
						class="h-8 w-8 rounded-full object-cover"
					/>
				{/if}
				<span class="text-sm text-gray-600">{data.user.name}</span>
				<button
					onclick={signOut}
					disabled={isSigningOut}
					class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
				>
					{isSigningOut ? 'Signing out…' : 'Sign out'}
				</button>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-5xl px-4 py-10">
		<div class="rounded-2xl bg-white p-8 shadow-sm">
			<h2 class="text-2xl font-bold text-gray-900">
				Welcome, {data.user.name}!
			</h2>
			<p class="mt-2 text-gray-500">You're signed in with Google.</p>

			<dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Name</dt>
					<dd class="mt-1 text-sm font-medium text-gray-900">{data.user.name}</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
					<dd class="mt-1 text-sm font-medium text-gray-900">{data.user.email}</dd>
				</div>
			</dl>

			<div class="mt-6 border-t border-gray-100 pt-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-xs font-medium uppercase tracking-wide text-gray-400">Subscription</p>
						{#if data.subscription}
							<div class="mt-1 flex items-center gap-2">
								<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
									Active
								</span>
								<span class="text-sm text-gray-500">
									Renews {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}
								</span>
							</div>
						{:else}
							<div class="mt-1 flex items-center gap-2">
								<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
									Free
								</span>
							</div>
						{/if}
					</div>
					{#if !data.subscription}
						<a
							href="/pricing"
							class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
						>
							Upgrade to Pro
						</a>
					{/if}
				</div>
			</div>
		</div>
	</main>
</div>
