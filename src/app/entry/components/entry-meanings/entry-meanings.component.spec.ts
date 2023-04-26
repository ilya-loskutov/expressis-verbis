import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMeaningsComponent } from './entry-meanings.component';

describe('EntryMeaningsComponent', () => {
  let component: EntryMeaningsComponent;
  let fixture: ComponentFixture<EntryMeaningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryMeaningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryMeaningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
