<script setup lang="ts">
import { ref } from 'vue'
import { getWeiboMainBody, getWeiboReply, getWeiboReplyInfo } from '../api/reply'
import dayjs from 'dayjs'
import TranspondIcon from './icons/TranspondIcon.vue'
import ReviewIcon from './icons/ReviewIcon.vue'
import UpvoteIcon from './icons/UpvoteIcon.vue'
import { IGetMainBodyInfo, IGetWeiboReplyInfo, IReplyInfoDataItem } from '../api/reply/type'
import { message } from 'ant-design-vue'
import { SleepMS } from '../libs/utils'
const [messageApi, contextHolder] = message.useMessage()

const searchValue = ref('')
const replyList = ref<IReplyInfoDataItem[]>([])

const weibo_id = ref('')
const reply_list_spinning = ref(false)

const count = ref(20)

const get_count = ref(0)
const get_total = ref(1)
const getReply = async () => {
  try {
    reply_list_spinning.value = true
    const get_weibo_main_body_para: IGetMainBodyInfo = {
      id: weibo_id.value,
      locale: 'zh-CN'
    }
    const main_body = await getWeiboMainBody(get_weibo_main_body_para)

    const reply = await getWeiboReply(weibo_id.value)
    get_count.value = reply.data.length
    get_total.value = reply.total_number

    const firstFetchReply: IReplyInfoDataItem[] = []
    for (const replyItem of reply.data) {
      const regex = searchValue.value
      const reg = new RegExp(regex)
      if (reg.test(replyItem.text)) {
        firstFetchReply.push(replyItem)
      }
    }

    replyList.value = firstFetchReply
    let new_max_id = reply.max_id

    let flag = reply.data.length
    while (flag > 0) {
      await SleepMS(200)
      const para = {
        is_asc: 0,
        max_id: new_max_id,
        is_reload: 1,
        id: main_body.id,
        is_show_bulletin: main_body.is_show_bulletin,
        is_mix: 0,
        count: count.value,
        uid: main_body.user.id,
        fetch_level: 0,
        locale: get_weibo_main_body_para.locale
      }
      const next_reply = await getWeiboReplyInfo(para)

      const fetchReply: any[] = []
      for (const reply of next_reply.data) {
        const regex = searchValue.value
        const res = new RegExp(regex)
        if (res.test(reply.text)) {
          fetchReply.push(reply)
        }
      }
      const tempReply = JSON.parse(JSON.stringify(replyList.value))
      replyList.value = tempReply.concat(fetchReply)
      get_count.value = replyList.value.length

      new_max_id = next_reply.max_id
      flag = next_reply.data.length
    }
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
  <div>
    <span class="top-item">更新日期： {{ new Date() }}</span>
    <span class="top-item">版本： v0.0.1</span>
    <span class="top-item">Develop by Cyrios.</span>
  </div>
  <div>
    单次获取数量: <a-input v-model:value="count" placeholder="单次获取数量" /> 微博正文id号:
    <a-input v-model:value="weibo_id" placeholder="请输入微博正文id号" /> 想要搜索的内容:
    <a-input v-model:value="searchValue" placeholder="请输入想要搜索的评论" />
    <a-button type="primary" @click="getReply">搜索</a-button>
  </div>
  <div>
    进度：
    <a-progress :percent="(get_count / get_total) * 100" :size="[300, 20]" />
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
.top-item {
  margin-right: 10px;
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
