<script lang="ts" setup>
import { Footer, Header, Sider } from '@/layout'
</script>

<template>
  <a-layout h-screen>
    <Header />
    <a-layout>
      <Sider />
      <a-layout>
        <a-layout-content p-4 pb-0>
          <div
            w-full
            h-full
            flex
            flex-col
            justify-center
            items-center
            bg-white
          >
            <img src="@/assets/images/auth.png" class="w-[300px]" alt="auth">
            <p>
              <span text-4 mt-4 text-gray-400>
                您无访问权限
              </span>
              <a href="#" text-4 mx-2 @click="$router.go(-1)">
                返回
              </a>
              <router-link to="/" replace text-4>
                前往首页
              </router-link>
            </p>
          </div>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
