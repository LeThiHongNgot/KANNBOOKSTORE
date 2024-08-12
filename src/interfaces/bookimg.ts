export interface bookimg
{
    bookId: string,
    image0: string,
    image1: string,
    image2: string,
    image3: string,
    book: null
}

export interface VnPayInputData {
  vnp_Version: string;
  vnp_TmnCode: string;
  vnp_Amount: string;
  vnp_Command: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_IpAddr: string;
  vnp_Locale: any;
  vnp_OrderInfo: any;
  vnp_OrderType: any;
  vnp_ExpireDate: string;
  vnp_Bill_Mobile: string;
  vnp_Bill_Email: string;
  vnp_Bill_FirstName: string;
  vnp_Bill_LastName: string;
  vnp_Bill_Address: string;
  vnp_Bill_City: string;
  vnp_Bill_Country: string;
  vnp_Bill_State?: string;
  vnp_Inv_Phone: string;
  vnp_Inv_Email: string;
  vnp_Inv_Customer: string;
  vnp_Inv_Address: string;
  vnp_Inv_Company: string;
  vnp_Inv_Taxcode: string;
  vnp_Inv_Type: string;
  vnp_BankCode?: string;
  vnp_ReturnUrl: string;
  vnp_TxnRef: string; // Thêm thuộc tính này
}

