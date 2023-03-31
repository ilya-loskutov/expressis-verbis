import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { EntryComponent } from '../components/entry/entry.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateEntryGuard implements CanDeactivate<EntryComponent> {
  canDeactivate(
    component: EntryComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !component.isEntryChanged ||
      confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }

}
