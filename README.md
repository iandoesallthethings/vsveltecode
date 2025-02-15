# VSvelteCode
A template for building vscode extensions using svelte.

## Getting Started
Most of what you need for development can be done from the root directory.

1. Install deps 
	```bash
	npm install
	```

2. Start a debug session with `F5` or `Debug > Start Debugging` in the command palette. This will open a new instance of vscode with the extension loaded.

3. In the new extension host window, open the webview in one of 2 ways
   1. Run the command `VSvelteCode: Hello World` from the command palette.
	 2. Click the globe icon in the top right.

## Developing
There are two subdirectories to this project: The `/extension` itself and the `/svelte` webview. 

### Extension
This is where the business logic of interacting with vscode should live. Check out `extension.ts` for the main entry point. It registers a command that launches a webview using `svelteWebview.ts`, which does all the heavy lifting of pulling in the built svelte code and rendering it, passing a few necessary variables, etc. 

### Svelte
This is just a regular vite/svelte app + tailwind with a few notable exceptions. The `vscode` api is available as a global to send messages (see `lib/Messages.ts`).

### Managing state
The default way to send state back and forth is via messages, which is covered in the official docs. I wanted to abstract things a little, so I'm working on a pattern so I can think less.

The two main points of interest here are the `State` class in the extension and the `useVscodeState` rune in svelte. These are intended as a bonded pair so the two can seamlessly pass state back and forth. 

The actual app state is just a POJO, vaguely inspired by streamlit's session state. There's an interface in `types.ts` for the actual data that you can add to. The `State` class lets you update those values and does 2 things:
1. Persists it in the extension's workspace storage
2. Sends it to svelte, where the useVscodeState hook automatically/reactively updates it in the webview.

I'm still working on updates going back the other way. For now, your svelte should use `lib/Messages.post()`, and the messages should be handled in the handler you pass to `svelteWebview()`. I did my best to demonstrate a strong typesafe pattern, but it's a little verbose.

The api needs work still, but it's a decent start.

TODO(Ian): Explain this better lol

## Packaging
Extensions are packaged using `vsce`. The resulting `.vsix` file will appear in `/extension` and can be installed in any vscode instance/codespace/whatever.

```bash
npm run package
```


## Publishing
Publishing is done using `vsce` as well. You will need to have a publisher account on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage) and have your publisher name set in `extension/package.json` file.

```bash
npm run publish
```