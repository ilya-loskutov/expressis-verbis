import { Injectable } from '@angular/core';

import {
  Observable,
  from,
  map,
  mergeMap,
  combineLatest,
  BehaviorSubject,
} from 'rxjs';

import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { Database, DictionaryCollection, DictionaryDocument } from 'src/app/shared/models/database/database.types';
import { Dictionary } from '../models/dictionary';
import { DictionaryFactory } from './dictionary.factory';
import { SelectedDictionaryProvider } from './selected-dictionary-provider';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService implements SelectedDictionaryProvider {
  constructor(
    databaseService: DatabaseService,
    dictionaryFactory: DictionaryFactory
  ) {
    this._dictionaryCollectionPromise = databaseService.database
      .then((database: Database) => database.dictionary);
    this._dictionaryFactory = dictionaryFactory;
    this.initializeObservables();
  }

  private readonly _dictionaryCollectionPromise: Promise<DictionaryCollection>;

  private readonly _dictionaryFactory: DictionaryFactory;

  private initializeObservables(): void {
    this.initializeAvailableDictionaries();
    this.initializeSelectedDictionary();
  }

  private initializeAvailableDictionaries(): void {
    this._availableDictionaries$ = from(this._dictionaryCollectionPromise)
      .pipe(
        map((dictionaryCollection: DictionaryCollection) => dictionaryCollection
          .find({
            selector: {},
            sort: [{ name: 'asc' }]
          })
          .$
        ),
        mergeMap((queryResult$: Observable<DictionaryDocument[]>) => queryResult$),
        map((dictionaryDocuments: DictionaryDocument[]) =>
          dictionaryDocuments.map(this._dictionaryFactory.mapDictionaryDocumentToDictionary)
        )
      );
  }

  private _availableDictionaries$!: Observable<Dictionary[]>;

  get availableDictionaries$(): Observable<Dictionary[]> {
    return this._availableDictionaries$;
  }

  private initializeSelectedDictionary(): void {
    this._underlyingSelectedDictionary$ = new BehaviorSubject(this._dictionaryFactory.createNullDictionary());
    this._selectedDictionary$ = combineLatest([this._underlyingSelectedDictionary$, this.availableDictionaries$])
      .pipe(
        map(([selectedDictionary, availableDictionaries]:
          [Dictionary, Dictionary[]]) => {
          if (this.isThisSelectedDictionaryAvailable(selectedDictionary, availableDictionaries)) {
            return selectedDictionary;
          }
          return this._dictionaryFactory.createNullDictionary();
        }),
      );
  }

  private _selectedDictionary$!: Observable<Dictionary>;

  private _underlyingSelectedDictionary$!: BehaviorSubject<Dictionary>;

  private isThisSelectedDictionaryAvailable(selectedDictionary: Dictionary, availableDictionaries: Dictionary[]):
    boolean {
    return !!availableDictionaries.find(dictionary => dictionary.equals(selectedDictionary));
  }

  get selectedDictionary$(): Observable<Dictionary> {
    return this._selectedDictionary$;
  }

  set selectedDictionary(dictionary: Dictionary) {
    this._underlyingSelectedDictionary$.next(dictionary);
  }

  async createDictionary(name: string): Promise<void> {
    const dictionaryCollection = await this._dictionaryCollectionPromise;
    const newDictionary: Dictionary = this._dictionaryFactory.createNewDictionary(name);
    await dictionaryCollection.insert(newDictionary);
  }
}