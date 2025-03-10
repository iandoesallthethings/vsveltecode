export type ViewName = 'HelloWorld' | 'Splash'

/** The schema of the state you want to persist in vscode. Edit this interface to your liking. */
export interface AppState {
	loading: boolean
	currentFile: string | null
	count: number
}

/** Returns a fresh copy of the default state. */
export function getDefaultState(): AppState {
	return {
		loading: false,
		currentFile: null,
		count: 0,
	}
}

interface BaseMessage<Command extends string, Content extends any = undefined> {
	command: Command
	content: Content
}

// State and view boilerplate
type UpdateStateMessage = BaseMessage<'updateState', Partial<AppState>>
type ResetMessage = BaseMessage<'reset'>
type ReadyMessage = BaseMessage<'ready'>
type ChangeViewMessage = BaseMessage<'changeView', ViewName>

// Your features
type TestMessage = BaseMessage<'test', string>
type IncrementMessage = BaseMessage<'increment'>

export type Message =
	| UpdateStateMessage
	| ReadyMessage
	| ResetMessage
	| ChangeViewMessage
	| TestMessage
	| IncrementMessage

export type MessageName = Message['command']
export type MessageContent = Message['content']
