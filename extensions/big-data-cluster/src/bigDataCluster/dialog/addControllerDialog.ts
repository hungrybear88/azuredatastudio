/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as azdata from 'azdata';
import * as nls from 'vscode-nls';
import { ClusterController, ControllerError } from '../controller/clusterControllerApi';
import { ControllerTreeDataProvider } from '../tree/controllerTreeDataProvider';
import { TreeNode } from '../tree/treeNode';
import { showErrorMessage } from '../utils';
import { AuthType } from '../constants';

const localize = nls.loadMessageBundle();

const basicAuthDisplay = localize('basicAuthName', "Basic");
const integratedAuthDisplay = localize('integratedAuthName', "Windows Authentication");

function getAuthCategory(name: AuthType): azdata.CategoryValue {
	if (name === 'basic') {
		return { name: name, displayName: basicAuthDisplay };
	}
	return { name: name, displayName: integratedAuthDisplay };
}

export class AddControllerDialogModel {

	private _canceled = false;
	private _authTypes: azdata.CategoryValue[];
	constructor(
		public treeDataProvider: ControllerTreeDataProvider,
		public node?: TreeNode,
		public prefilledUrl?: string,
		public prefilledAuth?: azdata.CategoryValue,
		public prefilledUsername?: string,
		public prefilledPassword?: string,
		public prefilledRememberPassword?: boolean
	) {
		this.prefilledUrl = prefilledUrl || (node && node['url']);
		this.prefilledAuth = prefilledAuth;
		if (!prefilledAuth) {
			let auth = (node && node['auth']) || 'basic';
			this.prefilledAuth = getAuthCategory(auth);
		}
		this.prefilledUsername = prefilledUsername || (node && node['username']);
		this.prefilledPassword = prefilledPassword || (node && node['password']);
		this.prefilledRememberPassword = prefilledRememberPassword || (node && node['rememberPassword']);
	}

	public get authCategories(): azdata.CategoryValue[] {
		if (!this._authTypes) {
			this._authTypes = [getAuthCategory('basic'), getAuthCategory('integrated')];
		}
		return this._authTypes;
	}

	public async onComplete(url: string, auth: AuthType, username: string, password: string, rememberPassword: boolean): Promise<void> {
		try {

			if (auth === 'basic') {
				// Verify username and password as we can't make them required in the UI
				if (!username) {
					throw new Error(localize('err.controller.username.required', "Username is required"));
				} else if (!password) {
					throw new Error(localize('err.controller.password.required', "Password is required"));
				}
			}
			// We pre-fetch the endpoints here to verify that the information entered is correct (the user is able to connect)
			let controller = new ClusterController(url, auth, username, password, true);
			let response = await controller.getEndPoints();
			if (response && response.endPoints) {
				if (this._canceled) {
					return;
				}
				this.treeDataProvider.addController(url, auth, username, password, rememberPassword);
				await this.treeDataProvider.saveControllers();
			}
		} catch (error) {
			// Ignore the error if we cancelled the request since we can't stop the actual request from completing
			if (!this._canceled) {
				throw error;
			}
		}

	}

	public async onError(error: ControllerError): Promise<void> {
		// implement
	}

	public async onCancel(): Promise<void> {
		this._canceled = true;
		if (this.node) {
			this.node.refresh();
		}
	}
}

export class AddControllerDialog {

	private dialog: azdata.window.Dialog;
	private uiModelBuilder: azdata.ModelBuilder;

	private urlInputBox: azdata.InputBoxComponent;
	private authDropdown: azdata.DropDownComponent;
	private usernameInputBox: azdata.InputBoxComponent;
	private passwordInputBox: azdata.InputBoxComponent;
	private rememberPwCheckBox: azdata.CheckBoxComponent;

	constructor(private model: AddControllerDialogModel) {
	}

	public showDialog(): void {
		this.createDialog();
		azdata.window.openDialog(this.dialog);
	}

