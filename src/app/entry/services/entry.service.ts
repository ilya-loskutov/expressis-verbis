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
  /*
    async insertDummy(): Promise<void> {
      const entryCollection = await this._entryCollectionPromise;
      await entryCollection.bulkInsert([
        {
          id: '0',
          words: ['0'],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T12:10:36.976Z',
          dictionaryId: 'French'
        },
        {
          id: '1',
          words: ['1', 'to allow', 'allowable'],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T12:10:36.976Z',
          dictionaryId: 'English'
        },
        {
          id: '2',
          words: ['2', 'patient', 'patiently', 'patience'],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T12:10:36.977Z',
          dictionaryId: 'English'
        },
        {
          id: '3',
          words: ['3', 'sluggish'],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T12:10:37.977Z',
          dictionaryId: 'English'
        },
        {
          id: '4',
          words: ['4', 'continuous', 'continuously', 'continuity', 'continuation'],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T12:11:37.977Z',
          dictionaryId: 'English'
        },
        {
          id: '5',
          words: [
            '5',
            'durable',
            'durability',
            'longevity',
            'persecution',
            'a',
            'Hello-My-Freiends-YouHaveGoneOutOfAllBoundaries'
          ],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-05T13:11:37.977Z',
          dictionaryId: 'English'
        },
        {
          id: '6',
          words: [
            '6',
            'ornate'
          ],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-09-06T13:11:37.977Z',
          dictionaryId: 'English'
        },
        {
          id: '7',
          words: [
            '7',
            'consequent',
            'consequential',
            'consequence'
          ],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2021-10-06T13:11:37.977Z',
          dictionaryId: 'English'
        },
        {
          id: '8',
          words: [
            '8',
          ],
          meanings: [{ definition: 'foo', samples: ['foo'] }],
          lastUpdated: '2022-10-06T13:11:37.977Z',
          dictionaryId: 'English'
        },
      ]);
    }
    */
}
