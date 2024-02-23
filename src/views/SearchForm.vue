<script setup lang="ts">
import { ref } from 'vue'
import { getWeiboReply } from '../api/reply'
import dayjs from 'dayjs'
import TranspondIcon from './icons/TranspondIcon.vue'
import ReviewIcon from './icons/ReviewIcon.vue'
import UpvoteIcon from './icons/UpvoteIcon.vue'
import { IReplyInfoDataItem } from '../api/reply/type'
import { message } from 'ant-design-vue'
const [messageApi, contextHolder] = message.useMessage()

const searchValue = ref('')
const replyList = ref<Array<IReplyInfoDataItem>>([])

const reply_list_spinning = ref(false)
const getReply = async () => {
  try {
    reply_list_spinning.value = true
    const reply = await getWeiboReply()
    const tempReply = JSON.parse(JSON.stringify(replyList.value))
    replyList.value = tempReply.concat(reply.data)
  } catch (error) {
    messageApi.error(String(error))
  } finally {
    reply_list_spinning.value = false
  }
}

const formatDateByCreatedAt = (created_at: string) => {
  // 暂时只支持中国地区
  return dayjs(new Date(created_at).getTime()).format('YY-M-DD HH:mm')
}
</script>

<template>
  <context-holder />
  <div>版本： {{ new Date() }}</div>
  <div>
    <a-input v-model:value="searchValue" placeholder="请输入想要搜索的评论" />
    <a-button type="primary" @click="getReply">搜索</a-button>
  </div>
  <div>
    评论列表：
    <a-spin :spinning="reply_list_spinning">
      <div class="reply-list">
        <template v-for="item of replyList">
          <div class="reply-item-layout">
            <div>
              <img :src="item.user.profile_image_url" alt="头像" />
            </div>
            <div class="reply-item-right-layout">
              <div>
                <span class="user-screen-name">{{ item.user.screen_name }}:</span
                ><span>{{ item.text }}</span>
              </div>
              <div class="reply-item-right-bottom-layout bottom-text">
                <div>{{ formatDateByCreatedAt(item.created_at) }} {{ item.source }}</div>
                <div class="reply-operation-groups">
                  <TranspondIcon /> <ReviewIcon /> <UpvoteIcon />{{ item.like_counts }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
img {
  width: 34px;
  height: 34px;
}
.reply-list {
  overflow: scroll;
  display: grid;
  grid-auto-rows: auto; /* 设置每行的高度由内容决定 */
  gap: 20px;
}
.reply-item-layout {
  display: grid;
  grid-template-columns: 3fr 37fr;
}
.reply-item-right-layout {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
}
.reply-item-right-bottom-layout {
  display: grid;
  grid-template-columns: 34fr 6fr;
}
.user-screen-name {
  color: #d36747;
}
.bottom-text {
  color: #797979;
}
.reply-operation-groups {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  align-items: center;
}
</style>
