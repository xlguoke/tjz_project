import type { AxiosResponse } from 'axios'

export interface Pages<T> {
  rows: T[]
  count: number
}

interface Opt<T> {
  /** 获取数据列表的方法 */
  dataApi: () => Promise<AxiosResponse<Pages<T>>>
  /** 数据处理 */
  responseDataTransform?: (data: Pages<T>) => Pages<T>
}

export function useDatas<T>(opt: Opt<T>) {
  const dataSource: Ref<T[]> = ref([])
  const total = ref(1) // 初始值不设为0，才会显示加载中，并自动加载数据
  const loading = ref(false)
  const selectedRows = ref<T[]>([])
  const size = 20
  const page = ref(0)

  /**
   * ## 刷新数据
   */
  function onRefresh() {
    selectedRows.value = []
    dataSource.value = []
    page.value = 0
    total.value = 0
    onLoad()
  }

  /**
   * ## 加载数据
   */
  async function onLoad() {
    loading.value = true
    page.value++
    try {
      let { data } = await opt.dataApi()
      if (opt.responseDataTransform) {
        data = opt.responseDataTransform(data)
      }
      dataSource.value.push(...data.rows)
      total.value = data.count
    }
    catch (err) {
      // 总数设为0，否则会死循环一直请求数据
      total.value = 0
      console.error(err)
    }
    loading.value = false
  }

  /**
   * ## 修改选中项
   */
  function onChange(rows: any) {
    selectedRows.value = rows
  }

  return {
    page,
    size,
    dataSource,
    total,
    loading,
    selectedRows,
    onLoad,
    onRefresh,
    onChange,
  }
}
