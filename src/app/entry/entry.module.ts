import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '../shared/shared.module';
import { EntryComponent } from './components/entry/entry.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { EntryDescriptionComponent } from './components/entry-description/entry-description.component';

@NgModule({
  declarations: [
    EntryComponent,
    EntryListComponent,
    EntryDescriptionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class EntryModule { }
