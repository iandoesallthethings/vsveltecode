import * as vscode from 'vscode'
import svelteWebview from './lib/svelteWebview'
import State from './lib/state'
import { Message } from './types'

export function activate(context: vscode.ExtensionContext) {
	console.log('✨ Congratulations, your extension is now active!')

	// If you have multiple commands, webviews, etc, it's nicer to modularize. Just return the disposable from the function.
	const helloWorldDisposable = vscode.commands.registerCommand('vsveltecode.helloWorld', () => {
		const state = new State(context)

		function handleSvelteMessage(message: Message) {
			switch (message.command) {
				case 'test':
					vscode.window.showInformationMessage(message.content)
					break

				case 'increment':
					state.update({ count: state.get().count + 1 })
					break

				// Handle any other buttons/inputs/etc from svelte here.
				// I don't recommend a default case here since internal stuff
				// is also handled by the same onDidReceiveMessage event.
			}
		}

		// Instantiate the svelte webview panel and add it to the state object for later use.
		state.panel = svelteWebview(context, 'Hello World', 'HelloWorld', handleSvelteMessage)

		// You can handle any other events wherever you want. For example,
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			const currentFile = editor?.document.uri.path
			state.update({ currentFile })
		})
	})

	context.subscriptions.push(helloWorldDisposable)
}

export function deactivate() {}
