import axios from '../api_base'
import type {
  IGetMainBodyInfo,
  IGetWeiboMainBodyData,
  IGetReplyPara,
  IGetWeiboReplyInfo
} from './type'

const getWeiboMainBody = async (para: IGetMainBodyInfo) => {
  const url = `https://weibo.com/ajax/statuses/show?id=${para.id}&locale=${para.locale}`
  return axios.get(url) as unknown as IGetWeiboMainBodyData
}

const getWeiboReplyInfo = async (para: IGetReplyPara) => {
  const url = `https://weibo.com/ajax/statuses/buildComments?is_asc=${para.is_asc}is_reload=${para.is_reload}&id=${para.id}&is_show_bulletin=${para.is_show_bulletin}&is_mix=${para.is_mix}&max_id=${para.max_id}&count=${para.count}&uid=${para.uid}&fetch_level=${para.fetch_level}&locale=${para.locale}`

  return axios.get(url) as unknown as IGetWeiboReplyInfo
}

const getWeiboReply = async (id: string) => {
  const get_weibo_main_body_para: IGetMainBodyInfo = {
    id: id,
    locale: 'zh-CN'
  }

  const main_body = await getWeiboMainBody(get_weibo_main_body_para)

  const get_weibo_reply_info_para: IGetReplyPara = {
    is_reload: 1,
    id: main_body.id,
    is_show_bulletin: main_body.is_show_bulletin,
    is_mix: 0,
    count: 10,
    uid: main_body.user.id,
    fetch_level: 0,
    locale: get_weibo_main_body_para.locale
  }
  const reply_info = await getWeiboReplyInfo(get_weibo_reply_info_para)

  return reply_info
}

export { getWeiboMainBody, getWeiboReplyInfo, getWeiboReply }
