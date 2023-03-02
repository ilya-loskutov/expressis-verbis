import { Component, OnInit, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ModalConfigurations } from 'src/app/shared/config/components/modal';
import { SHOW_MODAL } from 'src/app/shared/services/positioned-windows/show-modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(
    @Inject(SHOW_MODAL) public showModal$: BehaviorSubject<ModalConfigurations | null>
  ) { }

  ngOnInit(): void {
  }

  onBackdropClick() {
    if (this.showModal$.getValue()!.isClosable) {
      this.showModal$.next(null);
    }
  }
}
