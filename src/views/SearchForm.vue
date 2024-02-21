<script setup lang="ts">
import { ref } from 'vue'
import { getWeiboReply } from '../api/reply'

const searchValue = ref('')
const getReply = async () => {
  await getWeiboReply()
}
</script>

<template>
  <div>版本： {{ new Date() }}</div>
  <div>
    <a-input v-model:value="searchValue" placeholder="请输入想要搜索的评论" />
    <a-button type="primary" @click="getReply">搜索</a-button>
  </div>
</template>
