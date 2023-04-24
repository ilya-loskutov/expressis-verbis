import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, Subject } from 'rxjs';

import { Entry } from '../../models/entry';
import { entryWordsValidators } from '../../services/entry-words-validator';

@Component({
  selector: 'app-temporary-entry',
  templateUrl: './temporary-entry.component.html',
  styleUrls: ['./temporary-entry.component.scss']
})
export class TemporaryEntryComponent {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map(data => data['entry']),
      )
      .subscribe((entry: Entry) => {
        this.form.controls.words.setValue(entry.words);
      });
  }

  form: FormGroup<{
    words: FormControl<string[]>
  }> = this.formBuilder.nonNullable.group({
    words: [
      [] as string[],
      [entryWordsValidators]
    ]
  });

  invalidFormSubmittingAttempts$ = new Subject<void>();
}
