import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, Subject } from 'rxjs';

import { Entry, Meaning } from '../../models/entry';
import { entryWordsValidator, entryMeaningsValidator } from '../../services/entry-form-control-validators';

@Component({
  selector: 'app-temporary-entry',
  templateUrl: './temporary-entry.component.html',
  styleUrls: ['./temporary-entry.component.scss']
})
export class TemporaryEntryComponent {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data
      .pipe(
        map(data => data['entry']),
      )
      .subscribe((entry: Entry) => {
        this.form.controls.words.setValue(entry.words);
        this.form.controls.meanings.setValue(entry.meanings)
      });
  }

  form: FormGroup<{
    words: FormControl<string[]>,
    meanings: FormControl<Meaning[]>
  }> = this.formBuilder.nonNullable.group({
    words: [
      [] as string[],
      [entryWordsValidator]
    ],
    meanings: [
      [] as Meaning[],
      [entryMeaningsValidator]
    ]
  });

  attemptsToSubmitInvalidForm$ = new Subject<void>();
}
