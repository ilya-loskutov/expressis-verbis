import { Component, OnInit, Input, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

import { EntryDescription, LoadingEntry } from '../../models/entry';
import { EntryService } from '../../services/entry.service';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';
import { SHOW_PRELOADER } from 'src/app/shared/services/positioned-windows/show-preloader';
import { SHOW_ALERT } from 'src/app/shared/services/positioned-windows/show-alert';
import { AlertState, AlertConfigurations } from 'src/app/shared/config/components/alert';
import { SHOW_MODAL } from 'src/app/shared/services/positioned-windows/show-modal';
import { ModalConfigurations } from 'src/app/shared/config/components/modal';
import { PanelState } from 'src/app/shared/config/components/panel';
import { ButtonState } from 'src/app/shared/config/components/button';
import { assert } from 'src/app/shared/utils/assert/assert';

@Component({
  selector: 'app-entry-description',
  templateUrl: './entry-description.component.html',
  styleUrls: [
    './entry-description.component.scss',
    '../../../../styles/make-root-block.scss'
  ]
})
export class EntryDescriptionComponent implements OnInit {

  @Input() entry!: EntryDescription;

  faXmarkCircle = faXmarkCircle;

  PanelState = PanelState;
  ButtonState = ButtonState;

  constructor(
    private entryService: EntryService,
    private router: Router,
    @Inject(SHOW_PRELOADER) private showPreloader$: BehaviorSubject<boolean>,
    @Inject(SHOW_ALERT) private showAlert$: BehaviorSubject<AlertConfigurations | null>,
    @Inject(SHOW_MODAL) private showModal$: BehaviorSubject<ModalConfigurations | null>
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.entry instanceof LoadingEntry) {
      this.state.next('loading');
    }
    else {
      this.state.next('default');
    }
  }

  state: BehaviorSubject<'default' | 'loading' | 'deleted'> =
    new BehaviorSubject<'default' | 'loading' | 'deleted'>('loading');

  async onWordsClick(event: MouseEvent): Promise<void> {
    event.preventDefault();
    if (this.state.getValue() === 'default') {
      this.showPreloader$.next(true);
      await this.navigateToEntry();
    }
  }

  private async navigateToEntry(): Promise<void> {
    try {
      await this.router.navigate(
        [navigationPaths.entry],
        {
          queryParams: {
            id: this.entry.id
          }
        }
      );
    }
    catch (err) {
      this.showAlert$.next({
        state: AlertState.error,
        message: "Hmm, We Can't Load This Entry. Probably It Has Been Deleted."
      });
    }
    finally {
      this.showPreloader$.next(false);
    }
  }

  onDeleteEntryClick(): void {
    assert(this.state.getValue() === 'default',
      `The state was expected to be default but was ${this.state.getValue()}`);

    this.showModal$.next({
      isClosable: true,
      content: this.deleteEntryModalContent
    });
  }

  @ViewChild('deleteEntryModalContent', { read: TemplateRef, static: true })
  deleteEntryModalContent!: TemplateRef<HTMLElement>;

  async onDeleteEntryModalYesClick(): Promise<void> {
    assert(this.state.getValue() === 'default',
      `The state was expected to be default but was ${this.state.getValue()}`);

    this.showModal$.next(null);
    this.state.next('deleted');
    await this.entryService.delete(this.entry.id);
  }

  onDeleteEntryModalNoClick(): void {
    assert(this.state.getValue() === 'default',
      `The state was expected to be default but was ${this.state.getValue()}`);

    this.showModal$.next(null);
  }
}
