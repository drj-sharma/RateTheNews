import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourArticlesComponent } from './your-articles.component';

describe('YourArticlesComponent', () => {
  let component: YourArticlesComponent;
  let fixture: ComponentFixture<YourArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
