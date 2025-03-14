<script setup lang="ts">
const route = useRoute()
const docTitle = ref('')
const tabBar = [
  {
    text: '首页',
    icon: 'home-o',
    path: '/',
  },
  {
    text: '产品',
    icon: 'balance-list-o',
    path: '/product',
  },
  {
    text: '团队',
    icon: 'friends-o',
    path: '/team',
  },
  {
    text: '我的',
    icon: 'contact-o',
    path: '/my',
  },
]
const active = ref(route.path)
const showTabBar = computed(() => {
  return tabBar.some(item => item.path === route.path)
})
const noLayout = computed(() => {
  return ['/login', '/register', '/forget-password'].includes(route.path)
})

function onClickLeft() {
  history.back()
}

watchEffect(() => {
  const title = route.meta.title || ''
  active.value = route.path
  docTitle.value = `${__PROJECT_NAME__}${title ? '-' : ''}${title}`
})

useHead({
  title: docTitle,
  meta: [
    {
      name: 'description',
      content: 'tjz Project',
    },
  ],
})
</script>

<template>
  <div class="h-screen bg-gray-1">
    <template v-if="noLayout">
      <RouterView />
    </template>
    <template v-else>
      <van-nav-bar
        :title="route.meta.title"
        :left-arrow="!showTabBar"
        @click-left="onClickLeft"
      />

      <div :class="`overflow-auto ${showTabBar ? 'warpper-tabbar' : 'warpper'}`">
        <RouterView />
      </div>

      <van-tabbar v-if="showTabBar" v-model="active">
        <van-tabbar-item
          v-for="item in tabBar"
          :key="item.path"
          :name="item.path"
          :icon="item.icon"
          :to="item.path"
        >
          {{ item.text }}
        </van-tabbar-item>
      </van-tabbar>
    </template>
  </div>
</template>

<style scoped>
.warpper-tabbar {
  height: calc(100% - (var(--van-tabbar-height) * 2));
}
.warpper {
  height: calc(100% - var(--van-tabbar-height));
}
</style>
