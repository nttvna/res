import { ReportRange, ReportType } from "../const"

export interface CategoryTypeItem {
    Id: number,
    Name: string,
    IsActive: boolean,
    Rate: number,
    CanDelete: boolean,
}
export interface UpdateCategoryTypeItem {
    Id: number,
    Name: string,
    Rate: number,
    IsActive: boolean
}
export interface CategoryTypeParam {
    Id: number,
    Name: string,
    RateText: string,
    IsActive: boolean,
    modalVisible: boolean
}

export interface CategoryReportItem {
    Id: number,
    Name: string,
    IsActive: boolean,
    SortIndex: number,
    CanDelete: boolean,
    TypeCategories: number,
    TaxType: string,
    ImageUrl: string,
}

export interface reportRouteParam {
    repType: ReportType,
    rangeType: ReportRange,
    random: number
}