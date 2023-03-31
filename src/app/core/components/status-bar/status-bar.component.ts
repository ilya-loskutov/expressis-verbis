import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs';

import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.theme$ = new BehaviorSubject<string>("Sorry, I'm a little slow on the uptake");
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(() => this.theme$.next(this.matchUpCurrentUrlToTheme()));
  }

  theme$!: BehaviorSubject<string>;

  private matchUpCurrentUrlToTheme(): string {
    const path = this.route.firstChild!.snapshot.url[0]!.path;
    switch (path) {
      case navigationPaths.availableDictionaries:
        return "Select a Dictionary or Create a New One";
      case navigationPaths.entry:
        return "Edit the Entry";
      case navigationPaths.newEntry:
        return "Create a New Dictionary Entry";
      case navigationPaths.entryList:
        return "The Dictionary's Entries";
      default:
        throw new Error(`The path ${path} is not known`);
    }
  }
}
