import { Injectable } from '@angular/core';

import { Database, EntryCollection, EntryDocument } from 'src/app/shared/models/database/database.types';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { EntryPageList } from '../models/entry-page-list';
import { EntryFactory } from './entry.factory';
import { EntryListProvider } from './entry-list-provider';
import { DefaultEntryListProvider } from './default-entry-list-provider';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(databaseService: DatabaseService, entryFactory: EntryFactory) {
    this._entryCollectionPromise = databaseService.database
      .then((database: Database) => database.entry);
    this._entryFactory = entryFactory;
  }

  private readonly _entryCollectionPromise: Promise<EntryCollection>;

  private readonly _entryFactory: EntryFactory;

  getEntryPageList(dictionaryId: string, pageSize: number): EntryPageList {
    const entryListProvider: EntryListProvider = new DefaultEntryListProvider(
      this._entryCollectionPromise,
      this._entryFactory,
      dictionaryId
    );
    return new EntryPageList(pageSize, entryListProvider, this._entryFactory);
  }

  async getById(dictionaryId: string, entryId: string): Promise<Entry | null> {
    const entryCollection = await this._entryCollectionPromise;
    const entryDocument: EntryDocument | null = await entryCollection.findOne({
      selector: {
        dictionaryId: dictionaryId,
        id: entryId,
      }
    })
      .exec();
    return entryDocument === null ?
      null :
      this._entryFactory.mapEntryDocumentToEntry(entryDocument);
  }

  async addOrUpdate(entry: Entry): Promise<void> {
    const entryCollection = await this._entryCollectionPromise;
    entry.lastUpdated = this.getCurrentDateAsISOString();
    await entryCollection.upsert(entry);
  }

  private getCurrentDateAsISOString(): string {
    const currentDate = new Date(Date.now());
    return currentDate.toISOString();
  }

  async delete(id: string): Promise<void> {
    const entryCollection = await this._entryCollectionPromise;
    const query = entryCollection.find({
      selector: {
        id: {
          $eq: id
        }
      }
    });
    await query.remove();
  }
}
