import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bookimg } from '../../../interfaces/bookimg';
import { Author } from '../../../interfaces/Author';
import { Category } from '../../../interfaces/Category';
import { BookDetail } from '../../../interfaces/bookdetail';
import { Supplier } from '../../../interfaces/Supplier';
import { Router } from '@angular/router';
import { BooksService } from 'src/services/Books/books.service';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CartsService } from 'src/services/Carts/carts.service';
import { CustomerService } from 'src/services/customer/customer.service';
import {BookDetailsViewModel} from 'src/interfaces/fullbook';
import { ProductViewService } from 'src/services/ProductView/product-view.service';
import { ProductReviewBookid } from 'src/interfaces/ProductView';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/app/environments/environment';
@Component({ selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ NgbModalConfig, NgbModal,NgbRatingConfig, NgbTypeaheadModule, FormsModule, JsonPipe, NgbRatingModule ]
})
export class ProductComponent implements OnInit {
  pageSize =  10;
  page = 1;
  // model:any
  product:  | null = null;
  currentUrl: string='';
  productful: BookDetailsViewModel| null = null;
  productSameCategoryID: any[] = [];
  imgID: bookimg | null = null;
  author:Author[]  = [];
  Category:Category[]=[];
  Suplier:Supplier[]=[];
  book: any[] = [];
  imgbook:bookimg[]=[]
  selectedImage: string='' // Variable to store the selected image
  addproductID:string=''
  idcustomer:string='';
  idCategory:string='';
  loadedBooksCount: number = 0;
  bookdetail:BookDetail[]=[];
  productViewinterface:ProductReviewBookid[]=[];
  ratingStatistical: any[] = [];
  averageRating: number=0;
  averageRating1: number=0;
  totalVotes:number=0;
  commemtrating: { rating?: number, comment?: string } = {};
  quantity: { [key: string]: number} = {};
  checkedProductIds: string[] = [];
  productsPrice: { [id: string]: number} = {};
  quantityfirst:number=1;
  maxquantity: number = 0;
  productId: string | null = null;
  productName:string| null=null;
  constructor(
    private route: ActivatedRoute,
    public router: Router, private books: BooksService,
    private cartsService:CartsService,
    private customer: CustomerService,
    private productView:ProductViewService,
    private meta: Meta,
    private title: Title,
    //rating-comment
    config: NgbModalConfig,
		private modalService: NgbModal,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;

    }

    //modal-rating
   open(content:any)
    {
      this.idcustomer=this.customer.getClaimValue();
      // Lấy token từ Local Storage
      const token = localStorage.getItem('access_token');
  // Kiểm tra xem token có tồn tại không
    if (token) {
    // Bạn có thể sử dụng giá trị token ở đây
    this.modalService.open(content);
  }else
  {
    alert("Vui lòng đăng nhập để bình luận")
  }
    }
  // Method to change the selected image
  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
  ngOnInit(): void {
    // this.updateMetaTags();
    this.currentUrl = location.href;
    this.route.paramMap.subscribe(params => {
      const combinedParam = params.get('combinedParam');
      if (combinedParam) {
        const lastDashIndex = combinedParam.lastIndexOf('-');
        this.productId = combinedParam.substring(lastDashIndex + 1);
        this.productName = combinedParam.substring(0, lastDashIndex);
        // Sử dụng productId để tải thông tin sản phẩm
        if (this.productId) {
          this.getproductid()
          this.quantity = {};
          this.checkedProductIds = [];
          this.selectedImage='';
          this.productsPrice={}
        }
      }
    });
  }
  // addMetaTags() {
  //   if (this.productful) {
  //   this.meta.addTag({ property: 'og:title', content: this.productful.title });
  //   this.meta.addTag({ property: 'og:image', content: this.productful.image0 });
  //   this.meta.addTag({ property: 'og:description', content: this.currentUrl });
  //   this.meta.addTag({ property: 'og:url', content: this.currentUrl });
  //   }
  // }

