export interface BrandResponse {
  data: {
    pageNumber: number;
    pageCount: number;
    pageSize: number;
    rowCount: number;
    result: BrandData[];
  };
}

export interface BrandData {
  id: number;
  name: string;
  iconUrl: string;
  classifications?: Classification[];
  classificationModels: any[];
  arabicName: string;
  englishName: string;
  icon: any;
  countryIds: number[];
  classificationIds: number[];
}

export interface Classification {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  icon?: string | null;
}
export interface BrandParam {
  number?: number;
  size: number;
}

export interface ClassificationServiceType {
  label: string;
  value: number;
}

export interface ClassificationBrand {
  id: number;
  arabicName: string;
  englishName: string;
  icon?: string | null;
}
