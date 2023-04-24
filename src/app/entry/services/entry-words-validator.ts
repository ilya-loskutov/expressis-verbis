import { ValidationErrors, AbstractControl } from "@angular/forms";

import { entryWordsValidationValues } from "../config/entry-validation-values";

import { assert } from "src/app/shared/utils/assert/assert";

export function entryWordsValidators(control: AbstractControl): ValidationErrors | null {
    assert(Array.isArray(control.value), `An array value was expected for validation`);

    const entryWords: string[] = control.value;
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