/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from 'vs/base/common/actions';
import { IOpenerService } from 'vs/platform/opener/common/opener';
//tslint:disable-next-line:layering
import { IElectronService } from 'vs/platform/electron/node/electron';
import { URI } from 'vs/base/common/uri';

export class ShowFileInFolderAction extends Action {

	constructor(private path: string, label: string, @IElectronService private electronService: IElectronService) {
		super('showItemInFolder.action.id', label);
	}

	run(): Promise<void> {
		return this.electronService.showItemInFolder(this.path);
	}
}

export class OpenFileInFolderAction extends Action {

	constructor(private path: string, label: string, @IOpenerService private openerService: IOpenerService) {
		super('showItemInFolder.action.id', label);
	}

	run() {
		return this.openerService.open(URI.file(this.path));
	}
}
