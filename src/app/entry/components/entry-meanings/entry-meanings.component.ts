import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { Meaning } from '../../models/entry';
import { entryMeaningsValidationValues } from '../../config/entry-validation-values';
import { ButtonState } from 'src/app/shared/config/components/button';
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

  getMeaningState(meaning: Meaning): 'view' | 'deleted' {
    if (this.deletedMeanings.has(meaning)) {
      return 'deleted';
    }
    return 'view';
  }

  private deletedMeanings: Set<Meaning> = new Set<Meaning>();

  deleteMeaning(meaning: Meaning) {
    assert(!this.deletedMeanings.has(meaning),
      `This meaning is already deleted`);

    this.deletedMeanings.add(meaning);
    this.markAsTouched();
    this.notifyOfChange();
  }

  private markAsTouched(): void {
    if (!this.isAnyControlTouched) {
      this.isAnyControlTouched = true;
      this.onTouched();
    }
  }

  private isAnyControlTouched: boolean = false;

  private notifyOfChange(): void {
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

  restoreMeaning(meaning: Meaning): void {
    assert(this.deletedMeanings.has(meaning),
      `This meaning is not deleted`);
    assert(this.getRemainedMeanings().length < entryMeaningsValidationValues.meaningsMaxLength,
      `The length of the remained meanings is ${this.getRemainedMeanings().length}. Can't restore yet another one as the max allowable value is ${entryMeaningsValidationValues.meaningsMaxLength}`);

    this.deletedMeanings.delete(meaning);
    this.notifyOfChange();
  }

  get isRestoreMeaningButtonDisabled(): boolean {
    return this.shouldAllControlsBeDisabled ||
      this.getRemainedMeanings().length === entryMeaningsValidationValues.meaningsMaxLength;
  }

  ngOnDestroy(): void {
    this.attemptsToSubmitInvalidFormSubscription.unsubscribe();
  }
}
