<script lang="ts">
	import type { Message, ViewName } from './types'
	import { HelloWorld, Splash } from './views'
	import type { Component } from 'svelte'

	const views: Record<ViewName, Component> = {
		Splash,
		HelloWorld,
	}

	let viewName = $state<ViewName>(Object.keys(views)[0] as ViewName)
	let View = $derived(views[viewName])

	function changeView({ data }: MessageEvent<Message>) {
		if (data.command !== 'changeView') return
		viewName = data.content
	}
</script>

<svelte:window onmessage={changeView} />

<main>
	<View />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		max-width: 100vw;
		height: 100vh;
	}
</style>
