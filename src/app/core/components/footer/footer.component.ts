import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SHOW_MODAL } from 'src/app/shared/services/positioned-windows/show-modal';
import { ModalConfigurations } from 'src/app/shared/config/components/modal';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    @Inject(SHOW_MODAL) private showModal$: BehaviorSubject<ModalConfigurations | null>
  ) {
  }

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
