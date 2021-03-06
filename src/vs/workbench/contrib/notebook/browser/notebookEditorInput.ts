/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorInput, IEditorInput, GroupIdentifier, ISaveOptions, IMoveResult, IRevertOptions } from 'vs/workbench/common/editor';
import { INotebookService } from 'vs/workbench/contrib/notebook/common/notebookService';
import { URI } from 'vs/base/common/uri';
import { isEqual, basename } from 'vs/base/common/resources';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IFilesConfigurationService, AutoSaveMode } from 'vs/workbench/services/filesConfiguration/common/filesConfigurationService';
import { NotebookEditorModel } from 'vs/workbench/contrib/notebook/common/notebookEditorModel';
import { IFileDialogService } from 'vs/platform/dialogs/common/dialogs';

let NOTEBOOK_EDITOR_INPUT_HANDLE = 0;
export class NotebookEditorInput extends EditorInput {
	static create(instantiationService: IInstantiationService, resource: URI, name: string, viewType: string | undefined) {
		return instantiationService.createInstance(NotebookEditorInput, resource, name, viewType);
	}

	static readonly ID: string = 'workbench.input.notebook';
	private textModel: NotebookEditorModel | null = null;

	private _group: GroupIdentifier | undefined;

	public get group(): GroupIdentifier | undefined {
		return this._group;
	}

	public updateGroup(group: GroupIdentifier): void {
		this._group = group;
	}

	readonly id: number = NOTEBOOK_EDITOR_INPUT_HANDLE++;
	constructor(
		public resource: URI,
		public name: string,
		public readonly viewType: string | undefined,
		@INotebookService private readonly notebookService: INotebookService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		// @IEditorService private readonly editorService: IEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
	}

	getTypeId(): string {
		return NotebookEditorInput.ID;
	}

	getName(): string {
		return this.name;
	}

	isDirty() {
		return this.textModel?.isDirty() || false;
	}

	isReadonly() {
		return false;
	}

	public isSaving(): boolean {
		if (this.isUntitled()) {
			return false; // untitled is never saving automatically
		}

		if (!this.isDirty()) {
			return false; // the editor needs to be dirty for being saved
		}

		if (this.filesConfigurationService.getAutoSaveMode() === AutoSaveMode.AFTER_SHORT_DELAY) {
			return true; // a short auto save is configured, treat this as being saved
		}

		return false;
	}

	async save(group: GroupIdentifier, options?: ISaveOptions): Promise<IEditorInput | undefined> {
		if (this.textModel) {
			await this.textModel.save();
			return this;
		}

		return undefined;
	}

	async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<IEditorInput | undefined> {
		if (!this.textModel) {
			return undefined;
		}

		const dialogPath = this.textModel.resource;
		const target = await this.fileDialogService.pickFileToSave(dialogPath, options?.availableFileSystems);
		if (!target) {
			return undefined; // save cancelled
		}

		if (!await this.textModel.saveAs(target)) {
			return undefined;
		}

		return this._move(group, target)?.editor;
	}

	// called when users rename a notebook document
	move(group: GroupIdentifier, target: URI): IMoveResult | undefined {
		if (this.textModel) {
			const contributedNotebookProviders = this.notebookService.getContributedNotebookProviders(target);

			if (contributedNotebookProviders.find(provider => provider.id === this.textModel!.viewType)) {
				return this._move(group, target);
			}
		}
		return undefined;
	}

	_move(group: GroupIdentifier, newResource: URI): { editor: IEditorInput } | undefined {
		const editorInput = NotebookEditorInput.create(this.instantiationService, newResource, basename(newResource), this.viewType);
		return { editor: editorInput };
	}

	async revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		if (this.textModel) {
			await this.textModel.revert(options);
		}

		return;
	}

	async resolve(editorId?: string): Promise<NotebookEditorModel> {
		if (!await this.notebookService.canResolve(this.viewType!)) {
			throw new Error(`Cannot open notebook of type '${this.viewType}'`);
		}

		this.textModel = await this.notebookService.modelManager.resolve(this.resource, this.viewType!, editorId);

		this._register(this.textModel.onDidChangeDirty(() => {
			this._onDidChangeDirty.fire();
		}));

		if (this.textModel.isDirty()) {
			this._onDidChangeDirty.fire();
		}

		return this.textModel;
	}

	matches(otherInput: unknown): boolean {
		if (this === otherInput) {
			return true;
		}
		if (otherInput instanceof NotebookEditorInput) {
			return this.viewType === otherInput.viewType
				&& isEqual(this.resource, otherInput.resource);
		}
		return false;
	}

	clearTextModel() {
		if (this.textModel) {
			this.notebookService.destoryNotebookDocument(this.textModel!.notebook.viewType, this.textModel!.notebook);
			this.textModel.dispose();
		}
	}

	dispose() {
		super.dispose();
	}
}
