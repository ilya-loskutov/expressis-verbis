import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDescriptionComponent } from './entry-description.component';

describe('EntryDescriptionComponent', () => {
  let component: EntryDescriptionComponent;
  let fixture: ComponentFixture<EntryDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
