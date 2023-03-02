import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { DictionaryService } from '../../services/dictionary.service';
import { SharedModule } from '../../../shared/shared.module';

import { NewDictionaryComponent } from './new-dictionary.component';

describe('NewDictionaryComponent', () => {
  let formBuilder: FormBuilder;
  let dictionaryService: DictionaryService;

  let component: NewDictionaryComponent;
  let fixture: ComponentFixture<NewDictionaryComponent>;

  beforeEach(async () => {
    const dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['createDictionary']);

    await TestBed.configureTestingModule({
      declarations: [NewDictionaryComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryServiceSpy }
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    formBuilder = TestBed.inject(FormBuilder);
    dictionaryService = TestBed.inject(DictionaryService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
