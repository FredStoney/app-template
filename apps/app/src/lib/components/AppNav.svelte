<script lang="ts">
	interface Props {
		email: string;
		children?: import('svelte').Snippet;
	}

	let { email, children }: Props = $props();
</script>

<nav class="border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
		<a href="/dashboard" class="text-lg font-semibold text-gray-900">Dashboard</a>
		<div class="flex items-center gap-4">
			<a href="/settings" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">{email}</a>
			{@render children?.()}
		</div>
	</div>
</nav>
