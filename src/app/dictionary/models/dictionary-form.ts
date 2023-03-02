import { FormGroup, FormControl } from "@angular/forms";

export type DictionaryFormGroup = FormGroup<{
    name: FormControl<string>
}>