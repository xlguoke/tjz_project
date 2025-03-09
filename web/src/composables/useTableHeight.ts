/**
 * 获取表格高度
 * @param isPagination 是否显示分页
 */
export default function useTableHeight(isPagination?: boolean) {
  /**
   * 初始化表格高度
   */
  const tableBoxRef = ref<HTMLElement>()
  const tableHeight = ref(300)
  const tabHeadH = 55 // 表头高度
  const paginationH = 48 // 分页高度
  const pagination = isPagination === undefined ? true : isPagination
  watchEffect(() => {
    if (!tableBoxRef.value)
      return
    const h = tableBoxRef.value.clientHeight
    if (!h)
      return
    tableHeight.value = h - tabHeadH - (pagination ? paginationH : 0)
  })

  return {
    tableBoxRef,
    tableHeight,
  }
}
