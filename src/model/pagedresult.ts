export class PagedResult<T> {
  data: {[key: string]: T} = {};
  order: string[] = [];
  total: number = 0;
  page: number = 0;
  page_size: number = 0;
}
