import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDictionaryComponent } from './selected-dictionary.component';

describe('SelectedDictionaryComponent', () => {
  let component: SelectedDictionaryComponent;
  let fixture: ComponentFixture<SelectedDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDictionaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
