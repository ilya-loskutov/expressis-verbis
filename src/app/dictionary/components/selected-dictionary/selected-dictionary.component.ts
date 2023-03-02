import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SELECTED_DICTIONARY_PROVIDER, SelectedDictionaryProvider } from '../../services/selected-dictionary-provider';
import { SHOW_MODAL } from 'src/app/shared/services/positioned-windows/show-modal';
import { ModalConfigurations } from 'src/app/shared/config/components/modal';

@Component({
  selector: 'app-selected-dictionary',
  templateUrl: './selected-dictionary.component.html',
  styleUrls: ['./selected-dictionary.component.scss']
})
export class SelectedDictionaryComponent implements OnInit {

  constructor(
    @Inject(SHOW_MODAL) private showModal$: BehaviorSubject<ModalConfigurations | null>,
    @Inject(SELECTED_DICTIONARY_PROVIDER) public selectedDictionaryProvider: SelectedDictionaryProvider
  ) { }

  onNonNullDictionaryClick(): void {
    this.showModal$.next({
      isClosable: true,
      content: this.availableDictionariesModalContent
    });
  }

  @ViewChild('availableDictionariesModalContent', { read: TemplateRef, static: true })
  availableDictionariesModalContent!: TemplateRef<HTMLElement>;

  ngOnInit(): void {
    this.selectedDictionaryProvider
      .selectedDictionary$
      .subscribe(this.onDictionarySelected.bind(this));
  }

  private onDictionarySelected(): void {
    this.showModal$.next(null);
  }
}
