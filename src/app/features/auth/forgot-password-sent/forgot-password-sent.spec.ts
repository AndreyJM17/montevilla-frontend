import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSent } from './forgot-password-sent';

describe('ForgotPasswordSent', () => {
  let component: ForgotPasswordSent;
  let fixture: ComponentFixture<ForgotPasswordSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordSent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordSent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
