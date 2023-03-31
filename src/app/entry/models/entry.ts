export class EntryDescription {
    constructor(
        public readonly id: string,
        public words: string[],
        public lastUpdated: string,
    ) { }
}

export class LoadingEntry extends EntryDescription {
    constructor() {
        super('dummyId', [], 'dummyLastUpdated')
    }
}

export class Meaning {
    constructor(
        public definition: string,
        public examples: string[]
    ) { }
}

export class Entry extends EntryDescription {
    constructor(
        id: string,
        words: string[],
        lastUpdated: string,
        public meanings: Meaning[],
        public readonly dictionaryId: string
    ) {
        super(id, words, lastUpdated);
    }
}