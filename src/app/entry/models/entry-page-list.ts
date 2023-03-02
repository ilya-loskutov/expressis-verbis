import { Observable, BehaviorSubject, } from "rxjs";

import { EntryListProvider } from "../services/entry-list-provider";
import { EntryFactory } from "../services/entry.factory";
import { EntryPage } from "./entry-page";
import { EntryDescription } from "./entry";
import { assert } from "src/app/shared/utils/assert/assert";

export class EntryPageList {

    constructor(pageSize: number, entryListProvider: EntryListProvider, entryFactory: EntryFactory) {
        if (pageSize < 1) {
            throw new Error(`pageSize cannot be less than 1. The received value was ${pageSize}`);
        }
        this.pageSize = pageSize;
        this._entryListProvider = entryListProvider;
        this._entryFactory = entryFactory;
    }

    readonly pageSize: number;

    private readonly _entryListProvider: EntryListProvider;

    private readonly _entryFactory;

    private readonly _$: BehaviorSubject<EntryPage> =
        new BehaviorSubject<EntryPage>(this.createEmptyPage());
    get $(): Observable<EntryPage> {
        return this._$;
    }

    private createEmptyPage(): EntryPage {
        return new EntryPage([], false, false);
    }

    private _pageBeingLoaded: EntryPage | null = null;

    async moveToPreviousPage(): Promise<void> {
        if (this.isCurrentPageEmpty) {
            return this.moveToNextPage();
        }
        this.throwIfPageCannotBeLoaded();
        this._pageBeingLoaded = this.createEmptyPage();
        this.emitLoadingPage();
        await this.loadPreviousPage();
        if (this.isThereNeedToLoadOffEntriesForPreviousPage()) {
            await this.loadOffEntriesForPreviousPage();
        }
        this.recordPageBeingLoadingData();
        this.emitPageBeingLoading();
        this._pageBeingLoaded = null;
    }

    private get isCurrentPageEmpty(): boolean {
        return this._backBorderLastUpdatedValue === null &&
            this._frontBorderLastUpdatedValue === null;
    }

    private _backBorderLastUpdatedValue: string | null = null;
    private _frontBorderLastUpdatedValue: string | null = null;

    private throwIfPageCannotBeLoaded(): void {
        if (this.isLoading) {
            throw new Error('A page is currently being loaded');
        }
    }

    private get isLoading(): boolean {
        return this._pageBeingLoaded !== null;
    }

    private emitLoadingPage(): void {
        const loadingPage = new EntryPage(
            Array<EntryDescription>(this.pageSize).fill(this._entryFactory.createLoadingEntry()),
            false,
            false
        );
        this._$.next(loadingPage);
    }

    private async loadPreviousPage(): Promise<void> {
        assert(this.isLoading, 'No page is being loaded');
        assert(!this.isCurrentPageEmpty, 'The current page is empty');

        const loadedList: EntryDescription[] = await this._entryListProvider.list({
            direction: 'back',
            limit: this.pageSize + 1,
            startingPoint: {
                lastUpdatedValue: this._backBorderLastUpdatedValue as string,
                inclusive: false
            }
        });
        const pageBeingLoaded = this._pageBeingLoaded as EntryPage;
        pageBeingLoaded.entries = loadedList;
        if (pageBeingLoaded.entries.length > this.pageSize) {
            pageBeingLoaded.entries.shift();
            pageBeingLoaded.hasPreviousPage = true;
        }
        if (!this.isThereNeedToLoadOffEntriesForPreviousPage()) {
            pageBeingLoaded.hasNextPage = true;
        }
    }

    private isThereNeedToLoadOffEntriesForPreviousPage(): boolean {
        return this._pageBeingLoaded!.entries.length < this.pageSize;
    }

