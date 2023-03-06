import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AppComponent } from './components/app/app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AppPrerequisitesCheckingErrorComponent } from './components/app-prerequisites-checking-error/app-prerequisites-checking-error.component';
import { AlertComponent } from './components/alert/alert.component';
import { ModalComponent } from './components/modal/modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    AppPrerequisitesCheckingErrorComponent,
    AlertComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    CommonModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
