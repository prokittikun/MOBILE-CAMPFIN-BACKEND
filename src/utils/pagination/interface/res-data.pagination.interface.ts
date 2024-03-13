export interface ResDataCommon<T> {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  option: ResDataCommonOption;
  datas: T[];
}
export interface ResDataCommonOption {
  sortField: string;
  sortType: string;
  search: string;
}
