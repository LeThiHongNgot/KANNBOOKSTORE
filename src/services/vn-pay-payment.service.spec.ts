import { TestBed } from '@angular/core/testing';

import { VnPayPaymentService } from './vn-pay-payment.service';

describe('VnPayPaymentService', () => {
  let service: VnPayPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VnPayPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
