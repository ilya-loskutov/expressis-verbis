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

  async insertDummy(): Promise<void> {
    const entryCollection = await this._entryCollectionPromise;
    await entryCollection.bulkInsert([
      {
        id: '012345678987654321012345678987654321',
        words: ['mind', 'mindful'],
        meanings: [
          {
            definition: 'the part of a person that makes it possible for him or her to think, feel emotions, and understand things',
            examples: []
          },
          {
            definition: 'a very intelligent person',
            examples: [
              'She was one of the most brilliant minds of the last century.'
            ]
          },
          {
            definition: 'to think repeatedly about an event that has happened',
            examples: [
              'She kept going over the accident again and again in her mind, wishing that she could somehow have prevented it.',
              'The events of last year are still fresh in people"s minds',
              'If you change your mind about coming tonight, just give me a call.',
              'Her words kept running through my mind.'
            ]
          },
          {
            definition: '(used in questions and negatives) to be annoyed or worried by something',
            examples: []
          }
        ],
        lastUpdated: '2021-09-05T12:10:36.976Z',
        dictionaryId: 'EnglishEnglishEnglishEnglishEnglishE'
      },
      {
        id: '002345678987654321012345678987654321',
        words: [...Array(15).keys()].map(e => e.toString()),
        meanings: [],
        lastUpdated: '2021-09-05T12:10:36.977Z',
        dictionaryId: 'EnglishEnglishEnglishEnglishEnglishE'
      },
      {
        id: '010345678987654321012345678987654321',
        words: ['concomitant'],
        meanings: [
          {
            'definition': 'something that happens with something else and is connected with it; happening and connected with another thing; accompanying especially in a subordinate or incidental way',
            'examples': []
          }
        ],
        lastUpdated: '2021-09-05T12:10:36.978Z',
        dictionaryId: 'EnglishEnglishEnglishEnglishEnglishE'
      },
      {
        id: '012045678987654321012345678987654321',
        words: ['send out'],
        meanings: [
          {
            'definition': 'to produce something in a way that causes it to spread out from a central point',
            'examples': [
              'The equipment sent out a regular high-pitched signal.',
              'The torch sends out a powerful beam of light.',
              'The bushes were sending out new shoots.',
              'The pilot sent out a distress signal.',
              'For what reason did the young city-state or states of southern Mesopotamia decide to send out people to distant places in order to settle there, bringing along their cultural baggage?'
            ]
          }
        ],
        lastUpdated: '2021-09-05T12:10:36.979Z',
        dictionaryId: 'EnglishEnglishEnglishEnglishEnglishE'
      }
    ]);
  }
}
