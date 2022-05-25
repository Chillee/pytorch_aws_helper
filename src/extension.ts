// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as process from 'process';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('pytorch-aws-scratch-helper.allocateServer', async () => {
		const path = `${process.env.HOME!.trim()}/.ssh/ai_ssh/${process.env.USER!.trim()}/number.txt`;
		let previous_val = undefined;
		if (fs.existsSync(path)) {
			previous_val = fs.readFileSync(path).toString();
		}
		const searchQuery = await vscode.window.showInputBox({
			value: previous_val,
			prompt: "Enter the number of the compute node you want to use",
		  });
		if (searchQuery === undefined) {
			throw "Didn't provide a number";
		}

		const terminal = vscode.window.createTerminal("Salloc-ing scratch");
		terminal.show(true);
		const serverNumber = parseInt(searchQuery);
		terminal.sendText(`ssh -t f392b7dc-4dec-47a7-8887-9bcd206c4a79 'tmux new -d "/opt/slurm/bin/salloc -p dev -G 1 -t 5:00:00 -w a100-st-p4d24xlarge-${serverNumber} --exclusive"'`);
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
