import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { Meaning } from '../../models/entry';

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
  }

  shouldAllControlsBeDisabled: boolean = false;

  ngOnDestroy(): void {
    this.attemptsToSubmitInvalidFormSubscription.unsubscribe();
  }
}
