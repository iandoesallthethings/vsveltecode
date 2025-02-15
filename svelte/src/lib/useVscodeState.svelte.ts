/**
 * A shared state management rune/hook meant to pair with State on the vscode side.
 */
import { type AppState, getDefaultState } from '../types'

export default function useVscodeState() {
	let initialValue: AppState = vscode.getState() ?? getDefaultState()

	let value = $state<AppState>(initialValue)

	$inspect(value)

	// Save the webview state whenever the rune updates
	$effect(() => {
		vscode.setState(value)
		// TODO: Two-way binding persist state updates from svelte in workspaceState.
		// vscode.postMessage({ command: 'updateState', content: value })
	})

	// listen for messages from our extension.
	$effect(() => {
		window.addEventListener('message', handleMessage)
		return () => window.removeEventListener('message', handleMessage)
	})

	function handleMessage({ data }: MessageEvent) {
		const { command, content } = data
		switch (command) {
			case 'updateState':
				value = { ...value, ...content }
				break
		}
	}

	// Proxy the state object so we don't have call appState.value
	return new Proxy({} as AppState, {
		get(_target, prop) {
			if (prop === 'value') {
				return value
			}
			return value[prop as keyof AppState]
		},
		set(_target, prop, newValue) {
			if (prop === 'value') {
				value = newValue
			} else {
				value = { ...value, [prop]: newValue }
			}
			return true
		},
		has(_target, prop) {
			return prop in value
		},
		ownKeys() {
			return Reflect.ownKeys(value)
		},
		getOwnPropertyDescriptor(_target, prop) {
			return Object.getOwnPropertyDescriptor(value, prop)
		},
	})
}
