import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Observable, BehaviorSubject } from 'rxjs';

import { DictionaryService } from 'src/app/dictionary/services/dictionary.service';
import { Dictionary } from 'src/app/dictionary/models/dictionary';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';
import { SHOW_MODAL } from 'src/app/shared/services/positioned-windows/show-modal';
import { ModalConfigurations } from 'src/app/shared/config/components/modal';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  faBars = faBars;

  navigationPaths = navigationPaths;

  isMenuOpened: boolean = false;

  constructor(
    @Inject(SHOW_MODAL) private showModal$: BehaviorSubject<ModalConfigurations | null>,
    dictionaryService: DictionaryService
  ) {
    this.selectedDictionary$ = dictionaryService.selectedDictionary$;
  }

  selectedDictionary$: Observable<Dictionary>;

  showAboutModal(): void {
    this.showModal$.next({
      isClosable: true,
      content: this.aboutModalContent
    });
  }

  @ViewChild('aboutModalContent', { read: TemplateRef, static: true })
  aboutModalContent!: TemplateRef<HTMLElement>;

  closeAboutModal(): void {
    this.showModal$.next(null);
  }

  ngOnInit(): void {
  }
}
