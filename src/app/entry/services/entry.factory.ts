import { Injectable } from "@angular/core";

import { v4 as uuidv4 } from 'uuid';

import { EntryDocument } from 'src/app/shared/models/database/database.types';
import { EntryDescription, LoadingEntry, Entry, Meaning } from "../models/entry";

@Injectable({
    providedIn: 'root'
})
export class EntryFactory {

    createEntry(dictionaryId: string): Entry {
        return new Entry(
            uuidv4(),
            [],
            this.getCurrentDateAsISOString(),
            [],
            dictionaryId
        );
    }

    private getCurrentDateAsISOString(): string {
        const currentDate = new Date(Date.now());
        return currentDate.toISOString();
    }

    mapEntryDocumentToEntryDescription(entryDocument: EntryDocument): EntryDescription {
        return new EntryDescription(
            entryDocument.id,
            entryDocument.words,
            entryDocument.lastUpdated
        );
    }

    mapEntryDocumentToEntry(entryDocument: EntryDocument): Entry {
        return new Entry(
            entryDocument.id,
            [...entryDocument.words], //RxDB makes an array's properties read-olny for some reason
            entryDocument.lastUpdated,
            [...entryDocument.meanings],
            entryDocument.dictionaryId
        );
    }

    createLoadingEntry(): EntryDescription {
        return new LoadingEntry();
    }

    createMeaning(): Meaning {
        return new Meaning('', []);
    }
}