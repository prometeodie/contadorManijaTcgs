import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TokenIconsDisplayComponent } from './token-icons-display.component';

describe('TokenIconsDisplayComponent', () => {
  let component: TokenIconsDisplayComponent;
  let fixture: ComponentFixture<TokenIconsDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TokenIconsDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenIconsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
