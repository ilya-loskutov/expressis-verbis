import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryEntryComponent } from './temporary-entry.component';

describe('TemporaryEntryComponent', () => {
  let component: TemporaryEntryComponent;
  let fixture: ComponentFixture<TemporaryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporaryEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
