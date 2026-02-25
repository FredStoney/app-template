<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let isLoading = $state(false);
	let error = $state('');

	async function signInWithGoogle() {
		isLoading = true;
		error = '';

		const { error: signInError } = await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/dashboard'
		});

		if (signInError) {
			error = signInError.message ?? 'Failed to sign in with Google. Please try again.';
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100"
			>
				<svg
					class="h-6 w-6 text-indigo-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
			<p class="mt-2 text-sm text-gray-500">Sign in to continue to your account</p>
		</div>

		{#if error}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{error}
			</div>
		{/if}

		<div class="space-y-3">
			<button
				onclick={signInWithGoogle}
				disabled={isLoading}
				class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
					<svg
						class="h-5 w-5 animate-spin text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Signing in…
				{:else}
					<svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					Continue with Google
				{/if}
			</button>
		</div>

		<p class="text-center text-xs text-gray-400">
			New users will have an account created automatically on first sign-in.
		</p>
	</div>
</div>
