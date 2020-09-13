import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvRatingComponent } from './tv-rating.component';

describe('TvRatingComponent', () => {
  let component: TvRatingComponent;
  let fixture: ComponentFixture<TvRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
