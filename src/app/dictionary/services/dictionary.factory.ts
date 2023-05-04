import { Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { DictionaryDocument } from 'src/app/shared/models/database/database.types';
import { Dictionary, NullDictionary } from "../models/dictionary";

@Injectable({
    providedIn: 'root'
})
export class DictionaryFactory {
    createNewDictionary(name: string): Dictionary {
        return new Dictionary(/*uuidv4()*/ 'EnglishEnglishEnglishEnglishEnglishE', name);
    }

    createNullDictionary(): Dictionary {
        return new NullDictionary();
    }

    mapDictionaryDocumentToDictionary(dictionaryDocument: DictionaryDocument): Dictionary {
        return new Dictionary(dictionaryDocument.id, dictionaryDocument.name);
    }
}