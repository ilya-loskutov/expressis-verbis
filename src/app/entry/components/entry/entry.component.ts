import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { map, Subscription, Subject } from 'rxjs';

import { Entry } from '../../models/entry';
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

  get isEntryChanged(): boolean {
    return this.entryForm.dirty;
  }

  attemptsToSubmitInvalidForm$: Subject<void> = new Subject<void>();

  cancelFormSubmission(): void {
    this.router.navigate([navigationPaths.entryList]);
  }

  get isCancelFormSubmissionButtonDisabled(): boolean {
    return this.entryForm.disabled;
  }
}
