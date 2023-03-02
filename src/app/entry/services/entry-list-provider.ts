import { EntryDescription } from "../models/entry";

export interface EntryListProvider {

    list(query: EntryQuery): Promise<EntryDescription[]>
    count(): Promise<number>
}

export type EntryQuery = {

    limit: number;
    direction: 'forward' | 'back';
    startingPoint?: {
        lastUpdatedValue: string;
        inclusive: boolean;
    }
}