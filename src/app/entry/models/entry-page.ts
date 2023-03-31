import { EntryDescription } from "./entry";

export class EntryPage {
    constructor(
        public entries: EntryDescription[],
        public hasPreviousPage: boolean,
        public hasNextPage: boolean
    ) { }
}