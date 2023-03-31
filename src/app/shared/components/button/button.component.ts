import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ButtonState } from '../../config/components/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() state: ButtonState = ButtonState.default;
  @Input() type: 'button' | 'reset' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'medium' = 'medium';

  @Output() click = new EventEmitter<void>();

  onClick(event: Event): void {
    event.stopPropagation();
    this.click.emit();
  }

  constructor() { }

  ngOnInit(): void {
  }
}
