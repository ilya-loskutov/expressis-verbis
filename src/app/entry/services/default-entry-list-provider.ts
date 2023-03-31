import { MangoQuerySelector, MangoQuerySortPart, RxDocument } from 'rxdb';

import { EntryListProvider, EntryQuery } from "./entry-list-provider";
import { EntryFactory } from './entry.factory';
import { EntryDescription } from "../models/entry";
import { Entry } from "src/app/shared/models/database/database.types";
import { EntryCollection } from "src/app/shared/models/database/database.types";

export class DefaultEntryListProvider implements EntryListProvider {
    constructor(
        entryCollectionPromise: Promise<EntryCollection>,
        entryFactory: EntryFactory,
        dictionaryId: string
    ) {
        this._entryCollectionPromise = entryCollectionPromise;
        this._entryFactory = entryFactory;
        this._dictionaryId = dictionaryId;
    }

    private readonly _entryCollectionPromise: Promise<EntryCollection>;

    private readonly _entryFactory: EntryFactory;

    private readonly _dictionaryId: string;

    async list(query: EntryQuery): Promise<EntryDescription[]> {
        const entryCollection = await this._entryCollectionPromise;
        const loadedEntryDocumentList: RxDocument<Entry>[] = await entryCollection.find({
            selector: this.getSelectorSpecification(query),
            sort: this.getSortSpecification(query),
            limit: this.getLimitSpecification(query)
        })
            .exec();
        if (this.isThereNeedToAddressRxDBBug(query)) {
            /*
            Note this approach may bring a different problem: in case of the entry whose lastUpdated value was provided with the query
            has been removed by the time of the current request, the subsequent entry will not appear in the list
            */
            loadedEntryDocumentList.shift();
        }
        if (query.direction === 'back') {
            loadedEntryDocumentList.reverse();
        }
        return loadedEntryDocumentList.map(this._entryFactory.mapEntryDocumentToEntryDescription);
    }

    private getSelectorSpecification(query: EntryQuery): MangoQuerySelector {
        const specification: MangoQuerySelector = {
            dictionaryId: this._dictionaryId
        }
        if (query.startingPoint) {
            specification['lastUpdated'] = {
                [this.getSelectorOperator(query)]: query.startingPoint.lastUpdatedValue,
            }
        }
        return specification;
    }

    private getSelectorOperator(query: EntryQuery): string {
        let operator: string = query.direction === 'forward' ? '$gt' : '$lt';
        if (query.startingPoint!.inclusive) {
            operator += 'e';
        }
        return operator;
    }

    private getSortSpecification(query: EntryQuery): MangoQuerySortPart[] {
        return [
            { dictionaryId: query.direction === 'forward' ? 'asc' : 'desc' },
            { lastUpdated: query.direction === 'forward' ? 'asc' : 'desc' }
        ];
    }

    private getLimitSpecification(query: EntryQuery): number {
        if (this.isThereNeedToAddressRxDBBug(query)) {
            return query.limit + 1;
        }
        return query.limit;
    }

    private isThereNeedToAddressRxDBBug(query: EntryQuery): boolean {
        /* 
        RxDB considers the $gt and $gte operators with regard to a UTC field indiscriminately, 
        as the latter one
        */
        return query.direction === 'forward' &&
            query.startingPoint !== undefined &&
            !query.startingPoint.inclusive;
    }

    async count(): Promise<number> {
        const entryCollection = await this._entryCollectionPromise;
        return await entryCollection.count({
            selector: {
                dictionaryId: this._dictionaryId
            },
        })
            .exec();
    }
}