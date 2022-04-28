const vscode = require('vscode');

const htmlEntities = {
	nbsp: ' ',
	cent: '¢',
	pound: '£',
	yen: '¥',
	euro: '€',
	copy: '©',
	reg: '®',
	lt: '<',
	gt: '>',
	quot: '"',
	amp: '&',
	apos: '\''
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let replaceHtml = vscode.commands.registerCommand('html-entities-replace.replaceHtml', function () {
		// get active editor
		const textEditor = vscode.window.activeTextEditor;

		// if no active editor, return
		if (!textEditor) {
			return;
		}

		// all text
		const allText = textEditor.document.getText();

		// find html special entities and replace
		const replacedText = allText.replace(/\&([^;]+);/g, function (entity, entityCode) {
			let match;

			// if entity match the html entities mapping (e.g. &nbsp;)
			if (entityCode in htmlEntities) {
					return htmlEntities[entityCode];
			}
			
			// if entity match hex unicode pattern (e.g. &#x2f;)
			match = entityCode.match(/^#x([\da-fA-F]+)$/);
			if (match) {
					return String.fromCharCode(parseInt(match[1], 16));
			}
			
			// if entity match entities pattern (e.g. &#38;)
			match = entityCode.match(/^#(\d+)$/);
			if (match) {
					return String.fromCharCode(~~match[1]);
			}

			return entity;
		});

		// replace all text
		textEditor.edit((editBuilder) => {
			editBuilder.replace(new vscode.Range(0, 0, textEditor.document.lineCount, 0), replacedText);
		});
	});

	context.subscriptions.push(replaceHtml);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
