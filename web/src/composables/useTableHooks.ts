import type { Ref } from 'vue'
import type { FormInstance, TablePaginationConfig } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { TableRowSelection } from 'ant-design-vue/es/table/interface'
import useTableHeight from './useTableHeight'
import useMyFetch from '@/composables/useMyFetch'
import type { Sort, SqlQuery } from '@/composables/useSqlQuery'
import useSqlQuery from '@/composables/useSqlQuery'
import type { PageRes } from '@/types/pagination.d'

interface TableHookConfig<T> {
  // 请求api
  api: string
  // 表单ref
  formRef?: Ref<FormInstance | undefined>
  // 查询参数ref，包含除page、size外的查询参数
  query?: Ref<Record<string, any>>
  /**
   * 查询参数的 sql 匹配方式，默认为模糊查询；
   * $k、$v 为参数占位符，$k表示参数属性，$v表示参数值；
   * 如：query为：{id: '1,2,3', status='1'}，sqlQuery可为：{id: '$k=out=($v)', status: '$k==$v'}
   */
  sqlQuery?: SqlQuery
  // 排序
  sorts?: Ref<Sort> | Sort
  // 扩展的参数
  extendParams?: Ref<Record<string, any>>
  // 是否分页
  isPagination?: boolean
  // 初始化时是否自动加载列表数据
  isInitData?: boolean
  /**
   * 过滤数据
   * 对数据进行自定义处理，返回处理后的数据
   */
  filterData?: (d: T[]) => T[]
}

export function useTableHooks<T>(config: TableHookConfig<T>) {
  // 加载loading
  const loading = ref(false)
  // 初始化时是否加载数据
  const isInitData = config.isInitData === undefined ? true : !!config.isInitData
  // 总条数
  const total = ref(0)
  // 表格数据
  const dataSource = ref([] as T[])
  // 选中行key的集合
  const selectedRowKeys = ref<Key[]>([])
  // 选中行数据集合
  const selectedRows = ref<T[]>([])
  // 初始化查询参数
  const { page, size, isPagination, initQueryParams } = useSqlQuery(config)
  // 初始化表格高度
  const { tableBoxRef, tableHeight } = useTableHeight(isPagination)
  // 扩展的接口参数
  const extendParams = config.extendParams || ref({})

  // 获取列表数据
  async function getList() {
    loading.value = true
    const { data, error } = await useMyFetch<PageRes<T>>(config.api, { params: {
      ...initQueryParams(),
      ...extendParams.value,
    } })
    if (!error.value) {
      let list = data.value?.content || []
      if (config.filterData)
        list = config.filterData(list)
      dataSource.value = list
      total.value = data.value?.page.totalElements || 0
    }
    loading.value = false
  }

  /**
   * # 获取下一页数据
   */
  async function getNextPage() {
    if (page.value * size.value >= total.value) {
      return Promise.resolve({
        noMore: true,
      })
    }
    page.value++
    await getList()
    return Promise.resolve({
      noMore: false,
    })
  }

  /**
   * # 分页改变
   * @param p 页码
   * @param s 展示条数
   */
  function handlePageChange(p: number, s: number) {
    page.value = p
    size.value = s
    getList()
  }

  /**
   * # 查询
   */
  function handleSearch() {
    page.value = 1
    getList()
  }

  /**
   * # 重置
   */
  function handleReset() {
    config.formRef?.value?.resetFields()
    page.value = 1
    getList()
  }

  /**
   *  # 获取分页配置
   * @returns TablePaginationConfig
   */
  function getPagination() {
    if (!isPagination)
      return false
    return {
      total: total.value,
      pageSize: size.value,
      current: page.value,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 条数据`,
      onChange: handlePageChange,
    } as unknown as TablePaginationConfig
  }

  /**
   * # 获取表格行选择配置
   */
  function getRowSelection(mixinConfig?: Omit<TableRowSelection<T>, 'selectedRowKeys' | 'onChange'>) {
    return {
      selectedRowKeys: selectedRowKeys.value,
      preserveSelectedRowKeys: true,
      onChange: (keys: Key[], rows: T[]) => {
        selectedRows.value = rows as any
        selectedRowKeys.value = keys
      },
      ...mixinConfig,
    }
  }

  if (isInitData)
    getList()

  return {
    loading,
    page,
    size,
    total,
    dataSource,
    selectedRows,
    selectedRowKeys,
    tableBoxRef,
    tableHeight,
    getList,
    getNextPage,
    getPagination,
    getRowSelection,
    handleSearch,
    handleReset,
    handlePageChange,
  }
}
