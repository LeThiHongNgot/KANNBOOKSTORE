import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { HttpClient , HttpParams,} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {}
  private apiUrl = 'https://api.zerobounce.net/v2/validate'; // URL API của ZeroBounce
  private apiKey = '0d0981ba02824535a6287fba47adec46';

  sendOTP(phoneNumber: string): Promise<any> {
    return this.afAuth.signInWithPhoneNumber(phoneNumber, new firebase.auth.RecaptchaVerifier('phone'));
  }

  verifyOTP(verificationId: string, code: string): Promise<any> {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    return this.afAuth.signInWithCredential(credential);
  }

 createPayment(paymentRequest: any): Observable<any> {
    return this.http.post<any>(`https://localhost:7009/api/VNPay/create-payment`, paymentRequest);
  }

  validateEmail(email: string):Observable<Object> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('email', email);

    return this.http.get(this.apiUrl, { params })
  }
}
