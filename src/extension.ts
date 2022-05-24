// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('pytorch-aws-scratch-helper.allocateServer', () => {
		const terminal = vscode.window.createTerminal("KEEP OPEN - Salloc-ing scratch");
		terminal.show(true);
		const serverNumber = 49;
		terminal.sendText(`ssh -t f392b7dc-4dec-47a7-8887-9bcd206c4a79 '/opt/slurm/bin/salloc -p dev -G 1 -t 5:00:00 -w a100-st-p4d24xlarge-${serverNumber} --exclusive'`);
		cp.execSync(`echo ${serverNumber} > ~/.ssh/ai_ssh/$USER/number.txt`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pytorch-aws-scratch-helper.initialSetup', async () => {
		const terminal = vscode.window.createTerminal("Run commands");
		terminal.show(true);
		terminal.sendText('echo 5');
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
