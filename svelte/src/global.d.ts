import { WebviewApi } from 'vscode-webview'
import type { AppState, ViewName } from './types'

declare global {
	declare const vscode: WebviewApi<AppState>
	declare const imagePath: string
	declare const viewName: ViewName
}

export {}
