import { Component, OnInit, Inject } from '@angular/core';

import { faCheck, faBomb } from '@fortawesome/free-solid-svg-icons';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons'
import { BehaviorSubject } from 'rxjs';

import { AlertConfigurations, AlertState } from 'src/app/shared/config/components/alert';
import { SHOW_ALERT } from 'src/app/shared/services/positioned-windows/show-alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  faCheck = faCheck;
  faXmarkCircle = faXmarkCircle;
  faBomb = faBomb;

  AlertState = AlertState;

  constructor(
    @Inject(SHOW_ALERT) public showAlert$: BehaviorSubject<AlertConfigurations | null>
  ) { }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.showAlert$.next(null);
  }
}
