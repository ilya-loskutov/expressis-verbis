import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextInputState } from '../../config/components/text-input';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: [
    '../../../../styles/make-root-block.scss',
    './text-input.component.scss'
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TextInputComponent,
    multi: true
  }]
})
export class TextInputComponent implements ControlValueAccessor {

  @Input() placeholder: string | null = null;
  @Input() maxlength: number | null = null;
  @Input() disabled: boolean = false;

  @Input() state: TextInputState = TextInputState.default;
  @Input() message: string | null = null;

  @Input() isMultiline: boolean = false;

  /* 
  writeValue() and setDisabledState() for the first time get called before ngAfterViewInit(), so we can't
  make use of the @ViewChild('control') to get an immediate access to the underlying input at this moment.
  Therefore, we use the [(ngModel)]="controlValue" and [disabled]="isControlDisabled" 
  constructions here to rule its state.
  */
  writeValue(value: any): void {
    this.controlValue = value;
  }

  controlValue: string | undefined;

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = (value: string) => {
      this.controlValue = value;
      onChange(value);
    };
  }

  onChange: ((value: string) => void) | undefined;

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = () => {
      if (!this.isControlMarkedAsTouched) {
        this.isControlMarkedAsTouched = true;
        onTouched();
      }
    }
  }

  isControlMarkedAsTouched: boolean = false;

  onTouched: (() => void) | undefined;

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
