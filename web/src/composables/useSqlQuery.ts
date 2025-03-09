import type { Ref } from 'vue'

/**
 * 特殊查询
 * type 查询类型，自行定义： fuzzy-模糊查询
 * fields: 字段列表，如：['name', 'age']
 * 例：sqlQuery={name: {type: 'fuzzy', fields: ['name', 'usename']}}
 *    表示query中name字段中模糊查询包含name、usename的数据
 */
interface CustomQuery {
  type: 'fuzzy'
  fields: string[]
}

/**
 * $k==*$v* 模糊查询：字段$k中包含$v的数据，可不传，默认为该模式
 * $k==*$v 模糊查询：已$v结尾
 * $k==$v* 模糊查询：已$v开头
 * $k==$v 精确查询
 * $k!=$v 精确查询
 * $k<$v 小于
 * $k>$v 大于
 * $k>=$v 大于等于
 * $k<=$v 小于等于
 * $k=out=($v) 过滤 $k=$v 的数据
 * $k=in=($v) 筛选 $k=$v 的数据
 */
export interface SqlQuery {
  [key: string]: '$k==*$v*' | '$k==*$v' | '$k==$v*' | '$k==$v' | '$k!=$v' | '$k<$v' | '$k>$v' | '$k>=$v' | '$k<=$v' | '$k=out=($v)' | '$k=in=($v)' | CustomQuery
}

export interface Sort {
  [key: string]: 'desc' | 'asc'
}

export interface Query {
  [key: string]: any
}

// 配置信息
interface QueryConfig {
  // 是否分页
  isPagination?: boolean
  // 查询参数
  query?: Ref<Query>
  // 查询参数拼接规则
  sqlQuery?: SqlQuery
  // 排序
  sorts?: Ref<Sort> | Sort
}

export default function useSqlQuery(config: QueryConfig) {
  const { query, sqlQuery } = config

  // 当前页码
  const page = ref(1)
  // 每页条数
  const size = ref(query?.value.size || 10)
  // 是否分页
  const isPagination = config.isPagination === undefined ? true : !!config.isPagination

  // 初始化查询参数
  const initQuery = () => {
    if (!isPagination) {
      size.value = 99999
    }
    return {
      page: page.value - 1,
      size: size.value,
      search: '',
      sort: '',
    }
  }

  // 拼接列表查询条件
  function initQueryParams() {
    const queryParams = initQuery()

    if (query && query.value && JSON.stringify(query.value) !== '{}') {
      let q = ``
      const sql = sqlQuery || {}
      const preFix = query.value.searchPrefix || ''
      for (const key in query.value) {
        const val = query.value[key]
        // search拼接特殊条件
        if (!val || key === 'searchPrefix')
          continue

        // 修改每页条数
        if (key === 'size') {
          size.value = val
          continue
        }

        // 存在自定义查询
        if (sql[key]) {
          if (typeof sql[key] === 'object') {
            // 模糊查询 - 多字段
            if (sql[key].type === 'fuzzy') {
              let fuzzy = ``
              for (const field of sql[key].fields) {
                fuzzy += `${field}==*${val}*,`
              }
              q += `(${fuzzy.slice(0, -1)});`
            }
          }
          else if (val === 'null') {
            q += `${key}=isnull=;`
          }
          else {
            const sqlVal = sql[key].replace('$k', key)
            q += `${sqlVal.replace('$v', val)};`
          }
          continue
        }
        q += `${key}==*${val}*;`
      }
      queryParams.search = `${preFix}${q.slice(0, -1)}`
    }
    // 排序
    const sorts = unref(config.sorts)
    if (sorts) {
      let sort = ``
      for (const k in sorts) {
        const v = sorts[k]
        sort += `${sort ? '&sort=' : ''}${k},${v}`
      }
      queryParams.sort = sort
    }
    return queryParams
  }

  return {
    page,
    size,
    isPagination,
    initQueryParams,
  }
}
