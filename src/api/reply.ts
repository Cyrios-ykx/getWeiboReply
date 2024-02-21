import axios from './api_base'

// 获取微博评论参数
interface IGetReplyPara {
  is_reload: number
  id: number
  is_show_bulletin: number
  is_mix: number
  count: number
  uid: number
  fetch_level: number
  locale: string
}

// 获取微博正文主体参数
interface IGetMainBodyInfo {
  id: string
  locale: string
}

const getWeiboMainBody = async (para: IGetMainBodyInfo) => {
  const url = `https://weibo.com/ajax/statuses/show?id=${para.id}&locale=${para.locale}`
  return axios.get(url)
}

const getWeiboReply = async () => {
  const getWeiboMainBodyPara: IGetMainBodyInfo = {
    id: 'MprmMfpqm',
    locale: 'string'
  }
  const { data } = await getWeiboMainBody(getWeiboMainBodyPara)

  console.log(data)

  // const url = ''
  // return axios.get(url)
}

export { getWeiboMainBody, getWeiboReply }
