import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSideNavbarComponent } from './side-navbar.component';

describe('AdditionNavbarComponent', () => {
  let component: CustomerSideNavbarComponent;
  let fixture: ComponentFixture<CustomerSideNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSideNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
