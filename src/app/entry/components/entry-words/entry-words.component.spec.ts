import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryWordsComponent } from './entry-words.component';

describe('EntryWordsComponent', () => {
  let component: EntryWordsComponent;
  let fixture: ComponentFixture<EntryWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryWordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