	private createDialog(): void {
		this.dialog = azdata.window.createModelViewDialog(localize('textAddNewController', 'Add New Controller'));
		this.dialog.registerContent(async view => {
			this.uiModelBuilder = view.modelBuilder;

			this.urlInputBox = this.uiModelBuilder.inputBox()
				.withProperties<azdata.InputBoxProperties>({
					placeHolder: localize('textUrlLower', 'url'),
					value: this.model.prefilledUrl
				}).component();
			this.authDropdown = this.uiModelBuilder.dropDown().withProperties({
				values: this.model.authCategories,
				value: this.model.prefilledAuth,
				editable: false,
			}).component();
			this.authDropdown.onValueChanged(e => this.onAuthChanged());
			this.usernameInputBox = this.uiModelBuilder.inputBox()
				.withProperties<azdata.InputBoxProperties>({
					placeHolder: localize('textUsernameLower', 'username'),
					value: this.model.prefilledUsername
				}).component();
			this.passwordInputBox = this.uiModelBuilder.inputBox()
				.withProperties<azdata.InputBoxProperties>({
					placeHolder: localize('textPasswordLower', 'password'),
					inputType: 'password',
					value: this.model.prefilledPassword
				})
				.component();
			this.rememberPwCheckBox = this.uiModelBuilder.checkBox()
				.withProperties<azdata.CheckBoxProperties>({
					label: localize('textRememberPassword', 'Remember Password'),
					checked: this.model.prefilledRememberPassword
				}).component();

			let formModel = this.uiModelBuilder.formContainer()
				.withFormItems([{
					components: [
						{
							component: this.urlInputBox,
							title: localize('textUrlCapital', 'URL'),
							required: true
						}, {
							component: this.authDropdown,
							title: localize('textAuthCapital', 'Authentication type'),
							required: true
						}, {
							component: this.usernameInputBox,
							title: localize('textUsernameCapital', 'Username'),
							required: false
						}, {
							component: this.passwordInputBox,
							title: localize('textPasswordCapital', 'Password'),
							required: false
						}, {
							component: this.rememberPwCheckBox,
							title: ''
						}
					],
					title: ''
				}]).withLayout({ width: '100%' }).component();

			await view.initializeModel(formModel);
		});

		this.dialog.registerCloseValidator(async () => await this.validate());
		this.dialog.cancelButton.onClick(async () => await this.cancel());
		this.dialog.okButton.label = localize('textAdd', 'Add');
		this.dialog.cancelButton.label = localize('textCancel', 'Cancel');
	}

	private get authValue(): AuthType {
		return (<azdata.CategoryValue>this.authDropdown.value).name as AuthType;
	}

	private onAuthChanged(): void {
		let isBasic = this.authValue === 'basic';
		this.usernameInputBox.enabled = isBasic;
		this.passwordInputBox.enabled = isBasic;
		this.rememberPwCheckBox.enabled = isBasic;
		if (!isBasic) {
			this.usernameInputBox.value = '';
			this.passwordInputBox.value = '';
		}
	}

	private async validate(): Promise<boolean> {
		let url = this.urlInputBox && this.urlInputBox.value;
		let auth = this.authValue;
		let username = this.usernameInputBox && this.usernameInputBox.value;
		let password = this.passwordInputBox && this.passwordInputBox.value;
		let rememberPassword = this.passwordInputBox && !!this.rememberPwCheckBox.checked;

		try {
			await this.model.onComplete(url, auth, username, password, rememberPassword);
			return true;
		} catch (error) {
			this.dialog.message = {
				text: (typeof error === 'string') ? error : error.message,
				level: azdata.window.MessageLevel.Error
			};
			if (this.model && this.model.onError) {
				await this.model.onError(error as ControllerError);
			}
			return false;
		}
	}

	private async cancel(): Promise<void> {
		if (this.model && this.model.onCancel) {
			await this.model.onCancel();
		}
	}
}
