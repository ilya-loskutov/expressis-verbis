import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { DictionaryModule } from '../dictionary/dictionary.module';
/* 
Dunno why we need to import this module here but in the lack of it we will get 
a compile-time error
(unanswered) https://stackoverflow.com/questions/71525743/
*/
import { EntryModule } from '../entry/entry.module';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components//header/header.component';
import { MainComponent } from './components//main/main.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { CoreComponent } from './components/core/core.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MainComponent,
    StatusBarComponent,
    CoreComponent,
    NavigationComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DictionaryModule
  ],
  exports: [
    CoreComponent
  ]
})
export class CoreModule { }
