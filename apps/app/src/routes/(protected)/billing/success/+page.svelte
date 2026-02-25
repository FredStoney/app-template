<svelte:head>
	<title>Subscription confirmed</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
		<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
			<svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		</div>

		<h1 class="mt-6 text-2xl font-bold text-gray-900">You're subscribed!</h1>
		<p class="mt-3 text-gray-500">
			Your Pro subscription is now active. It may take a moment for your account to update.
		</p>

		<a
			href="/dashboard"
			class="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
		>
			Go to dashboard
		</a>
	</div>
</div>
