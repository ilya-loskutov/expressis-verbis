import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

import { PanelState } from '../../config/components/panel';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: [
    '../../../../styles/make-root-block.scss',
    './panel.component.scss'
  ]
})
export class PanelComponent implements OnInit {
  @Input() state: PanelState = PanelState.default;
  @Input() indentBelowTitle: boolean = true;

  @ViewChild('title') private titleElement!: ElementRef;
  isTitleProvided: boolean = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.checkWhetherTitleIsProvided();
  }

  private checkWhetherTitleIsProvided(): void {
    if (!this.titleElement.nativeElement.innerHTML) {
      this.isTitleProvided = false;
      this.changeDetectorRef.detectChanges();
    }
  }
}
