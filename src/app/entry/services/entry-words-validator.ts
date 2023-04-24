import { ValidationErrors, AbstractControl } from "@angular/forms";

import { entryWordsValidationValues } from "../config/entry-validation-values";
import { EntryWordsComponent } from "../components/entry-words/entry-words.component";

export function entryWordsValidators(entryWordsComponent: EntryWordsComponent): ValidationErrors | null {
    const entryWords = entryWordsComponent.entryWords;
    if (entryWords.length < entryWordsValidationValues.wordsMinLength) {
        return {
            entryWordsLengthLessThanAllowableValueError: true
        };
    }
    if (entryWords.length > entryWordsValidationValues.wordsMaxLength) {
        return {
            entryWordsLengthMoreThanAllowableValueError: true
        };
    }
    return null;
}