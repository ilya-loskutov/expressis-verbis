import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators, FormControlStatus } from '@angular/forms';

import { faBook } from '@fortawesome/free-solid-svg-icons';
import { filter, BehaviorSubject } from 'rxjs';

import { ButtonState } from 'src/app/shared/config/components/button';
import { TextInputState } from 'src/app/shared/config/components/text-input';
import { DictionaryService } from '../../services/dictionary.service';
import { dictionarySchema } from 'src/app/shared/config/database/database.schema';
import { DictionaryFormGroup } from '../../models/dictionary-form';
import { assert } from 'src/app/shared/utils/assert/assert';

@Component({
  selector: 'app-new-dictionary',
  templateUrl: './new-dictionary.component.html',
  styleUrls: ['./new-dictionary.component.scss']
})
export class NewDictionaryComponent implements OnInit {
  ButtonState = ButtonState;

  faBook = faBook;

  constructor(
    private formBuilder: FormBuilder,
    private dictionaryService: DictionaryService,
  ) {
    this.dictionaryPropertiesSchema = dictionarySchema.properties;
  }

  private dictionaryPropertiesSchema;

  ngOnInit(): void {
    this.createDictionaryForm();
    this.subscribeToFormStatus();
  }

  private createDictionaryForm(): void {
    this.dictionaryForm = this.formBuilder.nonNullable.group({
      name: ['',
        [
          Validators.required,
          Validators.maxLength(this.dictionaryPropertiesSchema.name.maxLength!)
        ]
      ]
    });
  }

  dictionaryForm!: DictionaryFormGroup;

  private subscribeToFormStatus(): void {
    this.dictionaryForm
      .statusChanges
      .pipe(
        filter((status: FormControlStatus) => status === 'INVALID' || status === 'VALID'),
      )
      .subscribe(status => {
        if (status === 'VALID') {
          this.updateTextInputState(TextInputState.success, null);
        }
        else {
          this.updateTextInputState(TextInputState.warning, this.getErrorMessageWhenFormIsInvalid());
        }
      })
  }

  private updateTextInputState(state: TextInputState, message: string | null): void {
    this.textInputState$.next(state);
    this.textInputMessage$.next(message);
  }

  textInputState$: BehaviorSubject<TextInputState> = new BehaviorSubject<TextInputState>(TextInputState.default);
  textInputMessage$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private getErrorMessageWhenFormIsInvalid(): string {
    assert(this.dictionaryForm.controls.name.errors !== null, 'There are no errors for the name control');

    const errors = this.dictionaryForm.controls.name.errors as ValidationErrors;
    if (errors['required']) {
      return `Please spare at least one character for the name`;
    }
    else if (errors['maxlength']) {
      const excessiveCharactersNumber: number = errors['maxlength'].actualLength - errors['maxlength'].requiredLength;
      return `What if the name were by ${excessiveCharactersNumber} character(s) less?`;
    }
    else {
      throw new Error(`Unknown errors in the form control: ${JSON.stringify(errors)}`)
    }
  }

  async onFormSubmit(): Promise<void> {
    if (this.dictionaryForm.invalid) {
      this.onInvalidFormSubmit();
    }
    else {
      await this.onValidFormSubmit()
    }
  }

  private onInvalidFormSubmit(): void {
    this.updateTextInputState(TextInputState.error, this.getErrorMessageWhenFormIsInvalid())
  }

  private async onValidFormSubmit(): Promise<void> {
    this.disableForm();
    await this.createNewDictionary();
    this.resetForm();
  }

  private disableForm(): void {
    this.dictionaryForm.disable();
    this.formButtonDisabled = true;
  }

  formButtonDisabled: boolean = false;

  private async createNewDictionary(): Promise<void> {
    const newDictionaryName: string = this.dictionaryForm.value.name as string;
    await this.dictionaryService.createDictionary(newDictionaryName);
  }

  private resetForm(): void {
    this.dictionaryForm.reset();
    this.dictionaryForm.enable();
    this.updateTextInputState(TextInputState.default, null)
    this.formButtonDisabled = false;
  }
}
