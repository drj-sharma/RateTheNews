import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourRatingsComponent } from './your-ratings.component';

describe('YourRatingsComponent', () => {
  let component: YourRatingsComponent;
  let fixture: ComponentFixture<YourRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
