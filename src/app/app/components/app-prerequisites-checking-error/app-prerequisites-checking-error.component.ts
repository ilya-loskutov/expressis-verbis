import { Component, OnInit, Input, ViewChild, TemplateRef, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AppPrerequisitesCheckingError } from '../../models/app-prerequisites-checking/app-prerequisites-checking-error';
import { PanelState } from 'src/app/shared/config/components/panel';
import { ButtonState } from 'src/app/shared/config/components/button';
import { SHOW_ALERT } from 'src/app/shared/services/positioned-windows/show-alert';
import { AlertState, AlertConfigurations } from 'src/app/shared/config/components/alert';

@Component({
  selector: 'app-prerequisites-checking-error',
  templateUrl: './app-prerequisites-checking-error.component.html',
  styleUrls: ['./app-prerequisites-checking-error.component.scss']
})
export class AppPrerequisitesCheckingErrorComponent implements OnInit {
  @Input() error!: AppPrerequisitesCheckingError;

  PanelState = PanelState;
  ButtonState = ButtonState;

  constructor(
    @Inject(SHOW_ALERT) private showAlert$: BehaviorSubject<AlertConfigurations | null>
  ) { }

  ngOnInit(): void {
  }

  onAwarenessButtonClick(): void {
    this.showAlert$.next({
      state: AlertState.success,
      message: '+100 karma'
    });
  }
}
