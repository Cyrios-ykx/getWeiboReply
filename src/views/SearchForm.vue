<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { getWeiboMainBody, getWeiboReply, getWeiboReplyInfo } from '../api/reply'
import dayjs from 'dayjs'
import TranspondIcon from './icons/TranspondIcon.vue'
import ReviewIcon from './icons/ReviewIcon.vue'
import UpvoteIcon from './icons/UpvoteIcon.vue'
import { IGetMainBodyInfo, IGetWeiboReplyInfo, IReplyInfoDataItem } from '../api/reply/type'
import { message } from 'ant-design-vue'
import { SleepMS } from '../libs/utils'
// import { data } from '../test/test_data.js'
const [messageApi, contextHolder] = message.useMessage()

const reply_list = ref<IReplyInfoDataItem[]>([])

const reply_list_spinning = ref(false)

const get_count = ref(0)
const get_total = ref(0)
const effective_count = ref(0)

const getReply = async () => {
  try {
    await formRef.value.validate()
  } catch (error) {
    messageApi.warning('请完善表单，' + error)
  }

  try {
    messageApi.info('搜索开始')
    reply_list_spinning.value = true
    const get_weibo_main_body_para: IGetMainBodyInfo = {
      id: form.value.weibo_id,
      locale: 'zh-CN'
    }
    const main_body = await getWeiboMainBody(get_weibo_main_body_para)
    // if (main_body.ok !== 1) {
    //   messageApi.error(main_body.message)
    //   return
    // }

    const reply = await getWeiboReply(form.value.weibo_id)
    get_count.value = reply.data.length
    get_total.value = reply.total_number

    let fetch_reply: IReplyInfoDataItem[] = []
    const regex = new RegExp(form.value.search_value)
    for (const reply_item of reply.data) {
      if (regex.test(reply_item.text)) {
        fetch_reply.push(reply_item)
      }
    }

    reply_list.value = fetch_reply
    let new_max_id = reply.max_id

    let flag = reply.data.length
    while (flag > 0) {
      if (stopFlag.value) {
        reply_list_spinning.value = false
        stopFlag.value = false
        messageApi.warning('搜索已停止')
        break
      }

      await SleepMS(200)
      const para = {
        is_asc: 0,
        max_id: new_max_id,
        is_reload: 1,
        id: main_body.id,
        is_show_bulletin: main_body.is_show_bulletin,
        is_mix: 0,
        count: form.value.count,
        uid: main_body.user.id,
        fetch_level: 0,
        locale: get_weibo_main_body_para.locale
      }
      const next_reply = await getWeiboReplyInfo(para)

      fetch_reply = []
      for (const reply_item of next_reply.data) {
        if (regex.test(reply_item.text)) {
          fetch_reply.push(reply_item)
        }
      }
      const temp_reply = JSON.parse(JSON.stringify(reply_list.value))
      reply_list.value = temp_reply.concat(fetch_reply)

      get_count.value = get_count.value + next_reply.data.length
      effective_count.value = reply_list.value.length

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
  // 暂时只支持格式化成中国地区的时间
  return dayjs(new Date(created_at).getTime()).format('YY-M-DD HH:mm')
}

const stopFlag = ref(false)
const stopGetReply = () => {
  stopFlag.value = true
}

const form = ref({
  count: 20,
  weibo_id: '',
  search_value: ''
})
const formRef = ref()
const rules = {
  count: [{ required: true, message: '请输入单次获取数量', trigger: 'change' }],
  weibo_id: [{ required: true, message: '请输入微博正文id号', trigger: 'change' }],
  search_value: [{ required: true, message: '请输入想要搜索的内容', trigger: 'change' }]
}
const update_date = new Date()

const getTextContent = (id, text) => {
  nextTick(() => {
    const container = document.getElementById(id)

    if (container) {
      container.innerHTML = text
    }
  })
}
</script>

<template>
  <!-- 这个不会提示 -->
  <context-holder />
  <div class="form-layout">
    <div class="banner-container">
      <span class="top-item">更新日期： {{ update_date }}</span>
      <span class="top-item">版本： v0.0.1</span>
      <span class="top-item">Develop by Cyrios.</span>
    </div>
    <div class="form-container">
      <a-form ref="formRef" :model="form" layout="vertical" :rules="rules">
        <a-spin :spinning="reply_list_spinning">
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-item ref="count" label="单次获取数量" name="count">
                <a-input v-model:value="form.count" placeholder="请输入单次获取数量" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item ref="weibo_id" label="微博正文id号" name="weibo_id">
                <a-input
                  v-model:value="form.weibo_id"
                  placeholder="请输入微博正文id号"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item ref="search_value" label="想要搜索的内容" name="search_value">
                <a-input
                  v-model:value="form.search_value"
                  placeholder="请输入想要搜索的内容"
                  allowClear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-spin>
        <div>
          <a-button type="primary" @click="getReply" :loading="reply_list_spinning">搜索</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" danger @click="stopGetReply">停止</a-button>
        </div>
      </a-form>
    </div>
    <div class="fetch-container">
      <div class="fetch-details">
        <span>总数：{{ get_total }}</span>
        <span>已获取评论数：{{ get_count }}</span>
        <span>有效评论数：{{ effective_count }}</span>
      </div>
      <div>
        <div class="progress-container">
          进度：
          <a-progress
            :percent="Number(((get_count / get_total) * 100).toFixed(2))"
            :size="[300, 20]"
          />
        </div>
      </div>
      <div>
        <div>评论列表：</div>
        <div class="reply-list">
          <template v-for="item of reply_list">
            <div class="reply-item-layout">
              <div class="user-img-container">
                <img class="user-img" :src="item.user.profile_image_url" alt="头像" />
              </div>
              <div class="reply-item-right-layout">
                <div>
                  <span class="user-screen-name">{{ item.user.screen_name }}:</span
                  ><span :id="String(item.id) ?? item.text"
                    >{{ getTextContent(item.id, item.text) }}
                  </span>
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
        <div class="center-item">
          <a-spin :spinning="reply_list_spinning"></a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 34px;
  height: 34px;
}
/*  */
.ant-progress-line {
  margin-bottom: 0;
}
/* .ant-btn-primary {
  background-color: #ea8011;
} */
/*  */
.user-img-container {
  display: grid;
  justify-content: center;
}
.user-img {
  border-radius: 34px;
}
.fetch-container {
  margin-top: 24px;
  display: grid;
  gap: 24px;
}

.fetch-details {
  display: grid;
  grid-template-columns: auto auto auto;
}
.banner-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding-bottom: 10px;
  border-bottom: 1px solid #797979;
}
.form-container {
  padding-top: 10px;
}
.form-layout {
  padding: 10px 20px 20px 20px;
}
.center-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.reply-list {
  overflow: scroll;
  display: grid;
  grid-auto-rows: auto; /* 设置每行的高度由内容决定 */
  gap: 20px;
  margin-top: 10px;
}
.reply-item-layout {
  display: grid;
  grid-template-columns: 3fr 37fr;
}
.reply-item-right-layout {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
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
.progress-container {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 37fr;
  align-items: center;
  padding-right: 10px;
}
</style>
