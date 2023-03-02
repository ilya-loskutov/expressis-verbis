import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPrerequisitesCheckingError } from '../../models/app-prerequisites-checking/app-prerequisites-checking-error';

import { AppPrerequisitesCheckingErrorComponent } from './app-prerequisites-checking-error.component';

describe('AppPrerequisitesCheckingErrorComponent', () => {
  let component: AppPrerequisitesCheckingErrorComponent;
  let fixture: ComponentFixture<AppPrerequisitesCheckingErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPrerequisitesCheckingErrorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPrerequisitesCheckingErrorComponent);
    component = fixture.componentInstance;
    component.error = jasmine.createSpyObj<AppPrerequisitesCheckingError>(['title']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
