// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  console.log(
    'Congratulations, your extension "create-react-component" is now active!'
  );

  let defaultComponent = vscode.commands.registerCommand(
    'create-react-component.default-component',
    (args) => {
      create(args, 'default-component');
    }
  );

  let pageComponent = vscode.commands.registerCommand(
    'create-react-component.page-component',
    (args) => {
      create(args, 'page-component');
    }
  );

  const create = (args: any, templateName: string) => {
    let incomingPath: string = args._fsPath;

    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        validateInput: (value) => {
          if (value.indexOf(' ') > -1) {
            return 'Component name cannot include spaces';
          }
        },
        prompt: 'Please enter component name',
        value: 'MyNewComponent',
      })
      .then((componentName) => {
        if (typeof componentName === 'undefined') {
          return;
        }

        var componentFolderPath = incomingPath + path.sep + componentName;

        console.log('new file path', componentFolderPath);
        if (fs.existsSync(componentFolderPath)) {
          vscode.window.showErrorMessage('Component folder already exists');
          return;
        }

        fs.mkdirSync(componentFolderPath);
        const componentPath =
          componentFolderPath + path.sep + componentName + '.tsx';

        const extension = vscode.extensions.getExtension(
          'chrispaynter.create-react-component'
        );

        vscode.workspace
          .openTextDocument(
            extension!.extensionPath + '/templates/' + templateName + '.tmpl'
          )
          .then((doc: vscode.TextDocument) => {
            fs.writeFileSync(
              componentPath,
              doc.getText().split('${componentName}').join(componentName)
            );
            vscode.workspace.openTextDocument(componentPath).then(doc => {
              vscode.window.showTextDocument(doc);
            });
          });

        const indexPath = componentFolderPath + path.sep + 'index.ts';
        vscode.workspace
          .openTextDocument(
            extension!.extensionPath + '/templates/' + 'index.tmpl'
          )
          .then((doc: vscode.TextDocument) => {
            fs.writeFileSync(
              indexPath,
              doc.getText().split('${componentName}').join(componentName)
            );
          });

        const stylesPath = componentFolderPath + path.sep + 'styles.ts';
        vscode.workspace
          .openTextDocument(
            extension!.extensionPath + '/templates/' + 'styles.tmpl'
          )
          .then((doc: vscode.TextDocument) => {
            fs.writeFileSync(
              stylesPath,
              doc.getText()
            );
          });

        vscode.window.showInformationMessage('Created component');
      });
  };

  context.subscriptions.push(defaultComponent);
  context.subscriptions.push(pageComponent);
}

// this method is called when your extension is deactivated
export function deactivate() {}
