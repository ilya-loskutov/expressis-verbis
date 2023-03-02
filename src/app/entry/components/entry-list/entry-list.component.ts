import { Component, OnDestroy, OnInit, Inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';

import { EntryService } from '../../services/entry.service';
import { EntryPageList } from '../../models/entry-page-list';
import { Dictionary } from 'src/app/dictionary/models/dictionary';
import { SelectedDictionaryProvider, SELECTED_DICTIONARY_PROVIDER } from 'src/app/dictionary/services/selected-dictionary-provider';
import { ButtonState } from 'src/app/shared/config/components/button';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';
import { assert } from 'src/app/shared/utils/assert/assert';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit, OnDestroy {

  faCircleChevronLeft = faCircleChevronLeft;
  faCircleChevronRight = faCircleChevronRight;

  ButtonState = ButtonState;

  newEntryPath = navigationPaths.newEntry;

  constructor(
    @Inject(SELECTED_DICTIONARY_PROVIDER) private selectedDictionaryProvider: SelectedDictionaryProvider,
    private entryService: EntryService
  ) { }

  ngOnInit(): void {
    this.selectedDictionarySubsciption = this.selectedDictionaryProvider
      .selectedDictionary$
      .subscribe(this.onDictionarySelected.bind(this));
  }

  private selectedDictionarySubsciption!: Subscription;

  private async onDictionarySelected(selectedDictionary: Dictionary): Promise<void> {
    this.entryPageList = this.entryService.getEntryPageList(selectedDictionary.id, this.pageSize);
    await this.entryPageList.moveToNextPage();
  }

  private readonly pageSize = 12;
  entryPageList: EntryPageList | undefined;

  async onMoveToPreviousPageClick(): Promise<void> {
    assert(this.entryPageList !== undefined, 'entryPageList is undefined');

    window.scrollTo(0, 0);
    await this.entryPageList!.moveToPreviousPage();
  }

  async onMoveToNextPageClick(): Promise<void> {
    assert(this.entryPageList !== undefined, 'entryPageList is undefined');

    window.scrollTo(0, 0);
    await this.entryPageList!.moveToNextPage();
  }

  ngOnDestroy(): void {
    this.selectedDictionarySubsciption.unsubscribe();
  }
}
