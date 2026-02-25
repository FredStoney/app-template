<svelte:head>
	<title>AppTemplate — Google login & Stripe payments, ready to go</title>
</svelte:head>

<!-- Nav -->
<header class="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
		<a href="/" class="text-lg font-bold tracking-tight text-gray-900">AppTemplate</a>
		<nav class="flex items-center gap-4">
			<a href="/pricing" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
				Pricing
			</a>
			<a
				href="/auth/login"
				class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
			>
				Get started
			</a>
		</nav>
	</div>
</header>

<!-- Hero -->
<main>
	<section class="mx-auto max-w-5xl px-4 pb-24 pt-20 text-center">
		<span
			class="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
		>
			Proof of concept · Google Auth + Stripe
		</span>

		<h1 class="mt-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
			Ship with auth and<br />payments already done
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-lg text-gray-500">
			A SvelteKit starter wired up with Google sign-in via Better Auth and subscription billing via
			Stripe — so you can focus on your actual product.
		</p>

		<div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="/auth/login"
				class="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
			>
				Get started free
			</a>
			<a
				href="/pricing"
				class="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
			>
				View pricing
			</a>
		</div>
	</section>

	<!-- Features -->
	<section class="border-t border-gray-100 bg-gray-50 py-20">
		<div class="mx-auto max-w-5xl px-4">
			<h2 class="text-center text-2xl font-bold tracking-tight text-gray-900">
				Everything you need to get started
			</h2>
			<p class="mt-3 text-center text-gray-500">
				The boring infrastructure is already built — jump straight to your idea.
			</p>

			<div class="mt-12 grid gap-6 sm:grid-cols-3">
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100"
					>
						<svg class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-900">Google sign-in</h3>
					<p class="mt-2 text-sm text-gray-500">
						One-click OAuth via Better Auth. Sessions are stored in your Postgres DB with Drizzle ORM — no magic, full control.
					</p>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100"
					>
						<svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-900">Stripe subscriptions</h3>
					<p class="mt-2 text-sm text-gray-500">
						Hosted Stripe Checkout handles PCI compliance. Webhooks update your DB automatically when payments succeed or fail.
					</p>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100"
					>
						<svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-900">Protected routes</h3>
					<p class="mt-2 text-sm text-gray-500">
						A server hook guards every private page. Unauthenticated requests are redirected to login — no extra wiring required.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing teaser -->
	<section class="py-20">
		<div class="mx-auto max-w-sm px-4 text-center">
			<h2 class="text-2xl font-bold tracking-tight text-gray-900">One simple plan</h2>
			<p class="mt-3 text-gray-500">Everything included, no surprises.</p>

			<div class="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
				<p class="text-4xl font-extrabold text-gray-900">
					$10
					<span class="text-lg font-medium text-gray-400">/ mo</span>
				</p>
				<ul class="mt-6 space-y-2 text-sm text-gray-600 text-left">
					{#each ['Full access to all features', 'Priority support', 'Cancel anytime'] as feature}
						<li class="flex items-center gap-2">
							<svg class="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							{feature}
						</li>
					{/each}
				</ul>
				<a
					href="/auth/login"
					class="mt-8 block w-full rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700"
				>
					Get started
				</a>
			</div>
		</div>
	</section>
</main>

<!-- Footer -->
<footer class="border-t border-gray-100 py-8">
	<div class="mx-auto max-w-5xl px-4 text-center text-sm text-gray-400">
		&copy; {new Date().getFullYear()} AppTemplate. Built with SvelteKit, Better Auth &amp; Stripe.
	</div>
</footer>
