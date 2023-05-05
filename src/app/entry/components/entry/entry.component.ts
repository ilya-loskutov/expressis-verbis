import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { map, Subscription, Subject } from 'rxjs';

import { Entry } from '../../models/entry';
import { EntryService } from '../../services/entry.service';
import { EntryForm } from '../../models/entry-form';
import { entryWordsValidator, entryMeaningsValidator } from '../../services/entry-form-control-validators';
import { ButtonState } from 'src/app/shared/config/components/button';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit, OnDestroy {
  ButtonState = ButtonState;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private entryService: EntryService
  ) { }

  ngOnInit(): void {
    this.subscribeToRouteDataToGetCurrentEntry();
  }

  private subscribeToRouteDataToGetCurrentEntry(): void {
    this.entrySubscription = this.activatedRoute.data.pipe(
      map(data => data['entry'])
    )
      .subscribe((entry: Entry) => this.createEntryForm(entry));
  }

  private entrySubscription!: Subscription;

  private createEntryForm(entry: Entry): void {
    this.entryForm = this.formBuilder.nonNullable.group({
      id: [entry.id],
      words: [
        entry.words,
        [entryWordsValidator]
      ],
      meanings: [
        entry.meanings,
        [entryMeaningsValidator]
      ],
      lastUpdated: [entry.lastUpdated],
      dictionaryId: [entry.dictionaryId]
    });
  }

  entryForm!: EntryForm;

  ngOnDestroy(): void {
    this.entrySubscription.unsubscribe();
  }

  async onFormSubmit(): Promise<void> {
    if (this.entryForm.invalid) {
      this.onInvalidFormSubmit();
    }
    else {
      await this.onValidFormSubmit();
    }
  }

  private onInvalidFormSubmit(): void {
    this.attemptsToSubmitInvalidForm$.next();
    if (this.entryForm.controls.words.errors?.['entryWordsLengthLessThanAllowableValueError']) {
      this.scrollTo('words');
    }
    else if (this.entryForm.controls.meanings.errors?.['someMeaningsAreBeingEdited']) {
      this.scrollTo('meanings');
    }
    else {
      throw new Error(`Unexpected form errors: ${JSON.stringify(this.entryForm.errors)}`)
    }
  }

  attemptsToSubmitInvalidForm$: Subject<void> = new Subject<void>();

  private scrollTo(elementId: string): void {
    const entryWordsElement = document.getElementById(elementId) as HTMLElement;
    entryWordsElement.scrollIntoView({ behavior: 'smooth' });
  }

  private async onValidFormSubmit(): Promise<void> {
    this.entryForm.disable();
    await this.entryService.addOrUpdate(this.entryForm.value as Entry);
    this.entryForm.markAsPristine();
    this.router.navigate([navigationPaths.entryList]);
  }

  get isSubmitFormButtonDisabled(): boolean {
    return this.entryForm.disabled ||
      !this.isEntryChanged;
  }

  get isEntryChanged(): boolean {
    return this.entryForm.dirty;
  }

  cancelFormSubmission(): void {
    this.router.navigate([navigationPaths.entryList]);
  }

  get isCancelFormSubmissionButtonDisabled(): boolean {
    return this.entryForm.disabled;
  }
}
