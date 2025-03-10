<script lang="ts">
	import type { Message, ViewName } from './types'
	import { HelloWorld, Splash } from './views'
	import { onMount, type Component } from 'svelte'
	import * as Messages from './lib/Messages'

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

	onMount(() => Messages.post('ready')) // Notify the extension that the webview is ready
</script>

<svelte:window onmessage={changeView} />

<main class="flex flex-col items-center gap-4 max-w-[100vw] h-[100vh]">
	<View />
</main>
