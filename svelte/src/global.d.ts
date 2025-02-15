import { WebviewApi } from 'vscode-webview'
import type { AppState } from './types'

declare global {
	declare const vscode: WebviewApi<AppState>
}

export {}
