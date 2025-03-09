interface Page {
  // 当前页码，从0开始
  number: number
  // 每页展示条数
  size: number
  // 总页数
  totalPages: number
  // 总条数
  totalElements: number
}

export interface PageRes<T> {
  /**
   * # 分页信息
   */
  page: Page

  /**
   * # 列表
   */
  content: T[]
}
