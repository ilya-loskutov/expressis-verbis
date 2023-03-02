import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Dictionary } from 'src/app/dictionary/models/dictionary';
import { DictionaryService } from 'src/app/dictionary/services/dictionary.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

  constructor(
    private dictionaryService: DictionaryService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.navigateOnDictionarySelected();
  }

  navigateOnDictionarySelected(): void {
    this.dictionaryService.selectedDictionary$
      .subscribe((selectedDicionary: Dictionary) => {
        selectedDicionary.navigateOnBeingSelected(this.router);
      });
  }
}
