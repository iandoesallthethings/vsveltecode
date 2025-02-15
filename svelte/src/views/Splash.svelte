<script lang="ts">
	import { onMount } from 'svelte'
	import * as Messages from '../lib/Messages'

	onMount(() => Messages.post('ready'))
</script>

<div class="h-full flex flex-col items-center justify-center">
	<h1>Loading</h1>
	<h1>🤖</h1>
	<h2 class="animate-pulse">···</h2>
</div>
