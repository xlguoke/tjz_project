<script setup lang="ts">
import TeamAward from './components/TeamAward.vue'
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

    <ShareQr class="my-3" />

    <TeamAward />

    <div class="mt-6 mb-3 flex items-center justify-center gap-2">
      <i class="w-1 h-4 bg-blue"></i>
      <h3 class="flex-1 my-0">
        推荐热门产品
      </h3>
      <router-link class="text-blue" to="/product">
        查看更多 >
      </router-link>
    </div>

    <template v-for="i in 5" :key="i">
      <Product class="mb-3" />
    </template>
  </div>
</template>

<style scoped>
.warpper {
  height: calc(100% - (var(--van-tabbar-height) * 2));
}
</style>
