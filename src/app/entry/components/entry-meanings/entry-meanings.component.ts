import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

import { Meaning } from '../../models/entry';
import { entryMeaningsValidationValues } from '../../config/entry-validation-values';
import { EntryMeaningFormControl } from '../../models/entry-form';
import { ButtonState } from 'src/app/shared/config/components/button';
import { onlyWhiteSpacesPreventionValidator } from 'src/app/shared/services/form/form-control-validators';
import { assert } from 'src/app/shared/utils/assert/assert';

@Component({
  selector: 'app-entry-meanings',
  templateUrl: './entry-meanings.component.html',
  styleUrls: ['./entry-meanings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: EntryMeaningsComponent
    }
  ]
})
export class EntryMeaningsComponent implements OnInit, OnDestroy, ControlValueAccessor {
  ButtonState = ButtonState;

  faXmarkCircle = faXmarkCircle;

  entryMeaningsValidationValues = entryMeaningsValidationValues;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subscribeToNotificationsOfAttemptToSubmitInvalidForm();
  }

  private subscribeToNotificationsOfAttemptToSubmitInvalidForm(): void {
    this.attemptsToSubmitInvalidFormSubscription = this.attemptsToSubmitInvalidForm$.subscribe(() => {
    });
  }

  private attemptsToSubmitInvalidFormSubscription!: Subscription;
  @Input() attemptsToSubmitInvalidForm$!: Observable<void>;

  writeValue(entryMeanings: Meaning[]): void {
    this.entryMeanings = entryMeanings;
  }

  entryMeanings!: Meaning[];

  registerOnChange(onChange: (entryMeanings: Meaning[]) => void) {
    this.onChange = onChange;
  }

  private onChange!: (entryMeanings: Meaning[]) => void;

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  private onTouched!: () => void;

  setDisabledState(isDisabled: boolean): void {
    this.shouldAllControlsBeDisabled = isDisabled;
  }

  shouldAllControlsBeDisabled: boolean = false;

  getMeaningState(meaning: Meaning): 'view' | 'being-edited' | 'deleted' {
    if (this.meaningsBeingEdited.has(meaning)) {
      return 'being-edited';
    }
    if (this.deletedMeanings.has(meaning)) {
      return 'deleted';
    }
    return 'view';
  }

  private meaningsBeingEdited: Map<Meaning, EntryMeaningFormControl> = new Map<Meaning, EntryMeaningFormControl>();

  private deletedMeanings: Set<Meaning> = new Set<Meaning>();

  editMeaning(meaning: Meaning): void {
    assert(!this.meaningsBeingEdited.has(meaning),
      `This meaning is already being edited`);
    assert(!this.deletedMeanings.has(meaning),
      `This meaning has been deleted`);

    this.meaningsBeingEdited.set(meaning, this.createMeaningFormControl(meaning));
    this.markAsTouched();
  }

  private createMeaningFormControl(meaning: Meaning): EntryMeaningFormControl {
    return this.formBuilder.nonNullable.group({
      definition: [
        meaning.definition,
        [
          onlyWhiteSpacesPreventionValidator,
          Validators.min(entryMeaningsValidationValues.definitionMinLength),
          Validators.max(entryMeaningsValidationValues.definitionMaxLength)
        ]
      ],
      examples: this.formBuilder.nonNullable.array(
        meaning.examples.map(example => this.createMeaningExampleFormControl(example)),
        [
          Validators.min(entryMeaningsValidationValues.examplesMinLength),
          Validators.max(entryMeaningsValidationValues.examplesMaxLength)
        ]
      )
    });
  }

  private createMeaningExampleFormControl(example: string): FormControl<string> {
    return this.formBuilder.nonNullable.control(
      example,
      [
        onlyWhiteSpacesPreventionValidator,
        Validators.min(entryMeaningsValidationValues.exampleMinLength),
        Validators.max(entryMeaningsValidationValues.exampleMaxLength)
      ]
    )
  }

  private markAsTouched(): void {
    if (!this.isAnyControlTouched) {
      this.isAnyControlTouched = true;
      this.onTouched();
    }
  }

  private isAnyControlTouched: boolean = false;

  get isEditButtonButtonDisabled(): boolean {
    return this.shouldAllControlsBeDisabled;
  }

  deleteMeaning(meaning: Meaning) {
    assert(!this.deletedMeanings.has(meaning),
      `This meaning is already deleted`);
    assert(!this.meaningsBeingEdited.has(meaning),
      `This meaning is for now being edited`);

    this.deletedMeanings.add(meaning);
    this.markAsTouched();
    this.notifyOfChanges();
  }

  private notifyOfChanges(): void {
    this.onChange(this.getRemainedMeanings());
  }

  private getRemainedMeanings(): Meaning[] {
    return this.entryMeanings.filter(
      (meaning: Meaning) => !this.deletedMeanings.has(meaning)
    );
  }

  get isDeleteMeaningButtonDisabled(): boolean {
    return this.shouldAllControlsBeDisabled;
  }

  getFormControlForMeaningBeingEdited(meaning: Meaning): EntryMeaningFormControl {
    assert(this.meaningsBeingEdited.has(meaning),
      `This meaning is not being edited`);

    return this.meaningsBeingEdited.get(meaning)!;
  }

  restoreMeaning(meaning: Meaning): void {
    assert(this.deletedMeanings.has(meaning),
      `This meaning is not deleted`);
    assert(this.getRemainedMeanings().length < entryMeaningsValidationValues.meaningsMaxLength,
      `The length of the remained meanings is ${this.getRemainedMeanings().length}. Can't restore yet another one as the max allowable value is ${entryMeaningsValidationValues.meaningsMaxLength}`);

    this.deletedMeanings.delete(meaning);
    this.notifyOfChanges();
  }

  get isRestoreMeaningButtonDisabled(): boolean {
    return this.shouldAllControlsBeDisabled ||
      this.getRemainedMeanings().length === entryMeaningsValidationValues.meaningsMaxLength;
  }

  deleteMeaningExampleFormControl(meaningFormControl: EntryMeaningFormControl, exampleIndex: number): void {
    meaningFormControl.controls.examples.removeAt(exampleIndex);
  }

  addMeaningExampleFormControl(meaningFormControl: EntryMeaningFormControl): void {
    meaningFormControl.controls.examples.push(this.createMeaningExampleFormControl(''));
  }

  isAddMeaningExampleButtonDisabled(meaningFormControl: EntryMeaningFormControl): boolean {
    return meaningFormControl.controls.examples.length === entryMeaningsValidationValues.examplesMaxLength;
  }

  acceptMeaningChanges(meaning: Meaning, meaningFormControl: EntryMeaningFormControl): void {
    assert(this.meaningsBeingEdited.has(meaning),
      `This meaning is not being edited`);
    assert(meaningFormControl.valid,
      `The corresponding meaning form control is invalid: ${JSON.stringify(meaningFormControl.errors)}`);

    const meaningIndex = this.entryMeanings.indexOf(meaning);
    this.entryMeanings[meaningIndex] = meaningFormControl.value as Meaning;
    this.meaningsBeingEdited.delete(meaning);
    this.notifyOfChanges();
  }

  isAcceptMeaningChangesButtonDisabled(meaningFormControl: EntryMeaningFormControl): boolean {
    return meaningFormControl.invalid;
  }

  discardMeaningChanges(meaning: Meaning): void {
    assert(this.meaningsBeingEdited.has(meaning),
      `This meaning is not being edited`);

    this.meaningsBeingEdited.delete(meaning);
  }

  ngOnDestroy(): void {
    this.attemptsToSubmitInvalidFormSubscription.unsubscribe();
  }
}
