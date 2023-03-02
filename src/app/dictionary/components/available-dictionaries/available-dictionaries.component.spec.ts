import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableDictionariesComponent } from './available-dictionaries.component';

describe('AvailableDictionariesComponent', () => {
  let component: AvailableDictionariesComponent;
  let fixture: ComponentFixture<AvailableDictionariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableDictionariesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableDictionariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
