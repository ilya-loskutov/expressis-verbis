import { Component, OnInit, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AppPrerequisitesChecker } from '../../services/app-prerequisites-checker';
import { AppPrerequisitesCheckingError } from '../../models/app-prerequisites-checking/app-prerequisites-checking-error';
import { SHOW_PRELOADER } from '../../../shared/services/positioned-windows/show-preloader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private appPrerequisitesChecker: AppPrerequisitesChecker,
    @Inject(SHOW_PRELOADER) private showPreloader$: BehaviorSubject<boolean>,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.runAppPrerequisitesChecking();
    this.showPreloader$.next(false);
  }

  async runAppPrerequisitesChecking(): Promise<void> {
    try {
      await this.appPrerequisitesChecker.run();
    }
    catch (error) {
      if (error instanceof AppPrerequisitesCheckingError) {
        this.appPrerequisitesCheckingError = error;
      }
      else {
        throw error;
      }
    }
  }

  appPrerequisitesCheckingError: AppPrerequisitesCheckingError | null = null;

  get showCoreModule(): boolean {
    return this.appPrerequisitesChecker.isCheckingFulfilled &&
      this.appPrerequisitesCheckingError === null
  }
}