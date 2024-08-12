import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.css']
})
export class ProductslistComponent {
  @Input() products: any[] = [];
  @Input() loadedBooksCount: number = 0;
  @Input() page: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(
    private router: Router
  ) { }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.pageChange.emit(this.page);
  }

  navigateToProduct(productId: string, productName: string) {
    // Bảng ánh xạ các ký tự có dấu thành ký tự không dấu
    const accentsMap: { [key: string]: string } = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        // Thêm các ký tự khác nếu cần
    };

    // Chuyển đổi các ký tự có dấu thành ký tự không dấu
    const normalizedProductName = productName
        .toLowerCase() // Chuyển tên sản phẩm thành chữ thường
        .split('') // Chia chuỗi thành mảng ký tự
        .map(char => accentsMap[char] || char) // Thay thế ký tự có dấu
        .join('') // Gộp lại thành chuỗi
        .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt (chỉ giữ lại chữ cái, số, khoảng trắng và dấu gạch ngang)
        .trim() // Xóa khoảng trắng ở đầu và cuối
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-') // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang duy nhất

    const combined = `${normalizedProductName}-${productId}`;
    this.router.navigate(['product', combined]);
}


  percent1(price: number, per: number): number { return price * (1 - per); }

  percent2(per: number) { return '-' + per * 100 + '%'; }

  shouldShowPagination(): boolean {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(this.loadedBooksCount / itemsPerPage);
    return totalPages > 1;
  }
}
