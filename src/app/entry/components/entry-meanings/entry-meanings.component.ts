import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { Meaning } from '../../models/entry';
import { ButtonState } from 'src/app/shared/config/components/button';

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

  getMeaningState(index: number): 'view' {
    return 'view';
  }

  ngOnDestroy(): void {
    this.attemptsToSubmitInvalidFormSubscription.unsubscribe();
  }
}
