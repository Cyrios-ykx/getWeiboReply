// 获取微博正文主体参数
interface IGetMainBodyInfo {
  id: string
  locale: string
}

interface IIConListItem {
  type: string
  data: {
    mbrank: number
    mbtype: number
    svip: number
    vvip: number
  }
}

interface IGetWeiboMainBodyData {
  annotations: Array<any>
  attitudes_count: number
  attitudes_status: number
  can_edit: boolean
  can_remark: boolean
  cardid: string
  comment_manage_info: {
    comment_permission_type: number
    approval_comment_type: number
    comment_sort_type: number
  }
  comments_count: number
  common_struct: Array<any>
  content_auth: number
  created_at: string
  customIcons: Array<unknown>
  edit_count: number
  favorited: boolean
  id: number
  idstr: string
  isLongText: boolean
  is_paid: boolean
  is_show_bulletin: number
  mblog_vip_type: number
  mblogid: string
  mblogtype: number
  mid: string
  mlevel: number
  ok: number
  pic_bg_new: string
  pic_ids: Array<string>
  pic_infos: unknown
  pic_num: number
  pictureViewerSign: boolean
  rcList: Array<unknown>
  region_name: string
  reposts_count: number
  rid: string
  screen_name_suffix_new: Array<any>
  share_repost_type: number
  showFeedComment: boolean
  showFeedRepost: boolean
  showPictureViewer: boolean
  source: string
  text: string
  textLength: number
  text_raw: string
  title: {
    base_color: number
    icon_url: string
    text: string
  }
  title_source: {
    image: string
    name: string
    url: string
  }
  topic_struct: Array<any>
  url_struct: Array<any>
  user: {
    id: number
    idstr: string
    pc_new: number
    screen_name: string
    profile_image_url: string
    profile_url: string
    verified: boolean
    verified_type: number
    domain: string
    weihao: string
    verified_type_ext: number
    avatar_large: string
    avatar_hd: string
    follow_me: boolean
    following: boolean
    mbrank: number
    mbtype: number
    v_plus: number
    planet_video: boolean
    icon_list: Array<IIConListItem>
  }
  visible: {
    list_id: number
    type: number
  }
}
interface IReplyInfoFilterGroupItem {
  param: string
  scheme: string
  title: string
  isDefault: number
}

interface IReplyInfoDataItem {
  created_at: string
  id: number
  rootid: number
  rootidstr: string
  floor_number: number
  text: string
  disable_reply: number
  restrictOperate: number
  source_allowclick: number
  source_type: number
  source: string
  user: {
    id: number
    idstr: string
    pc_new: number
    screen_name: string
    profile_image_url: string
    profile_url: string
    verified: boolean
    verified_type: number
    domain: string
    weihao: string
    avatar_large: string
    avatar_hd: string
    follow_me: boolean
    following: boolean
    mbrank: number
    mbtype: number
    v_plus: number
    planet_video: boolean
    description: string
    location: string
    gender: string
    followers_count: number
    followers_count_str: string
    friends_count: number
    statuses_count: number
    url: string
    svip: number
    vvip: number
    cover_image_phone: string
    icon_list: Array<unknown>
  }
  mid: string
  idstr: string
  url_objects: Array<unknown>
  liked: boolean
  readtimetype: string
  analysis_extra: string
  match_ai_play_picture: boolean
  rid: string
  allow_follow: boolean
  item_category: string
  comments: Array<unknown>
  max_id: number
  total_number: number
  isLikedByMblogAuthor: boolean
  like_counts: number
  text_raw: string
}
interface IGetWeiboReplyInfo {
  data: Array<IReplyInfoDataItem>
  filter_group: Array<IReplyInfoFilterGroupItem>
  max_id: number
  ok: number
  rootComment: Array<unknown>
  total_number: number
  trendsText: string
}
// 获取微博评论参数
interface IGetReplyPara {
  is_asc?: number // 默认0
  max_id?: number //IGetWeiboReplyInfo 的max_id
  is_reload: number
  id: number
  is_show_bulletin: number
  is_mix: number
  count: number
  uid: number
  fetch_level: number
  locale: string
}

export {
  IGetMainBodyInfo,
  IIConListItem,
  IGetWeiboMainBodyData,
  IReplyInfoFilterGroupItem,
  IReplyInfoDataItem,
  IGetWeiboReplyInfo,
  IGetReplyPara
}
