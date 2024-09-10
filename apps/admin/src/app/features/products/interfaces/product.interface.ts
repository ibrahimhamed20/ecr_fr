export interface ProductPagingInteface {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  result: productInterface[];
}

export interface productInterface {}

export interface ProductParams {
  pageNumber: number;
  pageSize: number;
  ClassificationId?: number;
  Keyword?: string;
  BrandId?: number;
  CategoryId?: number;
}
export interface MerchantProductParams {
  pageNumber: number;
  pageSize: number;
  Status?: string;
}

export interface Classification {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}
export interface merchantProduct {
  id: number;
  name: string;
  price: number;
  cost: number;
}
export interface  prodcut{
  id:number ;
  name :string;
  barcode :string;
}