import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionaryOptionsComponent } from '../dictionary/components/dictionary-options/dictionary-options.component';
//import { EntryComponent } from '../entry/components/entry/entry.component';
import { TemporaryEntryComponent } from '../entry/components/temporary-entry/temporary-entry.component';
import { EntryListComponent } from '../entry/components/entry-list/entry-list.component';
import { navigationPaths } from '../shared/config/navigation-paths/navigation-paths';
import { SelectedDictionaryGuard } from './services/selected-dictionary.guard';
import { EntryResolver } from '../entry/services/entry.resolver';
import { CanDeactivateEntryGuard } from '../entry/services/can-deactivate-entry.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: navigationPaths.availableDictionaries,
    pathMatch: 'full'
  },
  {
    path: navigationPaths.newDictionary,
    redirectTo: navigationPaths.availableDictionaries
  },
  {
    path: navigationPaths.availableDictionaries,
    component: DictionaryOptionsComponent
  },
  {
    path: navigationPaths.newEntry,
    component: /* EntryComponent */ TemporaryEntryComponent,
    canActivate: [SelectedDictionaryGuard],
    resolve: { entry: EntryResolver },
    canDeactivate: [CanDeactivateEntryGuard]
  },
  {
    path: navigationPaths.entry,
    component: /* EntryComponent */ TemporaryEntryComponent,
    canActivate: [SelectedDictionaryGuard],
    resolve: { entry: EntryResolver },
    canDeactivate: [CanDeactivateEntryGuard]
  },
  {
    path: navigationPaths.entryList,
    component: EntryListComponent,
    canActivate: [SelectedDictionaryGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
