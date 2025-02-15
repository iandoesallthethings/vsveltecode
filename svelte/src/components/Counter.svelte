<script lang="ts">
	import useVscodeState from '../lib/useVscodeState.svelte'
	import * as Messages from '../lib/Messages'

	let state = useVscodeState()

	function increment() {
		Messages.post('increment')
	}

	function reset() {
		Messages.post('reset')
	}
</script>

<button onclick={increment}>
	count is {state.count}
</button>

<button onclick={reset}>Reset</button>
