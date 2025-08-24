import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("✅ My Autocomplete Extension is active!");

    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: '*' }, // works in any file
        {
            async provideCompletionItems(document, position) {
                // Get the text before the cursor
                const textBeforeCursor = document.getText(
                    new vscode.Range(new vscode.Position(0, 0), position)
                );

                // Hard-coded suggestion for testing
                const suggestion = new vscode.CompletionItem(
                    "print('Hello from my extension!')",
                    vscode.CompletionItemKind.Snippet
                );

                return [suggestion];
            }
        },
        "." // trigger on typing "."
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
