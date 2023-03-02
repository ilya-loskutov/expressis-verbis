import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

import { AvailableDictionariesComponent } from './components/available-dictionaries/available-dictionaries.component';
import { NewDictionaryComponent } from './components/new-dictionary/new-dictionary.component';
import { SelectedDictionaryComponent } from './components/selected-dictionary/selected-dictionary.component';
import { DictionaryOptionsComponent } from './components/dictionary-options/dictionary-options.component';

@NgModule({
  declarations: [
    AvailableDictionariesComponent,
    NewDictionaryComponent,
    SelectedDictionaryComponent,
    DictionaryOptionsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    SelectedDictionaryComponent
  ],
})
export class DictionaryModule { }
