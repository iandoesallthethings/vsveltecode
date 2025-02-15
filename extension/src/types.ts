export type ViewName = 'HelloWorld' | 'Splash'

export interface AppState {
	loading: boolean
	currentFile: string | null
	count: number
}

export const defaultAppState: AppState = { loading: false, currentFile: null, count: 0 }

export function getDefaultState(): AppState {
	return structuredClone(defaultAppState)
}

export interface BaseMessage<Command extends string, Content extends any = undefined> {
	command: Command
	content: Content
}

// State
type UpdateStateMessage = BaseMessage<'updateState', Partial<AppState>>
type ResetMessage = BaseMessage<'reset'>
// View
type ReadyMessage = BaseMessage<'ready'>
type GetAssetUriMessage = BaseMessage<'getAssetUri', string>
type ChangeViewMessage = BaseMessage<'changeView', ViewName>

// Actual app functionality
type TestMessage = BaseMessage<'test', string>
type IncrementMessage = BaseMessage<'increment'>

export type Message =
	| UpdateStateMessage
	| ReadyMessage
	| ResetMessage
	| GetAssetUriMessage
	| ChangeViewMessage
	| TestMessage
	| IncrementMessage

export type MessageName = Message['command']
export type MessageContent = Message['content']
