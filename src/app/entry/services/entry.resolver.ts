import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ParamMap } from '@angular/router';

import {
  Observable,
  map,
  of,
  from,
  mergeMap,
} from 'rxjs';

import { Dictionary } from 'src/app/shared/models/database/database.types';
import { SelectedDictionaryProvider, SELECTED_DICTIONARY_PROVIDER } from 'src/app/dictionary/services/selected-dictionary-provider';
import { Entry } from '../models/entry';
import { EntryService } from './entry.service';
import { EntryFactory } from './entry.factory';

@Injectable({
  providedIn: 'root'
})
export class EntryResolver implements Resolve<Entry> {

  constructor(
    private entryService: EntryService,
    private entryFactory: EntryFactory,
    @Inject(SELECTED_DICTIONARY_PROVIDER) private selectedDictionaryProvider: SelectedDictionaryProvider
  ) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<Entry> {
    return this.selectedDictionaryProvider.selectedDictionary$
      .pipe(
        map((selectedDictionary: Dictionary) => {
          if (activatedRouteSnapshot.queryParamMap.get('id') === null) {
            return of(this.entryFactory.createEntry(selectedDictionary.id));
          }
          return from(
            this.entryService.getById(
              selectedDictionary.id, activatedRouteSnapshot.queryParamMap.get('id') as string
            ))
        }),
        mergeMap((entry$: Observable<Entry | null>) => entry$),
        map((entry: Entry | null) => {
          if (entry === null) {
            throw new Error('The entry with such an id does not exist');
          }
          return entry;
        })
      );
  }
}
