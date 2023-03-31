import { Router } from "@angular/router";

import { navigationPaths } from "src/app/shared/config/navigation-paths/navigation-paths";

export class Dictionary {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    readonly id: string;
    name: string;

    navigateOnBeingSelected(router: Router): void {
        router.navigate(
            [navigationPaths.entryList]
        );
    }

    equals(dictionary: Dictionary): boolean {
        return this.id === dictionary.id;
    }

    get isNullDictionary(): boolean {
        return false;
    }
}

export class NullDictionary extends Dictionary {
    constructor() {
        super('dummyId', 'dummyName');
    }

    override navigateOnBeingSelected(router: Router): void {
        router.navigate(
            [navigationPaths.availableDictionaries],
        );
    }

    override equals(dictionary: Dictionary): boolean {
        if (dictionary instanceof NullDictionary) {
            return true;
        }
        return false;
    }

    override get isNullDictionary(): boolean {
        return true;
    }
}