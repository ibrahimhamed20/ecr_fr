export interface TagsParam {
    number?: number;
    size: number;
  }

  export interface TagsResponse {
    data: {
      pageNumber: number;
      pageCount: number;
      pageSize: number;
      rowCount: number;
      result: TagsData[];
    };
  }

  export interface TagsData {
    id?: number | string;
    arabicName?: string;
    englishName?: string;
    classificationIds?: number[];
    tagTypeId?: any;
    classifications?: Classification[];
    classificationModels: any[];
  }

  export interface Classification {
    id: number;
    name: string;
    arabicName: string;
    englishName: string;
  }
  export interface tagParam {
    number?: number;
    size: number;
  }