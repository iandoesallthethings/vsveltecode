import * as vscode from 'vscode'
import { defaultAppState, type AppState, type Message } from '../types'

/**
 * A shared state manager meant to pair with useVscodeState on the svelte side.
 *
 * WIP attempt at a clean vscode-side state manager (i.e. vscode equivalent of useVscodeState on the svelte side)
 * Bonus points if I can make it feel automagic and similar on both sides.
 *
 * It's a little less clean since it MUST have a reference to the panel.
 *
 * Wishlist:
 * 1. Importable singleton so we don't have to pass it around
 * 1.a. Could it be a function like useVscodeState instead of a class?
 * 2. Get two way assignment binding from svelte working
 * 3. Proxy so `state.get().messages` => `state.messages`, just like svelte's rune
 * 4. Make it generic over any shape of state in case you have 1 extension with multiple panels, etc
 */
export default class State {
	private _context: vscode.ExtensionContext // Not really necessary, but convenient so we don't have to pass it around.
	private _panel: vscode.WebviewPanel | null = null // If there's no panel rendered, just skip sending the state
	private _state: vscode.Memento
	private _stateKey: string
	private _defaultState: AppState

	constructor(context: vscode.ExtensionContext, options: Partial<StateOptions> = {}) {
		const combinedOptions = { ...(defaultOptions as StateOptions), ...options }

		this._context = context // Not needed, but convenient to pass around
		this._state = context.workspaceState
		this._stateKey = combinedOptions.stateKey
		this._defaultState = combinedOptions.defaultState

		// this.reset() // Uncomment this and rerun once if you bork up the state lol

		const initialState = this._get()
		if (!initialState) this.reset()
		this.update({ loading: false } as Partial<AppState>) // Hack just in case loading is stuck
	}

	get context() {
		return this._context
	}

	get panel() {
		return this._panel
	}

	set panel(panel) {
		panel?.onDidDispose(() => (this._panel = null), null, this.context.subscriptions) // Unset when disposed
		panel?.webview.onDidReceiveMessage(this._handleMessage.bind(this)) // Handle state chages from svelte
		this._panel = panel
	}

	// get(): AppState
	// get<K extends keyof AppState>(key: K): AppState[K]
	// get<K extends keyof AppState>(key?: K): AppState | AppState[K] {
	// 	const state = this._get()
	// 	if (key === undefined) return state
	// 	return state[key]
	// }

	get(): AppState {
		return this._get()
	}

	/** Updates only the keys you pass */
	update(updatedStateKeys: Partial<AppState>) {
		const newState = { ...this.get(), ...updatedStateKeys }
		this._set(newState)
		this._sendToSvelte()
	}

	reset() {
		const clean = this.getDefaultState()
		this.update(clean)
		return clean
	}

	getDefaultState() {
		return structuredClone(this._defaultState)
	}

	private async _handleMessage(message: Message) {
		switch (message.command) {
			case 'ready':
				this._sendToSvelte()
				break
			case 'updateState':
				this._updateFromSvelte(message.content)
				break
			case 'reset':
				this.reset()
				break
		}
	}

	/** Wrapping the primitive get so I don't have to typecast */
	private _get() {
		return this._state.get(this._stateKey) as AppState
	}

	/** Replaces entire state - don't really care to expose this */
	private _set(newState: AppState) {
		this._state.update(this._stateKey, newState)
	}

	private _sendToSvelte() {
		this._panel?.webview.postMessage({ command: 'updateState', content: this.get() })
	}

	/**
	 * Theoretically, this lets the svelte app naively update state values.
	 * Currently disabled because debugging is annoying
	 */
	private _updateFromSvelte(updatedStateKeys: Partial<AppState>) {
		throw new Error(`Temporarily disabled`)
		const newState = { ...this.get(), ...updatedStateKeys }
		this._set(newState)
	}
}

interface StateOptions {
	defaultState: AppState
	stateKey: string
}

const defaultOptions: StateOptions = {
	defaultState: defaultAppState,
	stateKey: 'appState',
}
