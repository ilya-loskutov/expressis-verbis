import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';

import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBarComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
