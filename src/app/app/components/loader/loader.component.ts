import { Component, OnInit, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SHOW_PRELOADER } from 'src/app/shared/services/positioned-windows/show-preloader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(
    @Inject(SHOW_PRELOADER) public showPreloader$: BehaviorSubject<boolean>
  ) { }

  ngOnInit(): void {
  }
}
