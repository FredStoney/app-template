<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import AppNav from '$lib/components/AppNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isSigningOut = $state(false);
	let isConfirmingCancel = $state(false);
	let isCanceling = $state(false);
	let isConfirmingDelete = $state(false);
	let isDeleting = $state(false);

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
	<AppNav email={data.user.email}>
		{#if data.user.image}
			<img
				src={data.user.image}
				alt={data.user.name}
				referrerpolicy="no-referrer"
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
	</AppNav>

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

			<!-- Subscription section -->
			<div class="mt-6 border-t border-gray-100 pt-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-xs font-medium uppercase tracking-wide text-gray-400">Subscription</p>
						{#if data.subscription}
							{#if data.subscription.cancelAtPeriodEnd}
								<div class="mt-1 flex items-center gap-2">
									<span class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
										Canceling
									</span>
									<span class="text-sm text-gray-500">
										Access until {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}
									</span>
								</div>
							{:else}
								<div class="mt-1 flex items-center gap-2">
									<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
										Active
									</span>
									<span class="text-sm text-gray-500">
										Renews {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}
									</span>
								</div>
							{/if}
						{:else}
							<div class="mt-1 flex items-center gap-2">
								<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
									Free
								</span>
							</div>
						{/if}
					</div>

					<div class="flex items-center gap-3">
						{#if !data.subscription}
							<a
								href="/pricing"
								class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
							>
								Upgrade to Pro
							</a>
						{:else if !data.subscription.cancelAtPeriodEnd}
							{#if isConfirmingCancel}
								<p class="text-sm text-gray-600">Cancel at end of billing period?</p>
								<form
									method="POST"
									action="?/cancelSubscription"
									use:enhance={() => {
										isCanceling = true;
										return async ({ update }) => {
											await update();
											isCanceling = false;
											isConfirmingCancel = false;
										};
									}}
								>
									<button
										type="submit"
										disabled={isCanceling}
										class="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
									>
										{isCanceling ? 'Canceling…' : 'Confirm cancel'}
									</button>
								</form>
								<button
									onclick={() => (isConfirmingCancel = false)}
									class="text-sm text-gray-500 hover:text-gray-700"
								>
									Never mind
								</button>
							{:else}
								<button
									onclick={() => (isConfirmingCancel = true)}
									class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
								>
									Cancel subscription
								</button>
							{/if}
						{/if}
					</div>
				</div>
			</div>

			<!-- Danger zone -->
			<div class="mt-6 rounded-xl border border-red-200 p-6">
				<h3 class="text-sm font-semibold text-red-700">Danger zone</h3>
				<p class="mt-1 text-sm text-gray-500">
					Permanently delete your account and all associated data. Any active subscription will be
					cancelled immediately with no refund.
				</p>

				{#if isConfirmingDelete}
					<div class="mt-4 rounded-lg bg-red-50 p-4">
						<p class="text-sm font-medium text-red-800">
							Are you sure? This cannot be undone.
						</p>
						<div class="mt-3 flex items-center gap-3">
							<form
								method="POST"
								action="?/deleteAccount"
								use:enhance={() => {
									isDeleting = true;
									return async ({ update }) => {
										await update();
										isDeleting = false;
									};
								}}
							>
								<button
									type="submit"
									disabled={isDeleting}
									class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
								>
									{isDeleting ? 'Deleting…' : 'Yes, delete my account'}
								</button>
							</form>
							<button
								onclick={() => (isConfirmingDelete = false)}
								class="text-sm text-gray-500 hover:text-gray-700"
							>
								Never mind
							</button>
						</div>
					</div>
				{:else}
					<button
						onclick={() => (isConfirmingDelete = true)}
						class="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
					>
						Delete account
					</button>
				{/if}
			</div>
		</div>
	</main>
</div>
