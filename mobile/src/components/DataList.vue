<script setup lang='ts'>
interface Datas {
  id: string
  [key: string]: any
}

const props = defineProps({
  datas: {
    type: Array<Datas>,
    default: () => [],
  },
  selectedRows: {
    type: Array<Datas>,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  loading: Boolean,
  /** 禁用选择 */
  disabledSelected: {
    type: Boolean,
    default: true,
  },
  /** 禁用左滑 */
  disabledSwipe: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['load', 'refresh', 'change'])

const refreshing = ref(false)
const finished = computed(() => !refreshing.value && props.datas.length >= props.total)

// 下拉刷新
function onRefresh() {
  emits('refresh')
}

// 加载数据
function onLoad() {
  if (refreshing.value)
    return
  emits('load')
}

// 多选框选中项发生变化
const checked = ref<string[]>([])
const checkedAll = ref(false)
function changeCheckbox() {
  const rows = props.datas.filter(item => checked.value.includes(item.id))
  emits('change', rows)
}
function changeAll() {
  if (checkedAll.value) {
    checked.value = props.datas.map(item => item.id)
    changeCheckbox()
  }
  else {
    checked.value = []
    emits('change', [])
  }
}

function taggleCheckedAll() {
  checkedAll.value = props.datas.length > 0 && checked.value.length === props.datas.length
}

watch(() => props.selectedRows, (rows) => {
  taggleCheckedAll()
  checked.value = rows.map(item => item.id)
})

watch(() => props.loading, (bol) => {
  taggleCheckedAll()
  if (!bol && refreshing.value) {
    refreshing.value = false
  }
})
</script>

<template>
  <div class="h-full">
    <van-pull-refresh v-model="refreshing" class="min-h-full" @refresh="onRefresh">
      <van-overlay :show="loading" z-index="100" :custom-style="{ background: 'transparent' }" />
      <van-list
        :loading="!refreshing && loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-checkbox-group
          v-if="!disabledSelected"
          v-model="checked"
          shape="square"
          class="w-full"
          @click="changeCheckbox"
        >
          <van-swipe-cell
            v-for="item in datas"
            :key="item.id"
            :disabled="disabledSwipe"
          >
            <div class="p-2 mb-2 bg-gray-100 rounded">
              <van-checkbox :name="item.id">
                <slot name="dataItem" :item="item"></slot>
              </van-checkbox>
            </div>
            <template #right>
              <slot name="right" :item="item"></slot>
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
        <template v-else>
          <van-swipe-cell
            v-for="item in datas"
            :key="item.id"
            :disabled="disabledSwipe"
          >
            <slot name="dataItem" :item="item"></slot>
            <template #right>
              <slot name="right" :item="item"></slot>
            </template>
          </van-swipe-cell>
        </template>
      </van-list>
    </van-pull-refresh>
    <div v-if="!disabledSelected" class="fixed bottom-3 left-4 z-20 text-sm">
      <van-checkbox v-model="checkedAll" shape="square" @click="changeAll">
        全选（已选 {{ checked.length }} 条数据）
      </van-checkbox>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-checkbox__label) {
  margin-left: 16px;
  flex: 1;
}
:deep(.van-pull-refresh__track) {
  min-height: 50vh;
}
</style>
