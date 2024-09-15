export interface variantsResponse {
  data: {
    result: any[];
    rowCount: number;
    pageSize: number;
    pageCount: number;
  };
}

export interface variantsData {
  id: number
  arabicName: string;
  englishName: string;
  classificationIds: number[];
  variantValues: variants[];
}
export interface variants {
  id: number;
  arabicName: string;
  englishName: string;
  name: string;
}
export interface variantParam {
  number: number;
  size: number;
  keyword :string
}
