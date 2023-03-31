import { TestScheduler } from "rxjs/testing";
import { skip, first } from "rxjs";

import { EntryListProvider, EntryQuery } from "../services/entry-list-provider";
import { EntryFactory } from "../services/entry.factory";
import { EntryDescription, LoadingEntry } from "./entry";
import { EntryPage } from "./entry-page";

import { EntryPageList } from "./entry-page-list";

describe('EntryPageList', () => {
    let pageSize: number;
    let entryList: EntryDescription[];
    let loadingEntry: LoadingEntry;
    let entryFactory: EntryFactory;
    let entryListProvider: EntryListProvider;

    beforeEach(() => {
        loadingEntry = {} as any;
        entryFactory = {
            createLoadingEntry() {
                return loadingEntry;
            }
        } as any;
        entryListProvider = {
            list(query: EntryQuery) {
                const list = (() => {
                    if (query.direction === 'forward') {
                        const startIndex = query.startingPoint === undefined ?
                            0 :
                            query.startingPoint!.inclusive ?
                                entryList.findIndex(e => e.lastUpdated >= query.startingPoint!.lastUpdatedValue) :
                                entryList.findIndex(e => e.lastUpdated > query.startingPoint!.lastUpdatedValue);
                        if (startIndex === -1) {
                            return [];
                        }
                        const limitIndex = startIndex + query.limit;
                        return entryList.slice(startIndex, limitIndex);
                    }
                    let limitIndex = query.startingPoint === undefined ?
                        entryList.length :
                        query.startingPoint!.inclusive ?
                            entryList.findLastIndex(e => e.lastUpdated <= query.startingPoint!.lastUpdatedValue) + 1 :
                            entryList.findLastIndex(e => e.lastUpdated < query.startingPoint!.lastUpdatedValue) + 1;
                    if (limitIndex === 0) {
                        return [];
                    }
                    const startIndex = limitIndex - query.limit < 0 ?
                        0 :
                        limitIndex - query.limit;
                    return entryList.slice(startIndex, limitIndex);
                })();
                return Promise.resolve(list);
            },
            count() {
                return Promise.resolve(entryList.length);
            }
        };
    });

    const scheduler: TestScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    function createEntryList(length: number, startLastUpdatedValue: number = 0): any[] {
        let lastUpdatedValue = startLastUpdatedValue;
        let list = [];
        for (let i = 0; i < length; i++) {
            list[i] = { lastUpdated: lastUpdatedValue++ };
        }
        return list;
    }

    describe('constructor', () => {
        beforeEach(() => {
            pageSize = 1;
        });

        describe('when pageSize argument value is less than 1', () => {
            it('should throw', () => {
                const pageSize = 0;

                expect(() => { new EntryPageList(pageSize, entryListProvider, entryFactory); })
                    .toThrow();
            });
        });

        it('should set pageSize property value to the received argument value', () => {
            const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

            expect(entryPageList.pageSize).toBe(pageSize);
        });
    });

    describe('when the moving methods have not been called yet', () => {
        beforeEach(() => {
            pageSize = 1;
        });

        describe('$', () => {
            it('should emit an empty page with both hasPreviousPage and hasNextPage set to false', () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        [],
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });
    });

    describe('when the moving methods get called for the first time', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = [];
        });

        describe('moveToNextPage', () => {
            it('should cause emitting a loading page synchronously', () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });

        describe('moveToPreviousPage', () => {
            it('should cause emitting a loading page synchronously', () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });
    });

    describe('when the moving methods get called after previous calls caused emitting an empty page', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = [];
        });

        describe('moveToNextPage', () => {
            it('should cause emitting a loading page synchronously', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();
                entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when the previous call is not completed yet', () => {
                it('should throw', async () => {
                    const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);
                    let thirdCallPromise: Promise<void>;

                    entryPageList.$
                        .pipe(
                            skip(3),
                            first()
                        )
                        .subscribe(() => {
                            thirdCallPromise = entryPageList.moveToNextPage();
                        })
                    await entryPageList.moveToNextPage();
                    entryPageList.moveToNextPage();

                    await expectAsync(thirdCallPromise!).toBeRejected();
                });
            });
        });

        describe('moveToPreviousPage', () => {
            it('should cause emitting a loading page synchronously', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();
                entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when the previous call is not completed yet', () => {
                it('should throw', async () => {
                    const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);
                    let thirdCallPromise: Promise<void>;

                    entryPageList.$
                        .pipe(
                            skip(3),
                            first()
                        )
                        .subscribe(() => {
                            thirdCallPromise = entryPageList.moveToPreviousPage();
                        })
                    await entryPageList.moveToPreviousPage();
                    entryPageList.moveToPreviousPage();

                    await expectAsync(thirdCallPromise!).toBeRejected();
                });
            });
        });
    });

    describe('when the moving methods get called after previous calls caused emitting a non-empty page', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = createEntryList(pageSize);
        });

        describe('moveToNextPage', () => {
            it('should cause emitting a loading page synchronously', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();
                entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when the previous call is not completed yet', () => {
                it('should throw', async () => {
                    const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);
                    let thirdCallPromise: Promise<void>;

                    entryPageList.$
                        .pipe(
                            skip(3),
                            first()
                        )
                        .subscribe(() => {
                            thirdCallPromise = entryPageList.moveToNextPage();
                        })
                    await entryPageList.moveToNextPage();
                    entryPageList.moveToNextPage();

                    await expectAsync(thirdCallPromise!).toBeRejected();
                });
            });
        });

        describe('moveToPreviousPage', () => {
            it('should cause emitting a loading page synchronously', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        Array(pageSize).fill(loadingEntry),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();
                entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when the previous call is not completed yet', () => {
                it('should throw', async () => {
                    const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);
                    let thirdCallPromise: Promise<void>;

                    entryPageList.$
                        .pipe(
                            skip(3),
                            first()
                        )
                        .subscribe(() => {
                            thirdCallPromise = entryPageList.moveToPreviousPage();
                        })
                    await entryPageList.moveToPreviousPage();
                    entryPageList.moveToPreviousPage();

                    await expectAsync(thirdCallPromise!).toBeRejected();
                });
            });
        });
    });

    describe('when entryListProvider provides no entry at first', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = [];
        });

        describe('moveToNextPage gets called', () => {
            it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        [],
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when EntryListProvider provides the same number of entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augmented number of entries equal to pageSize by the moment of the last call', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to that EntryListProvider currently provides, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });
        });

        describe('moveToPreviousPage gets called', () => {
            it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        [],
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when EntryListProvider provides the same number of entries by the moment of the last call', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToPreviousPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToPreviousPage();
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augmented number of entries equal to pageSize', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToPreviousPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to that EntryListProvider currently provides, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToPreviousPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });
        });
    });

    describe('when entryListProvider provides (pageSize - 1) entries at first', () => {
        beforeEach(() => {
            pageSize = 2;
            entryList = createEntryList(pageSize - 1);
        });

        describe('moveToNextPage gets called', () => {
            it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize - 1),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when EntryListProvider provides the same number of entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides the same number of entries, but all of them are new ones', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize - 1, 1);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides no entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = [];
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = [];
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to pageSize', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize - 1, 1);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to pageSize, but all of them are new ones', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize - 1, 2);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, all of them are new ones, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to (pageSize + 1)', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize - 1, 2);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the single last entry, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(1, 2),
                                true,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to (pageSize + 1), but all of them are new', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize - 1, 3);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the single last entry, which is a new one, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(1, 2),
                                true,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the first entries of the number equal to pageSize, all of them are new ones, with both hasPreviousPage and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize, 1),
                                true,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });
        });

        describe('moveToPreviousPage gets called', () => {
            it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize - 1),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });
    });

    describe('when entryListProvider provides pageSize entries at first', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = createEntryList(pageSize);
        });

        describe('moveToNextPage gets called', () => {
            it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when EntryListProvider provides the same number of entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides the same number of entries, but all of them are new ones', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize, 1);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to pageSize, all of them are new ones, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides no entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = [];
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with an empty entry list, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                [],
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = [];
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides a reduced number of entries equal to (pageSize - 1)', () => {
                beforeEach(() => {
                    pageSize = 2;
                    entryList = createEntryList(pageSize);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides a reduced number of entries equal to (pageSize - 1), but all of them are new ones', () => {
                beforeEach(() => {
                    pageSize = 2;
                    entryList = createEntryList(pageSize, 1);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the number of entries equal to (pageSize - 1), all of them are new ones, with both hasPreviousPage and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize - 1),
                                false,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize - 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to (pageSize + 1)', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize, 1);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the single last entry, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(1, 1),
                                true,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });

            describe('when EntryListProvider provides an augment number of entries equal to (pageSize + 1), but all of them are new ones', () => {
                beforeEach(() => {
                    entryList = createEntryList(pageSize, 2);
                });

                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the single last entry, which is a new one, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(1, 1),
                                true,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the entries of the number equal to pageSize, all of them are new ones, with both hasPreviousPage and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize, 1),
                                true,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        entryList = createEntryList(pageSize + 1);
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });
        });

        describe('moveToPreviousPage gets called', () => {
            it('should cause emitting a page with the number of entries equal to pageSize, with both hasPreviousPage and hasNextPage set to false', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize),
                        false,
                        false
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });
    });

    describe('when entryListProvider provides (pageSize + 1) entries at first', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = createEntryList(pageSize + 1);
        });

        describe('moveToNextPage gets called', () => {
            it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize),
                        false,
                        true
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToNextPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });

            describe('when EntryListProvider provides the same number of entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the single last entry, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(1, 1),
                                true,
                                false
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });

                    describe('when EntryListProvider provides the same number of entries', () => {
                        describe('...then moveToNextPage gets called', () => {
                            it('should cause emitting a page with the single last entry, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                                const expectedMarble = '(a)';
                                const expectedValues = {
                                    a: new EntryPage(
                                        createEntryList(1, 1),
                                        true,
                                        false
                                    )
                                };
                                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();

                                scheduler.run(({ expectObservable }) => {
                                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                                });
                            });
                        });

                        describe('...then moveToPreviousPage gets called', () => {
                            it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                                const expectedMarble = '(a)';
                                const expectedValues = {
                                    a: new EntryPage(
                                        createEntryList(pageSize),
                                        false,
                                        true
                                    )
                                };
                                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToPreviousPage();

                                scheduler.run(({ expectObservable }) => {
                                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                                });
                            });
                        })
                    });
                });

                describe('...then moveToPreviousPage gets called', () => {
                    it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize),
                                false,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToPreviousPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });
                });
            });
        });

        describe('moveToPreviousPage gets called', () => {
            it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                const expectedMarble = '(a)';
                const expectedValues = {
                    a: new EntryPage(
                        createEntryList(pageSize),
                        false,
                        true
                    )
                };
                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                await entryPageList.moveToPreviousPage();

                scheduler.run(({ expectObservable }) => {
                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                });
            });
        });
    });

    describe('when entryListProvider provides (2 * pageSize + 1) entries at first', () => {
        beforeEach(() => {
            pageSize = 1;
            entryList = createEntryList(2 * pageSize + 1);
        });

        describe('moveToNextPage gets called', () => {
            describe('when EntryListProvider provides the same number of entries', () => {
                describe('...then moveToNextPage gets called', () => {
                    it('should cause emitting a page with the intermediate entries of the number equal to pageSize, with both hasPreviousPage and hasNextPage set to true', async () => {
                        const expectedMarble = '(a)';
                        const expectedValues = {
                            a: new EntryPage(
                                createEntryList(pageSize, 1),
                                true,
                                true
                            )
                        };
                        const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                        await entryPageList.moveToNextPage();
                        await entryPageList.moveToNextPage();

                        scheduler.run(({ expectObservable }) => {
                            expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                        });
                    });

                    describe('when EntryListProvider provides the same number of entries', () => {
                        describe('...then moveToNextPage gets called', () => {
                            it('should cause emitting a page with the single last entry, with hasPreviousPage set to true and hasNextPage set to false', async () => {
                                const expectedMarble = '(a)';
                                const expectedValues = {
                                    a: new EntryPage(
                                        createEntryList(1, 2),
                                        true,
                                        false
                                    )
                                };
                                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();

                                scheduler.run(({ expectObservable }) => {
                                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                                });
                            });
                        });

                        describe('...then moveToPreviousPage gets called', () => {
                            it('should cause emitting a page with the first entries of the number equal to pageSize, with hasPreviousPage set to false and hasNextPage set to true', async () => {
                                const expectedMarble = '(a)';
                                const expectedValues = {
                                    a: new EntryPage(
                                        createEntryList(pageSize),
                                        false,
                                        true
                                    )
                                };
                                const entryPageList = new EntryPageList(pageSize, entryListProvider, entryFactory);

                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToNextPage();
                                await entryPageList.moveToPreviousPage();

                                scheduler.run(({ expectObservable }) => {
                                    expectObservable(entryPageList.$).toBe(expectedMarble, expectedValues);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

