import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';

import { Observable, map } from 'rxjs';

import { Dictionary } from 'src/app/dictionary/models/dictionary';
import { DictionaryService } from 'src/app/dictionary/services/dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedDictionaryGuard implements CanActivate {
  constructor(
    private dictionaryService: DictionaryService,
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.dictionaryService.selectedDictionary$.pipe(
      map((selectedDictionary: Dictionary) => !selectedDictionary.isNullDictionary),
    );
  }
}
