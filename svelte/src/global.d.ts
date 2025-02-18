import { WebviewApi } from 'vscode-webview'
import type { AppState } from './types'

declare global {
	declare const vscode: WebviewApi<AppState>
	declare const imagePath: string
}

export {}
