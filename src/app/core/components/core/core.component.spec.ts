import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';

import { DictionaryService } from '../../../dictionary/services/dictionary.service';
import { Dictionary } from 'src/app/dictionary/models/dictionary';
import { HeaderComponent } from '../header/header.component';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { MainComponent } from '../main/main.component';
import { FooterComponent } from '../footer/footer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';

import { CoreComponent } from './core.component';

describe('CoreComponent', () => {
  let dictionaryService: DictionaryService;
  let router: Router;
  let showPreloader$: Subject<boolean>;

  const activatedRoute = {
    get firstChild() {
      return {
        get snapshot() {
          return {
            get url() {
              return [{ path: navigationPaths.availableDictionaries }]
            }
          }
        }
      }
    }
  }

  let fixture: ComponentFixture<CoreComponent>;
  let component: CoreComponent;

  beforeEach(async () => {
    const dictionaryServiceSpy = jasmine.createSpyObj(
      'DictionaryService',
      ['selectedDictionary$', 'availableDictionaries$'],
      {
        selectedDictionary$: new Subject<Dictionary>(),
        availableDictionaries$: new Subject<Dictionary[]>()
      }
    );
    const showPreloader$Spy = new Subject<boolean>();

    await TestBed.configureTestingModule({
      declarations: [
        CoreComponent,
        HeaderComponent,
        StatusBarComponent,
        MainComponent,
        FooterComponent
      ],
      imports: [
        RouterModule.forRoot([]),
        SharedModule
      ],
      providers: [
        { provide: DictionaryService, useValue: dictionaryServiceSpy },
        { provide: Subject<boolean>, useValue: showPreloader$Spy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    dictionaryService = TestBed.inject(DictionaryService);
    router = TestBed.inject(Router);
    showPreloader$ = TestBed.inject(Subject<boolean>);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
