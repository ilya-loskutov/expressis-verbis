import { NgModule } from '@angular/core';
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
    FontAwesomeModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
