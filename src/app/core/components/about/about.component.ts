import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ButtonState } from 'src/app/shared/config/components/button';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  ButtonState = ButtonState;

  @Output() close = new EventEmitter<void>();

  onOkClick(): void {
    this.close.emit();
  }

  isNotOkButtonHidden: boolean = false;

  ngOnInit(): void {
  }
}
