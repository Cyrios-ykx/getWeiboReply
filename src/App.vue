<script setup lang="ts">
import { onMounted } from 'vue'
import Form from './views/SearchForm.vue'

onMounted(() => {
  console.log('GetWeiboReply is onLoad.')
})
</script>

<template>
  <div class="layout">
    <Form></Form>
  </div>
</template>

<style scoped>
.layout {
  padding-top: 60px;
  width: 800px;
}
</style>
