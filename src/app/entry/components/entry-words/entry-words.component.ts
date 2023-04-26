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
    this.createnewWordInput();
    this.subscribeToNotificationsOfAttemptToSubmitInvalidForm();
  }

  private createnewWordInput(): void {
    this.newWordInput = this.formBuilder.nonNullable.control<string>(
      '', // we do not set a disabled value here as entryWords doesn't exist yet, it will set in setDisabledState()
      [
        onlyWhiteSpacesPreventionValidator,
        Validators.minLength(entryWordsValidationValues.wordMinLength),
        Validators.maxLength(entryWordsValidationValues.wordMaxLength),
      ]
    );
  }

  newWordInput!: FormControl<string>;

  entryWords!: string[];

  private subscribeToNotificationsOfAttemptToSubmitInvalidForm(): void {
    this.attemptsToSubmitInvalidFormSubscription = this.attemptsToSubmitInvalidForm$.subscribe(() => {
      assert(this.entryWords.length < entryWordsValidationValues.wordsMinLength,
        `The entry's words is of ${this.entryWords.length} length while it is expected to be of less than the min allowable value (${entryWordsValidationValues.wordsMinLength})`);

      this.updateNewWordInputStatus('Please add at least one related word', TextInputState.error);
    });
  }

  private attemptsToSubmitInvalidFormSubscription!: Subscription;
  @Input() attemptsToSubmitInvalidForm$!: Observable<void>;

  private updateNewWordInputStatus(message: string, state: TextInputState): void {
    this.newWordInputMessage$.next(message);
    this.newWordInputState$.next(state);
  }

  newWordInputMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  newWordInputState$: BehaviorSubject<TextInputState> = new BehaviorSubject<TextInputState>(TextInputState.default);

  writeValue(entryWords: string[]): void {
    this.entryWords = entryWords;
  }

  registerOnChange(onChange: (entryWords: string[]) => void) {
    this.onChange = onChange;
  }

  private onChange!: (entryWords: string[]) => void;

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  private onTouched!: () => void;

  setDisabledState(isDisabled: boolean): void {
    this.shouldAllControlsBeDisabled = isDisabled;
    this.setDisabledValueTonewWordInput();
  }

  private setDisabledValueTonewWordInput(): void {
    if (this.shouldnewWordInputBeDisabled) {
      this.newWordInput.disable();
    }
    else {
      this.newWordInput.enable();
    }
  }

  get shouldnewWordInputBeDisabled(): boolean {
    return this.shouldAllControlsBeDisabled ||
      this.entryWords.length === entryWordsValidationValues.wordsMaxLength;
  }

  private shouldAllControlsBeDisabled: boolean = false;

  deleteWord(index: number): void {
    assert(this.entryWords[index] !== undefined,
      `There is no word at the ${index} index`);

    this.entryWords.splice(index, 1);
    this.onChange(this.entryWords);
    this.markAsTouched();
    this.setDisabledValueTonewWordInput();
  }

  markAsTouched(): void {
    if (!this.isAnyControlTouched) {
      this.isAnyControlTouched = true;
      this.onTouched();
    }
  }

  private isAnyControlTouched: boolean = false;

  get isDeleteWordButtonDisabled(): boolean {
    return this.shouldAllControlsBeDisabled;
  }

  addNewWord(): void {
    assert(this.entryWords.length < entryWordsValidationValues.wordsMaxLength,
      `The entry's words of ${this.entryWords.length} length while it is expected to be of less than the max allowable value (${entryWordsValidationValues.wordsMaxLength})`);
    assert(this.newWordInput.valid, 'The new word form control is invalid');

    this.entryWords.push(this.newWordInput.value.trim());
    this.onChange(this.entryWords);
    this.newWordInput.reset();
    if (this.entryWords.length === 1) {
      this.updateNewWordInputStatus('', TextInputState.default);
    }
    this.setDisabledValueTonewWordInput();
  }

  get inNewWordButtonDisabled(): boolean {
    return this.shouldnewWordInputBeDisabled ||
      !this.newWordInput.valid;
  }

  onNewWordInputBlur(): void {
    this.markAsTouched();
  }

  ngOnDestroy(): void {
    this.attemptsToSubmitInvalidFormSubscription.unsubscribe();
  }
}
