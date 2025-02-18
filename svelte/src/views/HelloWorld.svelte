<script lang="ts">
	import svelteLogo from '../assets/svelte.svg'
	import viteLogo from '../assets/vite.svg'
	import vscodeLogo from '../assets/vscode.svg'
	import Counter from '../components/Counter.svelte'
	import useVscodeState from '../lib/useVscodeState.svelte'
	import * as Messages from '../lib/Messages'
	import * as Paths from '../lib/Paths'

	const appState = useVscodeState()

	let message = $state('')

	function test() {
		Messages.post('test', message ?? 'No message provided.')
	}
</script>

<div>
	<a href="https://vite.dev" target="_blank" rel="noreferrer">
		<img src={viteLogo} class="logo" alt="Vite Logo" />
	</a>
	<a href="https://svelte.dev" target="_blank" rel="noreferrer">
		<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
	</a>
	<a href="https://code.visualstudio.com" target="_blank" rel="noreferrer">
		<img src={vscodeLogo} class="logo vscode" alt="Vscode Logo" />
	</a>
</div>

<h1>Vite + Svelte + Vscode</h1>
<h2 class="knuckles text-yellow-500">& KNUCKLES</h2>
<a href="https://www.youtube.com/watch?v=LabIat9t-uY" target="_blank" rel="noreferrer">
	<img src={Paths.image('knuckles.png')} alt="& Knuckles" class="icon logo" />
</a>

<Counter />

<div class="flex flex-row gap-2">
	<input
		type="text"
		bind:value={message}
		placeholder="Send a message back to vscode!"
		class="grow"
	/>
	<button class="primary" onclick={test}>Send</button>
</div>

<div class="card">
	<h3>Active Editor file:</h3>
	<code>{appState.currentFile ?? 'None'}</code>
</div>
