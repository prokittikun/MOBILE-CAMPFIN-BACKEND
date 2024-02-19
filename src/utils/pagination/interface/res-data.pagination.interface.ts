/* eslint-disable prettier/prettier */
export interface ResDataCommon<T> {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  option: ResDataCommonOption;
  datas: T[];
}
export interface ResDataCommonOption {
  sortFide: string;
  sortType: string;
  search: string;
}
