import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TcgIconsSelectorComponent } from './tcg-icons-selector.component';

describe('TcgIconsSelectorComponent', () => {
  let component: TcgIconsSelectorComponent;
  let fixture: ComponentFixture<TcgIconsSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TcgIconsSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TcgIconsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
