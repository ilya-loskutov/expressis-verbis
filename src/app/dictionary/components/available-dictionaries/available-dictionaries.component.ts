import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { faFlag } from '@fortawesome/free-regular-svg-icons';

import { Dictionary } from '../../models/dictionary';
import { DictionaryService } from '../../services/dictionary.service';
import { PanelState } from 'src/app/shared/config/components/panel';

@Component({
  selector: 'app-available-dictionaries',
  templateUrl: './available-dictionaries.component.html',
  styleUrls: ['./available-dictionaries.component.scss']
})
export class AvailableDictionariesComponent implements OnInit {
  faFlag = faFlag;

  PanelState = PanelState;

  constructor(
    private dictionaryService: DictionaryService,
  ) {
    this.availableDictionaries$ = this.dictionaryService.availableDictionaries$;
    this.selectedDictionary$ = this.dictionaryService.selectedDictionary$;
  }

  availableDictionaries$: Observable<Dictionary[]>;
  selectedDictionary$: Observable<Dictionary>;

  ngOnInit(): void {
  }

  areThereNoAvailableDictionaries(availableDictionaries: Dictionary[]): boolean {
    return availableDictionaries.length === 0;
  }

  onDictionaryClick(dictionary: Dictionary): void {
    this.dictionaryService.selectedDictionary = dictionary;
  }
}
