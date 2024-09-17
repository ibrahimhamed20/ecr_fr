import { Classification } from "./products.interface";

export interface VariantsResponse {
  data: {
    result: any[];
    rowCount: number;
    pageSize: number;
    pageCount: number;
  };
}

export interface VariantsData {
  id: number
  arabicName: string;
  englishName: string;
  classificationIds: number[];
  variantValues: Variants[];
}
export interface Variants {
  id: number;
  arabicName: string;
  englishName: string;
  name: string;
}
export interface VariantParam {
  PageNumber: number;
  PageSize: number;
  name: string;
  classification?: Classification | null;
}
