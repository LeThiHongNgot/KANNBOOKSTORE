import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bookimg } from 'src/interfaces/bookimg';
import { Router } from '@angular/router';
import { Author } from 'src/interfaces/Author';
import { Category } from 'src/interfaces/Category';
import { CustomerService } from 'src/services/customer/customer.service';
import { BookDetailsViewModel } from 'src/interfaces/fullbook'
import { CategoriesService } from 'src/services/Categories/categories.service';
import { BooksService } from 'src/services/Books/books.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  idcustomer: string | null = null;
  product: any = {}
  constructor(private http: HttpClient,
    private router: Router,
    private customer: CustomerService,
    private categoryService: CategoriesService,
    private serviceBook: BooksService) { }
  data: BookDetailsViewModel[] = [];
  bookImage: bookimg[] = [];
  author: Author | null = null;
  filteredProducts: BookDetailsViewModel[] = [];
  categories: Category[] = [];


  ngOnInit() {
    // Make a GET request to fetch book data
    this.categoryService.Categories().subscribe(
      {
        next: response => {
          if (response) {
            this.categories = response;
          }
        },
        error: error => {
          console.error('Lỗi xảy ra khi lấy dữ liệu thể loại', error);
        }
      });

  }

  statusLogin() {
    this.idcustomer = this.customer.getClaimValue();
    // Lấy token từ Local Storage
    const token = localStorage.getItem('access_token');
    // Kiểm tra xem token có tồn tại không
    if (token) {
      // Bạn có thể sử dụng giá trị token ở đây
      console.log('Token:', token);
      this.router.navigate(['user']);
    } else {
      this.isModalVisible = true;
      console.log(this.idcustomer);
    }
  }
  Cart() {
    this.idcustomer = this.customer.getClaimValue();
    // Lấy token từ Local Storage
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['cart']);
    } else {
      alert('Vui lòng đăng nhập để xem giỏ hàng')
    }
  }
  loadpro(name: string): void {
    this.serviceBook.getBookDetailImages().subscribe({
      next: response => {
        if (response) {
          this.data = response;
        }
      },
      error: error => {
        console.error('Lỗi xảy ra khi lấy dữ liệu sách', error);
      }
    });
    if (name) {
      (document.querySelector(".dropdown") as HTMLElement).style.display = 'flex';
      this.filteredProducts = this.data.filter((product) =>
        product.title.toLowerCase().includes(name.toLowerCase())
      ).slice(0, 6);
    }
    else
      (document.querySelector(".dropdown") as HTMLElement).style.display = 'none';
  }
  isModalVisible = false;

  showLogin: boolean = false;

  isMapModalVisible = false;

  openMapModal() {
    this.isMapModalVisible = true;
  }

  closeMapModal() {
    this.isMapModalVisible = false;
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
  navigateToCategory(categoryId: string) {

    this.router.navigate(['category', categoryId]).then(() => {
      location.reload();
    });
  }
  percent1(price: number, per: number): number {
    return price * (1 - per);
  }

}
