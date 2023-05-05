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
        this.throwIfSuchQueryIsNotImplemented(query);
        const entryCollection = await this._entryCollectionPromise;
        const loadedEntryDocumentList: RxDocument<Entry>[] = await entryCollection.find({
            selector: this.getSelectorSpecification(query),
            sort: this.getSortSpecification(query),
            limit: this.getLimitSpecification(query)
        })
            .exec();
        if (this.isThereNeedToAddressRxDBBug(query)) {
            this.purgeEntryDocumentListOfUnneededOnesOnRxDBBug(loadedEntryDocumentList, query);
        }
        return loadedEntryDocumentList.map(this._entryFactory.mapEntryDocumentToEntryDescription);
    }

    private throwIfSuchQueryIsNotImplemented(query: EntryQuery): void {
        /*
        Such queries call for some extra code, so we'd rather leave them out until we actually need to support them
        */
        if (query.direction === 'back' && !query.startingPoint) {
            throw new Error('Queries with the back direction and without a starting point are not implemented');
        }
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
        let operator: string = query.direction === 'forward' ? '$lt' : '$gt';
        if (query.startingPoint!.inclusive) {
            operator += 'e';
        }
        return operator;
    }

    private getSortSpecification(query: EntryQuery): MangoQuerySortPart[] {
        return [
            { dictionaryId: 'desc' },
            { lastUpdated: 'desc' }
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
        return query.direction === 'back' &&
            query.startingPoint !== undefined &&
            !query.startingPoint.inclusive;
    }

    private purgeEntryDocumentListOfUnneededOnesOnRxDBBug(loadedEntryDocumentList: RxDocument<Entry>[], query: EntryQuery): void {
        if (loadedEntryDocumentList[loadedEntryDocumentList.length - 1]?.lastUpdated === query.startingPoint!.lastUpdatedValue) {
            loadedEntryDocumentList.splice(loadedEntryDocumentList.length - 1, 1);
        }
        else if (loadedEntryDocumentList.length > query.limit) {
            loadedEntryDocumentList.splice(0, 1);
        }
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