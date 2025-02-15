import * as vscode from 'vscode'
import svelteWebview from './lib/svelteWebview'
import State from './lib/state'
import { Message } from './types'

export function activate(context: vscode.ExtensionContext) {
	console.log('✨ Congratulations, your extension "vsveltecode" is now active!')

	const disposable = vscode.commands.registerCommand('vsveltecode.helloWorld', () => {
		const state = new State(context)

		state.panel = svelteWebview(context, 'Hello World', 'HelloWorld', handleSvelteMessage)

		function handleSvelteMessage(message: Message) {
			switch (message.command) {
				case 'test':
					vscode.window.showInformationMessage(message.content)
					break
				case 'increment':
					state.update({ count: state.get().count + 1 })
					break
			}
		}

		vscode.window.onDidChangeActiveTextEditor((editor) => {
			const currentFile = editor?.document.uri.path
			state.update({ currentFile })
		})
	})

	context.subscriptions.push(disposable)
}

export function deactivate() {}
