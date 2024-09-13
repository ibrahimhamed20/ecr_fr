export interface ClassificationsData {
    icon: any;
    id: number;
    arabicName: string;
    englishName: string;
    serviceType: number;
}
export interface ClassificationsParam {
    number?: number;
    size: number;
}

export interface ClassificationServiceType {
    label: string;
    value: number;
}