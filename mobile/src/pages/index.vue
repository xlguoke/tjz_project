<script setup lang="ts">
import UserIntro from './components/UserIntro.vue'
import QuickEntry from './components/QuickEntry.vue'
import ShareQr from './components/ShareQr.vue'
import Product from './components/Product.vue'

definePage({
  meta: {
    title: '首页',
  },
})
</script>

<template>
  <div class="p-3">
    <UserIntro />

    <QuickEntry class="mt-3" />

    <ShareQr class="mt-3" />

    <div class="mt-6 mb-3 flex items-center justify-center gap-2">
      <i class="w-1 h-4 bg-blue"></i>
      <h3 class="flex-1 my-0">
        推荐热门产品
      </h3>
      <router-link class="text-blue">
        查看更多 >
      </router-link>
    </div>

    <Product />
  </div>
</template>

<style scoped>
.warpper {
  height: calc(100% - (var(--van-tabbar-height) * 2));
}
</style>
