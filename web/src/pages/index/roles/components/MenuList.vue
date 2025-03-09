<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import type { TreeProps } from 'ant-design-vue'
import type { DataNode, EventDataNode } from 'ant-design-vue/es/vc-tree/interface'
import permissionStores from '@/stores/permissions'

type Key = string | number

const props = defineProps({
  // 权限编码
  permissionCode: {
    type: String,
    default: '',
  },
  // 角色编码
  roleName: String,
  // 是否父节点可选
  parentIsCheck: {
    type: Boolean,
    default: true,
  },
  fieldNames: {
    type: Object,
    default: () => ({
      title: 'description',
      key: 'name',
      children: 'permissions',
    }),
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const emits = defineEmits<{
  (e: 'save', keys: string[], cb: (bol?: boolean) => void): void
}>()

const { permissions } = storeToRefs(permissionStores())
const hasPermission = permissionStores().hasPermission(props.permissionCode)
const expandedKeys = ref<Key[]>([])
const checkedKeys = ref<Key[]>([])
const treeData = ref<TreeProps['treeData']>([])
const saveLoading = ref(false)

// 是否修改了数据
const isChange = computed(() => {
  const oldKeys = [...props.selectedKeys].sort()
  const newKeys = [...checkedKeys.value].sort()
  return oldKeys.join() !== newKeys.join()
})

watchEffect(() => {
  const list: TreeProps['treeData'] = []
  const { title, key, children } = props.fieldNames
  const keys = []
  ;(function _each(datas, newList) {
    for (let i = 0; i < datas.length; i++) {
      const d: any = datas[i]
      const item = {
        key: d[key],
        title: d[title],
        selectable: true,
        checkable: true,
        children: [],
      }
      if (d[children] && d[children].length > 0) {
        item.children = []
        if (!props.parentIsCheck) {
          // 当前节点不展示多选框
          item.checkable = false
          // 当前节点不可选择
          item.selectable = false
        }
        keys.push(item.key)
        _each(d[children], item.children)
      }
      newList.push(item)
    }
  })(permissions.value, list)

  expandedKeys.value = keys
  treeData.value = list
})

watchEffect(() => {
  checkedKeys.value = props.selectedKeys
})

// 选择节点：点击文本选择
const selectNode: TreeProps['onSelect'] = (_keys, info) => {
  checkParentNode(info.node, info.selected)
}

// 选择节点：点击复选框选择
const checkNode: TreeProps['onCheck'] = (keys, info) => {
  checkedKeys.value = Array.isArray(keys) ? keys : keys.checked
  checkParentNode(info.node, info.checked)
}

// 获取子节点key
function findChildKey(cNode?: DataNode[]) {
  if (!cNode)
    return []
  const keys = cNode.map(d => d.key)
  for (let i = 0; i < cNode.length; i++) {
    const d = cNode[i]
    if (d.children && d.children.length > 0)
      keys.push(...findChildKey(d.children))
  }
  return keys
}

// 选择节点：处理关联的父、子节点
function checkParentNode(node: EventDataNode, isChecked: boolean) {
  const { key, children } = node
  const childKey = findChildKey(children)
  let keys = [key, ...childKey]
  if (isChecked) {
    keys = keys.filter(k => !checkedKeys.value.includes(k))
    // 选择: 自己和子节点
    checkedKeys.value.push(...keys)
    // 反向选择父节点：不存在父节点或已选择则不做处理
    ;(function findNode(node: EventDataNode) {
      const parent = node.parent as EventDataNode
      // 父节点不存在
      if (!parent)
        return ''
      // 选择父节点：未选择时将其勾选
      const isSel = checkedKeys.value.includes(parent.key)
      if (!isSel) {
        checkedKeys.value.push(parent.key)
      }
      findNode(parent)
    })(node)
  }
  else {
    // 取消选择: 自己和子节点
    checkedKeys.value = checkedKeys.value.filter(d => !keys.includes(d))
    // 反向取消选择父节点：不存在父节点不做处理、子节点全未选择则取消选择父节点
    ;(function findNode(node: EventDataNode) {
      const parent = node.parent as EventDataNode
      // 父节点不存在
      if (!parent)
        return ''
      // 同级节点是否全部已取消选择，若还存在选择的节点，则不取消选择父节点
      const isSelChilds = parent.children?.find(d => checkedKeys.value.includes(d.key))
      if (isSelChilds)
        return ''
      // 取消选择当前父节点
      // 父节点存在时，取消选择，并继续往上查找
      checkedKeys.value = checkedKeys.value.filter(d => d !== parent.key)
      findNode(parent)
    })(node)
  }
}

function saveData() {
  saveLoading.value = true
  const keys = checkedKeys.value.map(d => `${d}`)
  emits('save', keys, () => {
    saveLoading.value = false
  })
}
</script>

<template>
  <div
    class="sel-tree-tree"
    pos-relative
    flex
    flex-col
    flex-1
    h-0
    my-2
  >
    <div v-if="roleName !== 'admin' && hasPermission" class="pos-absolute right-4 top-[-51px]">
      <a-button
        type="primary"
        :disabled="!isChange"
        :loading="saveLoading"
        @click="saveData"
      >
        保存
      </a-button>
    </div>
    <div
      px-6
      pt-4
      my-2
      h-full
      overflow-auto
    >
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:checkedKeys="checkedKeys"
        v-model:selectedKeys="checkedKeys"
        :disabled="roleName === 'admin' || !hasPermission"
        :tree-data="treeData"
        check-strictly
        checkable
        block-node
        multiple
        @check="checkNode"
        @select="selectNode"
      >
        <template #switcherIcon="{ expanded }">
          <img
            v-if="expanded"
            class="tree-icon tree-icon-open"
            src="@/assets/images/tree-open.svg"
          >
          <img
            v-else
            class="tree-icon"
            src="@/assets/images/tree-close.svg"
          >
        </template>
      </a-tree>
      <a-empty v-if="treeData?.length === 0" />
    </div>
  </div>
</template>

<style scoped>
.sel-tree-tree :deep(.ant-tree-switcher) {
  margin-right: 8px;
  height: 26px;
}
.sel-tree-tree .tree-icon {
  color: var(--primary-color);
  width: 26px;
}
.sel-tree-tree .tree-icon.tree-icon-open {
  width: 26px;
}
.sel-tree-tree :deep(.ant-tree) .ant-tree-treenode {
  min-height: 32px;
  align-items: center;
}
.sel-tree-tree :deep(.ant-tree) .ant-tree-title {
  display: flex;
  align-items: center;
}
.sel-tree-tree :deep(.ant-tree) .ant-tree-checkbox {
  margin-block-start: 0;
}
.sel-tree-tree
  :deep(.ant-tree)
  .ant-tree-node-content-wrapper.ant-tree-node-selected,
.sel-tree-tree
  :deep(.ant-tree).ant-tree-checkbox
  + span.ant-tree-node-selected {
  background-color: transparent;
}
</style>
