import { FormGroup, FormControl, FormArray } from "@angular/forms";

import { Meaning } from "./entry";

export type EntryMeaningFormControl = FormGroup<{
    definition: FormControl<string>,
    examples: FormArray<FormControl<string>>
}>;

export type EntryForm = FormGroup<{
    id: FormControl<string>;
    words: FormControl<string[]>,
    meanings: FormControl<Meaning[]>,
    lastUpdated: FormControl<string>,
    dictionaryId: FormControl<string>
}>;