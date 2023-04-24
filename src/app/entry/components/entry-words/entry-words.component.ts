import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { entryWordsValidationValues } from '../../config/entry-validation-values';
import { onlyWhiteSpacesPreventionValidator } from 'src/app/shared/services/form/form-control-validators';
import { assert } from 'src/app/shared/utils/assert/assert';
import { ButtonState } from 'src/app/shared/config/components/button';
import { TextInputState } from 'src/app/shared/config/components/text-input';

@Component({
  selector: 'app-entry-words',
  templateUrl: './entry-words.component.html',
  styleUrls: ['./entry-words.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: EntryWordsComponent
    }
  ]
})
export class EntryWordsComponent implements OnInit, OnDestroy, ControlValueAccessor {
  faXmarkCircle = faXmarkCircle;

  ButtonState = ButtonState;
  TextInputState = TextInputState;

  entryWordsValidationValues = entryWordsValidationValues;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit')
    console.log(this.entryWords);
    this.subscribeToNotificationsOfAttemptToSubmitInvalidForm();
  }

  private subscribeToNotificationsOfAttemptToSubmitInvalidForm(): void {
    this.invalidFormSubmittingAttemptsSubscription = this.invalidFormSubmittingAttempts$.subscribe(() => {
      assert(this.entryWords.length < entryWordsValidationValues.wordsMinLength,
        `The entry's words is of ${this.entryWords.length} length while it is expected to be of less than the min allowable value (${entryWordsValidationValues.wordsMinLength})`);

      this.updateNewWordTextInputStatus('Please add at least one related word', TextInputState.error);
    });
  }

  private invalidFormSubmittingAttemptsSubscription!: Subscription;
  @Input() invalidFormSubmittingAttempts$!: Observable<void>;

  private updateNewWordTextInputStatus(message: string, state: TextInputState): void {
    this.newWordTextInputMessage$.next(message);
    this.newWordTextInputState$.next(state);
  }

  newWordTextInputMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  newWordTextInputState$: BehaviorSubject<TextInputState> = new BehaviorSubject<TextInputState>(TextInputState.default);

  writeValue(entryWords: string[]): void {
    this.entryWords = entryWords;
  }

  entryWords!: string[];

  registerOnChange(onChange: (entryWords: string[]) => void) {
    this.onChange = onChange;
  }

  private onChange!: (entryWords: string[]) => void;

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  private onTouched!: () => void;

  setDisabledState(isDisabled: boolean): void {
    this.areAllControlsDisabled = isDisabled;
  }

  private areAllControlsDisabled: boolean = false;

  newWordFormControl: FormControl<string> = this.formBuilder.nonNullable.control<string>(
    {
      value: '',
      disabled: this.areNewWordControlsDisabled
    },
    [
      onlyWhiteSpacesPreventionValidator,
      Validators.minLength(entryWordsValidationValues.wordMinLength),
      Validators.maxLength(entryWordsValidationValues.wordMaxLength),
    ]
  );

  get areNewWordControlsDisabled(): boolean {
    return this.areAllControlsDisabled ||
      this.entryWords.length === entryWordsValidationValues.wordsMaxLength;
  }

  deleteWord(index: number): void {
    assert(this.entryWords[index] !== undefined,
      `There is no word at the ${index} index`);

    this.entryWords.splice(index, 1);
    this.onChange(this.entryWords);
    this.markAsTouched();
  }

  markAsTouched(): void {
    console.log('markAsTouched')
    if (!this.isAnyControlTouched) {
      this.isAnyControlTouched = true;
      this.onTouched();
    }
  }

  private isAnyControlTouched: boolean = false;

  get isDeleteWordButtonDisabled(): boolean {
    return this.areAllControlsDisabled;
  }

  addNewWord(): void {
    assert(this.entryWords.length < entryWordsValidationValues.wordsMaxLength,
      `The entry's words of ${this.entryWords.length} length while it is expected to be of less than the max allowable value (${entryWordsValidationValues.wordsMaxLength})`);
    assert(this.newWordFormControl.valid, 'The new word form control is invalid');

    this.entryWords.push(this.newWordFormControl.value.trim());
    this.onChange(this.entryWords);
    this.newWordFormControl.reset();
    if (this.entryWords.length === 1) {
      this.updateNewWordTextInputStatus('', TextInputState.default);
    }
  }

  ngOnDestroy(): void {
    this.invalidFormSubmittingAttemptsSubscription.unsubscribe();
  }
}
