import type { Message, ViewName } from '../types'
import * as vscode from 'vscode'
import fs from 'fs'

/**
 * Sets up all the plumbing needed to inject svelte into a webview panel. Don't mess with this.
 * @param context The context object passed to the extension's activate function.
 * @param title The tab title of the webview panel.
 * @param viewName A unique name for the panel used to identify it later.
 * @param handleAppMessage A function that handles messages sent from the Svelte app to the extension.
 * @returns a reference to the panel.
 */
export default function svelteWebview<M extends Message = Message>(
	context: vscode.ExtensionContext,
	title = 'Hello World',
	viewName: ViewName = 'HelloWorld',
	handleAppMessage: (message: M) => void = (_) => {}
) {
	const distPath = vscode.Uri.joinPath(context.extensionUri, 'dist-svelte')
	const panel = vscode.window.createWebviewPanel(viewName, title, vscode.ViewColumn.Two, {
		enableScripts: true,
		localResourceRoots: [distPath],
		retainContextWhenHidden: true,
	})

	// General messages all svelte views will use.
	panel.webview.onDidReceiveMessage(async (message: Message) => {
		switch (message.command) {
			case 'ready': // Make sure the webview has rendered before sending the view to prevent race conditions.
				console.log('✨ Setting view')
				panel.webview.postMessage({ command: 'changeView', content: viewName })
				break
		}
	})

	// Handle extension-specific messages from the passed in handler.
	panel.webview.onDidReceiveMessage(handleAppMessage)

	panel.webview.html = html(context, panel)

	return panel
}

/**
 * Finds the built svelte assets and injects their uri into the html.
 * @param context The context object passed to the extension's activate function.
 * @param panel The webview panel object.
 * @returns The HTML string for the webview panel.
 */
function html(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
	const distPath = vscode.Uri.joinPath(context.extensionUri, 'dist-svelte')
	const assetsPath = vscode.Uri.joinPath(distPath, 'assets')

	// Svelte compiles these with dynamic names, so we do this find and replace dance
	const scriptName = fs.readdirSync(assetsPath.fsPath).find((name) => name.endsWith('.js'))
	const styleName = fs.readdirSync(assetsPath.fsPath).find((name) => name.endsWith('.css'))

	const htmlUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(distPath, 'index.html'))
	const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(assetsPath, scriptName!))
	const styleUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(assetsPath, styleName!))

	const imageUri = panel.webview.asWebviewUri(distPath)

	let html = fs
		.readFileSync(htmlUri.fsPath, 'utf-8')
		.replace(/\/assets\/index.*?\.js/, scriptUri.toString())
		.replace(/\/assets\/index.*?\.css/, styleUri.toString())
		.replace('<imagePath>', imageUri.toString())

	return html
}
