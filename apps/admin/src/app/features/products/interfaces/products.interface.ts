export interface ProductInterface {
  id: number,
  name: string,
  shortName: string,
  classification: {
      id: number,
      name: string,
      icon: any
  },
  [_key: string]: any
}

export interface ProductsPagingInteface {
  pageNumber: number,
  pageCount: number,
  pageSize: number,
  rowCount: number,
  result: ProductInterface[]
}
export interface Classification {
  id: number;
  name: string;
  shortName: string | null;
  isDecimal: boolean;
  classification: {
    id: number;
    name: string;
    icon: any;
    shortName?: string | null;  // Adjust to allow null
    isDecimal?: boolean;
  };

}

export interface ClassificationsResponse {
  data: {
    classifications: Classification[]; // Change this to reflect the desired structure
  };
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
}

export interface UnitResponse {
  data: {
    result: ProductInterface[];
  };
}

export interface UnitData {
  id: number | string;
  arabicName: string;
  englishName: string;
  classificationId: number;
  classifications:any[];
  shortArabicName: string;
  shortEnglishName: string;
  isDecimal: boolean;

  classification: {
    id: number;
    name: string;
    icon: any;
  };
}

export interface OriginalEvent {
  isTrusted: boolean;
}

export interface Value {
  id: number;
  name: string;
}

export interface DropdownEvent {
  originalEvent: OriginalEvent;
  value: Value;
}

export interface Category {
  id: number;
  parentId: number | null;
  iconUrl: string;
  name: string;
  subCategories: SubCategory[];
  classification: Classification[];
}

export interface SubCategory {
  id: number;
  parentId: number;
  name: string;
}



export interface ApiResponse<T> {
  data: Data<T>;
  developerMessage: string | null;
  errorMessage: string | null;
  errorCode: string | null;
  validationErrors: any[]; // Keep this as any[] unless you have a specific structure for validation errors
}
// Update the response interface if the result property is present
// Assuming Data<T> is a wrapper that should include UnitData properties
export interface Data<T> {
  data: T;
}
export interface Data<T> {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  result: any[];
}



export interface FileEvent {
  originalEvent: OriginalEvent;
  files: File[]; // Use File[] if `files` is an array of File objects
  currentFiles: File[]; // Use File[] if `currentFiles` is an array of File objects
}
export interface Icon {
  id: number;
  externalStorageId: string;
  mimeType: string;
  has360View: boolean;
  sizeInBytes: number;
  blobUrI?: string; // Optional, can be undefined
}

export interface CategoriesData {
  id: number;
  barcodeNumber: number;
  englishName: string;
  arabicName: string;
  parentId: number | null;  // Can be null if no parent
  icon: Icon | null;  // Can be null if no icon
  classifications: Classification[];
  countries: any[];  // Assuming countries is an array of objects, you can replace `any` with a more specific type if available
}
