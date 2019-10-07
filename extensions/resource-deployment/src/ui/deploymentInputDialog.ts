/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { DialogBase } from './dialogBase';
import { INotebookService } from '../services/notebookService';
import { DialogInfo, instanceOfNotebookBasedDialogInfo } from '../interfaces';
import { Validator, initializeDialog, InputComponents, setModelValues } from './modelViewUtils';
import { Model } from './model';
import { EOL } from 'os';

const localize = nls.loadMessageBundle();

export class DeploymentInputDialog extends DialogBase {

	private inputComponents: InputComponents = {};

	constructor(private notebookService: INotebookService,
		private dialogInfo: DialogInfo) {
		super(dialogInfo.title, dialogInfo.name, false);
		this._dialogObject.okButton.label = localize('deploymentDialog.OKButtonText', 'Open Notebook');
	}

	protected initialize() {
		const self = this;
		const validators: Validator[] = [];
		initializeDialog({
			dialogInfo: this.dialogInfo,
			container: this._dialogObject,
			onNewDisposableCreated: (disposable: vscode.Disposable): void => {
				this._toDispose.push(disposable);
			},
			onNewInputComponentCreated: (name: string, component: azdata.DropDownComponent | azdata.InputBoxComponent | azdata.CheckBoxComponent): void => {
				this.inputComponents[name] = component;
			},
			onNewValidatorCreated: (validator: Validator): void => {
				validators.push(validator);
			}
		});
		this._dialogObject.registerCloseValidator(() => {
			const messages: string[] = [];
			validators.forEach(validator => {
				const result = validator();
				if (!result.valid) {
					messages.push(result.message);
				}
			});
			if (messages.length > 0) {
				self._dialogObject.message = { level: azdata.window.MessageLevel.Error, text: messages.join(EOL) };
			} else {
				self._dialogObject.message = { text: '' };
			}
			return messages.length === 0;
		});
	}

	protected onComplete(): void {
		const model: Model = new Model();
		setModelValues(this.inputComponents, model);
		if (instanceOfNotebookBasedDialogInfo(this.dialogInfo)) {
			model.setEnvironmentVariables();
			this.notebookService.launchNotebook(this.dialogInfo.notebook).then(() => { }, (error) => {
				vscode.window.showErrorMessage(error);
			});
		} else {
			vscode.commands.executeCommand(this.dialogInfo.command, model);
		}
	}
}
