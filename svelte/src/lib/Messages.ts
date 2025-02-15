import type { Message } from '../types'

export function post<M extends Message>(command: M['command'], content: M['content'] = undefined) {
	vscode.postMessage({ command, content })
}
