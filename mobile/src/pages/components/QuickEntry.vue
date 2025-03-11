<script setup lang='ts'>
const entryList = [
  {
    title: '我的客户',
    count: 0,
    icon: '',
    path: '',
  },
  {
    title: '我的团队',
    count: 0,
    icon: '',
    path: '',
  },
  {
    title: '我的收入',
    count: 0,
    icon: '',
    path: '',
  },
  {
    title: '我的订单',
    count: 0,
    icon: '',
    path: '',
  },
]
</script>

<template>
  <ul class="bg-white rounded-md flex flex-wrap">
    <li
      v-for="item in entryList"
      :key="item.path"
      class="w-[50%] py-3 pl-5 box-border custom-border active:bg-gray-50"
    >
      <router-link :to="item.path" class="flex gap-3 text-black">
        <img src="" class="mt-2 w-6 h-6">
        <div>
          <h4 class="mt-1 mb-2">
            {{ item.title }}
          </h4>
          <div class="text-gray-400 text-lg leading-none">
            {{ item.count }}
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.custom-border:nth-child(1),
.custom-border:nth-child(2) {
  border-bottom: 1px solid #f5f5f5;
}
.custom-border:nth-child(1),
.custom-border:nth-child(3) {
  border-right: 1px solid #f5f5f5;
}
</style>
