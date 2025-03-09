<script setup lang='ts'>
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

defineProps<{ datas: RouteRecordRaw[] }>()

const router = useRouter()
</script>

<template>
  <template v-for="route in datas" :key="route.name">
    <template v-if="!route.children || route.children.length === 0">
      <a-menu-item
        :key="route.name"
        @click="() => router.push(route.name as string)"
      >
        <span>{{ route.meta?.title }}</span>
      </a-menu-item>
    </template>
    <a-sub-menu v-else :key="route.name">
      <template #title>
        <span>
          <span>{{ route.meta?.title }}</span>
        </span>
      </template>
      <MenuItem
        v-if="route.children && route.children.length"
        :datas="route.children"
      />
    </a-sub-menu>
  </template>
</template>

<style>

</style>
