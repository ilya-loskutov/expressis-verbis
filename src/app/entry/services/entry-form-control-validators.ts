import { ValidationErrors, AbstractControl } from "@angular/forms";

import { entryWordsValidationValues } from "../config/entry-validation-values";

import { assert } from "src/app/shared/utils/assert/assert";

export function entryWordsValidator(control: AbstractControl): ValidationErrors | null {
    assert(Array.isArray(control.value), `An array value was expected for validation`);

    /* 
    We validate only this error as assume the entry words component does not allow pass 
    all other possible types of errors
    */
    const entryWords: string[] = control.value;
    if (entryWords.length < entryWordsValidationValues.wordsMinLength) {
        return {
            entryWordsLengthLessThanAllowableValueError: true
        };
    }
    return null;
}

export function entryMeaningsValidator(control: AbstractControl): ValidationErrors | null {
    return null;
}