import { Injectable } from '@angular/core';

import { assert } from 'src/app/shared/utils/assert/assert';

import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { AppPrerequisitesCheckingError, IndexedDBUnavailableError, DatabaseCannotBeGottenError } from '../models/app-prerequisites-checking/app-prerequisites-checking-error';

@Injectable({
    providedIn: 'root'
})
export class AppPrerequisitesChecker {

    constructor(private databaseService: DatabaseService) { }

    async run(): Promise<void> {
        assert(this._isCheckingFulfilled === false,
            'App prerequisites checking got run more than once');

        try {
            this.checkThatIndexedDBIsAvailable();
            await this.checkThatDatabaseCanBeGotten();
        }
        finally {
            this._isCheckingFulfilled = true;
        }
    }

    private _isCheckingFulfilled: boolean = false;

    private checkThatIndexedDBIsAvailable(): void {
        if (!window.indexedDB) {
            throw new IndexedDBUnavailableError();
        }
    }

    private async checkThatDatabaseCanBeGotten(): Promise<void> {
        try {
            await this.databaseService.database;
        }
        catch (error) {
            console.error(error);
            throw new DatabaseCannotBeGottenError();
        }
    }

    get isCheckingFulfilled(): boolean {
        return this._isCheckingFulfilled;
    }
}