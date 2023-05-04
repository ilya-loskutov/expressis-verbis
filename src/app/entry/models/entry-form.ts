import { FormGroup, FormControl, FormArray } from "@angular/forms";

import { JsonSchema } from "rxdb";

import { entrySchema, meaningSchema as ms } from "src/app/shared/config/database/database.schema";

export type FormMeaning = FormGroup<{
    definition: FormControl<string>,
    examples: FormArray<FormControl<string>>
}>;

export type EntryForm = FormGroup<{
    newWord: FormControl<string>,
    meanings: FormControl<{ [index: number]: FormMeaning }>
}>;

const wordsSchema = entrySchema.properties.words;
const wordSchema = wordsSchema.items as JsonSchema<any>;

const meaningSchema = ms.properties;
const exampleSchema = meaningSchema.examples.items as JsonSchema<any>;

export const entryPropertiesValidationValues = {
    wordsMinLength: wordsSchema.minItems as number,
    wordsMaxLength: wordsSchema.maxItems as number,
    wordMinLength: wordSchema.minLength as number,
    wordMaxLength: wordSchema.maxLength as number,
    meaningsMaxLength: entrySchema.properties.meanings.maxItems as number,
    definitionMinLength: meaningSchema.definition.minLength as number,
    definitionMaxLength: meaningSchema.definition.maxLength as number,
    examplesMaxLength: meaningSchema.examples.maxItems as number,
    exampleMinLength: exampleSchema.minLength as number,
    exampleMaxLength: exampleSchema.maxLength as number
}

export type EntryMeaningFormControl = FormGroup<{
    definition: FormControl<string>,
    examples: FormArray<FormControl<string>>
}>;