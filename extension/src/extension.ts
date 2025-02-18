import * as vscode from 'vscode'
import svelteWebview from './lib/svelteWebview'
import State from './lib/state'
import { Message } from './types'

export function activate(context: vscode.ExtensionContext) {
	console.log('✨ Congratulations, your extension "vsveltecode" is now active!')

	// If you have multiple commands, it's best to pull this whole callback into a
	// separate file and return the disposable.
	const disposable = vscode.commands.registerCommand('vsveltecode.helloWorld', () => {
		const state = new State(context)

		// Instantiate the svelte webview panel and add it to the state object for later use.
		state.panel = svelteWebview(context, 'Hello World', 'HelloWorld', handleSvelteMessage)

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

		// You can handle any other events wherever you want. For example,
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			const currentFile = editor?.document.uri.path
			state.update({ currentFile })
		})
	})

	context.subscriptions.push(disposable)
}

export function deactivate() {}
