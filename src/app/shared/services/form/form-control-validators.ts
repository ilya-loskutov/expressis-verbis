import { ValidationErrors, AbstractControl, ValidatorFn, FormArray } from "@angular/forms";

export function onlyWhiteSpacesPreventionValidator(formControl: AbstractControl): ValidationErrors | null {
    if (formControl.value.trim().length === 0) {
        return {
            onlyWhiteSpacesError: true
        };
    }
    return null;
}