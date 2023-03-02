import { isDevMode, Injectable } from '@angular/core';

import { createRxDatabase, addRxPlugin, removeRxDatabase } from 'rxdb';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { Database, DatabaseCollections } from '../../models/database/database.types';
import { dictionarySchema, entrySchema, databaseName } from '../../config/database/database.schema';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor() {
        this._databaseCreationPromise = this.createDatabase();
    }

    private _databaseCreationPromise: Promise<Database>;

    private async createDatabase(): Promise<Database> {
        addPouchPlugin(PouchdbAdapterIdb);
        if (isDevMode()) {
            await removeRxDatabase(databaseName, this.getDatabaseStorage());
        }
        await this.addDatabasePlugins();
        const database = await this.createDatabaseInstance();
        await this.addCollectionsToDatabase(database);
        return database;
    }

    private async addDatabasePlugins(): Promise<void> {
        addRxPlugin(RxDBReplicationCouchDBPlugin);
        addPouchPlugin(PouchdbAdapterIdb);
        addRxPlugin(RxDBLeaderElectionPlugin);
        if (isDevMode()) {
            await import('rxdb/plugins/dev-mode').then(
                module => addRxPlugin(module.RxDBDevModePlugin)
            );
        }
    }

    private getDatabaseStorage() {
        return isDevMode() ? wrappedValidateAjvStorage({
            storage: getRxStoragePouch('idb')
        }) :
            getRxStoragePouch('idb');
    }

    private async createDatabaseInstance(): Promise<Database> {
        return await createRxDatabase<DatabaseCollections>({
            name: databaseName,
            storage: this.getDatabaseStorage(),
        });
    }

    private async addCollectionsToDatabase(database: Database): Promise<void> {
        await database.addCollections({
            dictionary: {
                schema: dictionarySchema,
            },
            entry: {
                schema: entrySchema,
            }
        });
    }

    get database(): Promise<Database> {
        return this._databaseCreationPromise;
    }
}