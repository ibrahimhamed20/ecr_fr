export interface StoreInterface {
    id: number,
    merchantName: string,
    registerTo: string,
    countryIsoCode: string,
    subscribtionType: string,
    domainStatus: string,
    classificationName: {
        id: number,
        name: string,
        icon: any
    },
    merchantTypeName: {
        id: number,
        type: string,
        name: string
    },
    user: {
        id: string,
        userName: string,
        mobileNumber: string,
        registerDate: string
    },
    merchantSubscriptionPlan: any,
    [_key: string]: any
}

export interface StorePagingInteface {
    pageNumber: number,
    pageCount: number,
    pageSize: number,
    rowCount: number,
    result: StoreInterface[]
}
