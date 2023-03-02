import { InjectionToken, inject } from "@angular/core";

import { Observable } from "rxjs";

import { Dictionary } from "../models/dictionary";
import { DictionaryService } from "./dictionary.service";

export interface SelectedDictionaryProvider {
    get selectedDictionary$(): Observable<Dictionary>;
}

export const SELECTED_DICTIONARY_PROVIDER = new InjectionToken<SelectedDictionaryProvider>('selected dictionary provider', {
    providedIn: 'root',
    factory: () => inject(DictionaryService)
});