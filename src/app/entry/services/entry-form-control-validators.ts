import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

import { entryWordsValidationValues } from "../config/entry-validation-values";

import { EntryMeaningsComponent } from "../components/entry-meanings/entry-meanings.component";
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

export function getEntryMeaningsValidator(entryMeaningsComponent: EntryMeaningsComponent): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        assert(Array.isArray(control.value), `An array value was expected for validation`);
        /* 
        We validate only this error as assume the entry meanings component does not allow pass 
        all other possible types of errors
        */
        if (entryMeaningsComponent.areThereMeaningsBeingEdited) {
            return {
                someMeaningsBeingEditedError: true
            };
        }
        return null;
    }
}