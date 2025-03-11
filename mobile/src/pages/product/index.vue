<script setup lang='ts'>
import Product from '../components/Product.vue'
import DataList from '@/components/DataList.vue'
import { useDatas } from '@/composables/useDatas'

const productTypeDatas = ref([
  { text: '全部类型', value: '0' },
  { text: '票贷', value: '1' },
  { text: '车抵贷', value: '2' },
  { text: '信用贷', value: '3' },
])
const productType = ref('0')
const activeId = ref(1)
const activeIndex = ref(0)
const items = [
  {
    text: '浙江',
    children: [
      { text: '杭州', id: 1 },
      { text: '温州', id: 2 },
      { text: '宁波', id: 3, disabled: true },
    ],
  },
  {
    text: '江苏',
    children: [
      { text: '南京', id: 4 },
      { text: '无锡', id: 5 },
      { text: '徐州', id: 6 },
    ],
  },
  { text: '福建', disabled: true },
]

const {
  page,
  size,
  dataSource,
  total,
  loading,
  onLoad,
  onRefresh,
  onChange,
} = useDatas<any>({
  dataApi: getDataApi,
  responseDataTransform() {
    return {
      rows: [{}, {}, {}, {}, {}],
      count: 5,
    }
  },
})

async function getDataApi(): Promise<any> {
  const param = {
    page: page.value,
    size
  }
  return {
    param,
    data: {
      rows: [],
      count: 0,
    },
  }
}

definePage({
  meta: {
    title: '产品',
  },
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-white">
      <van-dropdown-menu>
        <van-dropdown-item title="所在区域">
          <van-tree-select
            v-model:active-id="activeId"
            v-model:main-active-index="activeIndex"
            :items="items"
          />
        </van-dropdown-item>
        <van-dropdown-item v-model="productType" :options="productTypeDatas" />
      </van-dropdown-menu>
    </div>
    <div class="p-3 flex-1 h-0 overflow-auto">
      <DataList
        :datas="dataSource"
        :total="total"
        :loading="loading"
        @change="onChange"
        @load="onLoad"
        @refresh="onRefresh"
      >
        <template #dataItem="{ item }">
          <Product class="mb-3" :data="item" />
        </template>
      </DataList>
    </div>
  </div>
</template>

<style>

</style>
