import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryOptionsComponent } from './dictionary-options.component';

describe('DictionaryOptionsComponent', () => {
  let component: DictionaryOptionsComponent;
  let fixture: ComponentFixture<DictionaryOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionaryOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
