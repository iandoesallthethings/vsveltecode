<!-- 
  -- We might be able to avoid this song and dance,
	-- but I couldn't get direct variable injection working
	-- quite like I did with the vscode api. I'd prefer assetUri to 
	-- be a global.
  -->

<script lang="ts">
	let { src, alt, class: classes } = $props()

	let assetUri = $state<string>()
	let assetSrc = $derived(`${assetUri}/${src}`)

	function requestUri() {
		window.addEventListener('message', handleAssetUri)
		vscode.postMessage({ command: 'getAssetUri' }) // Poke svelteWebview.ts to send the uri
		return () => window.removeEventListener('message', handleAssetUri) // Cleanup the listener
	}

	function handleAssetUri({ data }: MessageEvent) {
		if (data.command === 'assetUri') assetUri = data.content
	}

	$effect(requestUri)
</script>

<img src={assetSrc} {alt} class={classes} />
