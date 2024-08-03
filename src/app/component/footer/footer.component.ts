import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMapModalVisible = false;

  /**
   *
   */
  constructor(@Inject(DOCUMENT) private readonly document: Document) {

  }
  openMapModal() {
    this.isMapModalVisible = true;
  }

  closeMapModal() {
    this.isMapModalVisible = false;
  }
  ngOnInit(): void {
    const script = this.document.createElement('script');
    script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      (function () {
        // Khai báo kiểu cho fnames và ftypes
        (window as any).fnames = new Array();
        (window as any).ftypes = new Array();
        (window as any).fnames[0] = 'EMAIL';
        (window as any).ftypes[0] = 'email';

      });
    };

    document.body.appendChild(script);
  }
}