 updateMetaTags(): void {
    if (this.productful) {
      this.title.setTitle(this.productful.title);
      this.meta.updateTag({ property: 'og:title', content: this.productful.title });
      this.meta.updateTag({ property: 'og:image', content: this.productful.image0 });
      this.meta.updateTag({ property: 'og:url', content: this.currentUrl});
      this.meta.updateTag({ property: 'og:description', content: this.productful.description   });
      this.meta.updateTag({ name: 'keywords', content:environment.keywords });
      this.meta.updateTag({ name: 'description', content: `Thông tin chi tiết về sách: ${this.productful.title}, tác giả ${this.productful.authorName}. Đọc nhận xét, đánh giá từ người đọc và mua sách với giá ưu đãi.`
      });
      console.log(this.meta.getTag('property="og:title"'));
      console.log(this.meta.getTag('property="og:image"'));
      console.log(this.meta.getTag('property="og:url"'));
    }
  }
getproductid()
{
    if (this.productId) {
        this.books.getBookDetailsWithImagesid(this.productId).subscribe({
          next:(res)=>
          {
            this.productful = res;
            this.idCategory = res.catergoryID;
            this.productsPrice[res.bookId]=(1-res.pricePercent)*res.unitPrice;
            this.maxquantity = res.quantity ?? 0;
            this.averageRating=res.averageRating
            this.checkedProductIds.push(res.bookId);
            this.updateMetaTags();
            if( this.idCategory){
            this.sameCategory(1);
            this.onPageChange(this.page);
            }
            this.getRatingStatistical()
            this.getProductView();
          },
          error:(err)=>
          {
            console.error('lỗi', err);
          }
        })
    }
}
getRatingStatistical()
{
  if(this.productId)
  {
    this.productView.getProductReviewRatingBookId(this.productId).subscribe({
      next: (response) => {
        this.ratingStatistical=response
        this.totalVotes = this.calculateTotalVotesRatingAcount(this.ratingStatistical);
      },
      error: (error: any) => {
        console.error('', error);
      }
    });
  }
}
sameCategory(page: number) {
  this.books.getBookdetailsByCategory(this.idCategory, page, this.pageSize)
    .subscribe({
      next: (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.productSameCategoryID = response.data;
          this.loadedBooksCount = response.totalCount;
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error: any) => {
        console.error('Error loading books by category:', error);
      }
    });
}


addCart()
{
  this.idcustomer=this.customer.getClaimValue();
  const dataCart={
    id: this.productId+this.idcustomer,
    bookId:this.productId ,
    customerId: this.idcustomer,
  }
    this.cartsService.addCarts(dataCart).subscribe({
      next: (res: any[]) => {
       alert('Thêm vào giỏ hàng thành công');
       this.getproductid()
      },
      error: (err) => {
        alert('Sản phẩm đã được thêm vào giỏ hàng')
      },
    });
}
getProductView()
{
  if(this.productId)
  {
    this.productView.getProductReviewByBookId(this.productId).subscribe({
      next: (response) => {
        this.productViewinterface=response
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
      }
    });
  }
}

portratingcommen()
{
  this.idcustomer=this.customer.getClaimValue();
  const dataProductView=
  {
    id:this.productId+ this.idcustomer,
    customerId: this.idcustomer,
    bookId: this.productId,
    rating: this.commemtrating.rating || 5, // Provide a default value if rating is undefined
    comment: this.commemtrating.comment || '',
    ngayCommemt: new Date(),

  }
  this.productView.addProductReview(dataProductView).subscribe({
    next: (res) => {
      this.getProductView()
      if(this.productId)
      {

      }
      this.getRatingStatistical();
      this.sameCategory(1)
     alert('Bình luận thành công');
    },
    error: (err) => {
      alert('Bạn đã đánh giá sản phẩm này')
    },
  });
}
//-------------------------------thay đôi số page khi chuyển trang
onPageChange(newPage: number): void {
  this.page = newPage;
  if(this.page){
  this.sameCategory(this.page);}
}

percent1(price: number, per: number): number { return price *(1- per) ;}

percent2(per:number){ return '-'+per*100+'%'; }

navigateToProduct(productId: string, productName: string) {
  const sanitizedProductName = productName.replace(/\s+/g, '-');
  const combined = `${sanitizedProductName}-${productId}`;
  this.router.navigate(['product', combined]);



}
updateQuantity(bookId: string,  newQuantity: number | undefined): void {
    this.quantity[bookId] = parseInt(newQuantity?.toString() ?? '0', 10);
}
calculateTotalVotesRatingAcount(ratingStatistical: any[]): number {
    return ratingStatistical.reduce((total, item) => total + item.count, 0);
}
onRatingChange(selectedRating: number) {
    this.commemtrating.rating=selectedRating
}
payment() {
  if (this.productId) {
    // Nếu chưa có số lượng, gán giá trị mặc định
    if (this.quantity[this.productId] == null) {
      this.quantity[this.productId] = this.quantityfirst ?? 0;
    }

    // Tạo một khóa duy nhất (ví dụ sử dụng thời gian hiện tại)
    const uniqueKey = `payment_${new Date().getTime()}`;

    // Lưu trữ dữ liệu vào sessionStorage
    sessionStorage.setItem(`${uniqueKey}_checkedProductIds`, JSON.stringify(this.checkedProductIds));
    sessionStorage.setItem(`${uniqueKey}_productsPrice`, JSON.stringify(this.productsPrice));
    sessionStorage.setItem(`${uniqueKey}_quantity`, JSON.stringify(this.quantity));

    // Điều hướng với khóa duy nhất trong queryParams
    if (this.quantity[this.productId] != 0) {
      this.router.navigate(['payment'], {
        queryParams: { sessionKey: uniqueKey }
      });
    } else {
      alert('Vui lòng chọn số lượng');
    }
  }
}


}

