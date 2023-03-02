import {
    RxDocument,
    RxCollection,
    RxDatabase
} from 'rxdb';

export type Meaning = {
    definition: string;
    examples: string[];
}

export type Entry = {
    id: string;
    words: string[];
    meanings: Meaning[];
    lastUpdated: string;
    dictionaryId: string;
}

export type Dictionary = {
    id: string,
    name: string;
}

export type EntryDocument = RxDocument<Entry>;
export type EntryCollection = RxCollection<Entry>;

export type DictionaryDocument = RxDocument<Dictionary>;
export type DictionaryCollection = RxCollection<Dictionary>;

export type DatabaseCollections = {
    dictionary: DictionaryCollection,
    entry: EntryCollection
}

export type Database = RxDatabase<DatabaseCollections>;