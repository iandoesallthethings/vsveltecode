import type { Message, ViewName } from '../types'
import * as vscode from 'vscode'
import fs from 'fs'

export default function svelteWebview<M extends Message = Message>(
	context: vscode.ExtensionContext,
	title = 'Hello World',
	viewName: ViewName = 'HelloWorld',
	handleAppMessage: (message: M) => void
) {
	const distPath = vscode.Uri.joinPath(context.extensionUri, 'dist-svelte')
	const panel = vscode.window.createWebviewPanel(viewName, title, vscode.ViewColumn.Two, {
		enableScripts: true,
		localResourceRoots: [distPath],
		retainContextWhenHidden: true,
	})

	const distUri = panel.webview.asWebviewUri(distPath)

	// General messages all svelte views will probably use
	panel.webview.onDidReceiveMessage(async (message: Message) => {
		switch (message.command) {
			case 'getAssetUri': // Todo: Find a way to just embed this in the html or something.
				panel.webview.postMessage({ command: 'assetUri', content: distUri.toString() })
				break
			case 'ready': // Make sure the webview has rendered before sending the view to prevent race conditions.
				console.log('✨ Setting view')
				panel.webview.postMessage({ command: 'changeView', content: viewName })
				break
		}
	})

	// View-specific messages - I imagine we could make this dynamic by view
	panel.webview.onDidReceiveMessage(handleAppMessage)

	panel.webview.html = html(context, panel)

	return panel
}

function html(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
	const distPath = vscode.Uri.joinPath(context.extensionUri, 'dist-svelte')
	const assetsPath = vscode.Uri.joinPath(distPath, 'assets')

	// Svelte compiles these with dynamic names, so we do this find and replace dance
	const scriptName = fs.readdirSync(assetsPath.fsPath).find((name) => name.endsWith('.js'))
	const styleName = fs.readdirSync(assetsPath.fsPath).find((name) => name.endsWith('.css'))

	const htmlUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(distPath, 'index.html'))
	const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(assetsPath, scriptName!))
	const styleUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(assetsPath, styleName!))

	let html = fs
		.readFileSync(htmlUri.fsPath, 'utf-8')
		.replace(/\/assets\/index.*?\.js/, scriptUri.toString())
		.replace(/\/assets\/index.*?\.css/, styleUri.toString())

	return html
}
