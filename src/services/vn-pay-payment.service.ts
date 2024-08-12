import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class VnPayPaymentService {
  private vnp_TmnCode = "L4E96GNZ"; // Mã website tại VNPAY
  private vnp_HashSecret = "APTL1V3C5W86D86JQHA135BL4QDTV80P"; // Chuỗi bí mật
  private vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  private vnp_ReturnUrl = "https://kannbookstore.onrender.com"; // URL return khi thanh toán xong

  constructor(private http: HttpClient) {}

  createPaymentUrl(order: any) {
    const vnp_TxnRef = order.order_id; // Mã đơn hàng
    const vnp_Amount = order.amount * 100; // Số tiền (VND)

    // Tạo đối tượng dữ liệu đầu vào
    const inputData: any = {
      "vnp_Version": "2.1.0",
      "vnp_TmnCode": this.vnp_TmnCode,
      "vnp_Amount": vnp_Amount.toString(),
      "vnp_Command": "pay",
      "vnp_CreateDate": this.formatDate(new Date()),
      "vnp_CurrCode": "VND",
      "vnp_IpAddr": this.getIpAddress(),
      "vnp_Locale": "vn",
      "vnp_OrderInfo": "Thanh toán đơn hàng",
      "vnp_OrderType": "order",
      "vnp_ReturnUrl": this.vnp_ReturnUrl,
      "vnp_TxnRef": vnp_TxnRef,
      "vnp_ExpireDate": this.getExpireDate()
    };

    // Sắp xếp dữ liệu đầu vào
    const sortedData = this.sortObject(inputData);

    // Tạo chuỗi truy vấn từ dữ liệu đã sắp xếp
    const signData = this.createQueryString(sortedData);

    // Tạo chữ ký bảo mật
    const vnpSecureHash = this.createSecureHash(signData);

    // Tạo URL thanh toán
    const paymentUrl = `${this.vnp_Url}?${signData}&vnp_SecureHash=${vnpSecureHash}`;

    return paymentUrl;
  }

  getIpAddress(): string {
    // Có thể cần thêm logic để lấy IP thật trong một số trường hợp
    return '127.0.0.1';
  }

  formatDate(date: Date): string {
    return date.getFullYear().toString() +
           ('0' + (date.getMonth() + 1)).slice(-2) +
           ('0' + date.getDate()).slice(-2) +
           ('0' + date.getHours()).slice(-2) +
           ('0' + date.getMinutes()).slice(-2) +
           ('0' + date.getSeconds()).slice(-2);
  }

  private sortObject(obj: any): any {
    return Object.keys(obj).sort().reduce((result: any, key: any) => {
      result[key] = obj[key];
      return result;
    }, {});
  }

  private createQueryString(data: any): string {
    return Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  }

  createSecureHash(data: string): string {
    return crypto.HmacSHA512(data, this.vnp_HashSecret).toString();
  }

  private getExpireDate(): string {
    // Tính toán và định dạng ngày hết hạn (vnp_ExpireDate) cho đơn hàng
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30); // Thời hạn 30 phút từ hiện tại
    return this.formatDate(date);
  }
}
