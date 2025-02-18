<script lang="ts">
	import type { Message, ViewName } from './types'
	import { HelloWorld, Splash } from './views'
	import type { Component } from 'svelte'

	const views: Record<ViewName, Component> = {
		Splash,
		HelloWorld,
	}

	// let currentView = $state<ViewName>(Object.keys(views)[0] as ViewName)
	let currentView = $state<ViewName>(viewName)
	let View = $derived(views[currentView])

	function changeView({ data }: MessageEvent<Message>) {
		if (data.command !== 'changeView') return
		currentView = data.content
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