    private async loadOffEntriesForPreviousPage(): Promise<void> {
        assert(this.isLoading, 'No page is being loaded');
        assert(this.isThereNeedToLoadOffEntriesForPreviousPage(), 'There is no need to load off entries');

        const pageBeingLoaded = this._pageBeingLoaded as EntryPage;
        const loadedList: EntryDescription[] = await this._entryListProvider.list({
            direction: 'forward',
            limit: this.pageSize - pageBeingLoaded.entries.length + 1,
            startingPoint: {
                lastUpdatedValue: this._backBorderLastUpdatedValue as string,
                inclusive: true
            }
        });
        pageBeingLoaded.entries = pageBeingLoaded.entries.concat(loadedList);
        if (pageBeingLoaded.entries.length > this.pageSize) {
            pageBeingLoaded.entries.pop();
            pageBeingLoaded.hasNextPage = true;
        }
    }

    private recordPageBeingLoadingData(): void {
        assert(this.isLoading, 'No page is being loaded');

        const entries: EntryDescription[] = this._pageBeingLoaded!.entries;
        this._backBorderLastUpdatedValue = entries[0]?.lastUpdated ?? null;
        this._frontBorderLastUpdatedValue = entries[entries.length - 1]?.lastUpdated ?? null;
    }

    private emitPageBeingLoading(): void {
        assert(this.isLoading, 'No page is being loaded');

        this._$.next(this._pageBeingLoaded as EntryPage);
    }

    async moveToNextPage(): Promise<void> {
        this.throwIfPageCannotBeLoaded();
        this._pageBeingLoaded = this.createEmptyPage();
        this.emitLoadingPage();
        await this.loadNextPage();
        if (this.isThereNeedToLoadLastPageAfterLoadingNextPage()) {
            await this.loadLastPage();
        }
        this.recordPageBeingLoadingData();
        this.emitPageBeingLoading();
        this._pageBeingLoaded = null;
    }

    private async loadNextPage(): Promise<void> {
        assert(this.isLoading, 'No page is being loaded');

        const loadedList: EntryDescription[] = await this._entryListProvider.list({
            direction: 'forward',
            limit: this.pageSize + 1,
            startingPoint: this.isCurrentPageEmpty ?
                undefined :
                {
                    lastUpdatedValue: this._frontBorderLastUpdatedValue as string,
                    inclusive: false
                }
        });
        const pageBeingLoaded = this._pageBeingLoaded as EntryPage;
        pageBeingLoaded.entries = loadedList;
        if (!this.isThereNeedToLoadLastPageAfterLoadingNextPage() && !this.isCurrentPageEmpty) {
            pageBeingLoaded.hasPreviousPage = true;
        }
        if (pageBeingLoaded.entries.length > this.pageSize) {
            pageBeingLoaded.entries.pop();
            pageBeingLoaded.hasNextPage = true;
        }
    }

    private isThereNeedToLoadLastPageAfterLoadingNextPage(): boolean {
        return !this.isCurrentPageEmpty &&
            this._pageBeingLoaded!.entries.length === 0;
    }

    private async loadLastPage(): Promise<void> {
        assert(this.isLoading, 'No page is being loaded');
        assert(this.isThereNeedToLoadLastPageAfterLoadingNextPage, 'There is no need to load the last page');

        const totalEntriesNumber = await this._entryListProvider.count();
        if (totalEntriesNumber === 0) {
            return;
        }
        const requiredEntriesNumber = totalEntriesNumber % this.pageSize ?
            totalEntriesNumber % this.pageSize :
            this.pageSize;
        const loadedList: EntryDescription[] = await this._entryListProvider.list({
            direction: 'back',
            limit: requiredEntriesNumber + 1
        });
        const pageBeingLoaded = this._pageBeingLoaded as EntryPage;
        pageBeingLoaded.entries = loadedList;
        if (pageBeingLoaded.entries.length > requiredEntriesNumber) {
            pageBeingLoaded.entries.shift();
            pageBeingLoaded.hasPreviousPage = true;
        }
    }
}