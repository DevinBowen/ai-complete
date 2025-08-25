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

                try {
                    const completionText = await fetchCompletion(textBeforeCursor, 50);
                    
                    const suggestion = new vscode.CompletionItem(
                        completionText,
                        vscode.CompletionItemKind.Snippet
                    );
                    return [suggestion];
                } catch (err: any) {
                    vscode.window.showErrorMessage(`AI Complete Error: ${err.message}`);
                    return [];
                }
            }
        },
        "." // trigger on typing "."
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}

/**
 * Calls the Flask API at /complete with the given prompt.
 */
async function fetchCompletion(prompt: string, maxTokens: number = 50): Promise<string> {
    const response = await fetch("http://localhost:8000/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: 'print("test")', max_tokens: maxTokens })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data: any = await response.json();
    return data.completion; // Make sure this matches your Flask API's JSON key
}