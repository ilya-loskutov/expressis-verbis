import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextInputComponent } from './components/text-input/text-input.component';
import { ButtonComponent } from './components/button/button.component';
import { PanelComponent } from './components/panel/panel.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TextInputComponent,
    ButtonComponent,
    PanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TextInputComponent,
    ButtonComponent,
    PanelComponent,
  ]
})
export class SharedModule { }
