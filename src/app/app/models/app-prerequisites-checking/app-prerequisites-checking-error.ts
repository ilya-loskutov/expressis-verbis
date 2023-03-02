import { errorConfig } from "../../config/app-prerequisites-checking/app-prerequisites-checking-error.config";

export abstract class AppPrerequisitesCheckingError extends Error {
    title: string = errorConfig.title;
}

export class IndexedDBUnavailableError extends AppPrerequisitesCheckingError {
    constructor() {
        super(errorConfig.messages.indexedDBUnavailable);
    }
}

export class DatabaseCannotBeGottenError extends AppPrerequisitesCheckingError {
    constructor() {
        super(errorConfig.messages.databaseCannotBeGotten);
    }
}