const app = getApp()
const { switchTab } = require('../../utils/util')
const { CASE_DATA } = require('../../utils/case-data')
const { resolveImageUrl } = require('../../utils/image-url')

// 从真实案例数据中精选3条：宝马/奔驰/保时捷各1条
const FEATURE_CASES = [
  CASE_DATA[0],   // 宝马5系 F18 无损升级
  CASE_DATA[20],  // 奔驰S级 W221 迈巴赫升级
  CASE_DATA[32]   // 保时捷帕拉梅拉 Turbo S
].map(function(item, idx) {
  return {
    index: idx,
    title: item.title.split('（')[0],
    sub: item.upgradeTarget,
    price: item.price,
    tag: item.tags[0],
    image: resolveImageUrl(item.image),
    imageTheme: item.imageTheme,
    caseIndex: CASE_DATA.indexOf(item)
  }
})

const REVIEWS = [
  { nickname: '张**', avatar: '👨', content: '老款5系升级22款运动版，效果非常满意！师傅手艺很好，价格也很公道。', car: '宝马5系 F18', stars: '★★★★★' },
  { nickname: '李**', avatar: '👩', content: 'S级升级迈巴赫，太帅了！朋友都以为我买了新车。', car: '奔驰S级 W221', stars: '★★★★★' },
  { nickname: '王**', avatar: '👨', content: 'X5升级24款运动版，外观变化很大，家人都很喜欢。', car: '宝马X5 E70', stars: '★★★★★' },
  { nickname: '陈**', avatar: '👩', content: '帕拉梅拉改Turbo S包围，质感很好，做工精细。', car: '保时捷帕拉梅拉', stars: '★★★★★' }
]

Page({
  data: {
    featureCases: FEATURE_CASES,
    reviews: REVIEWS,
    announcements: app.globalData.announcements,
    caseCount: CASE_DATA.length,
    homeSearchKeyword: ''
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '车尚友汽车科技' })
  },

  switchTab,

  onTapFeatureCase(e) {
    const caseIndex = e.currentTarget.dataset.caseIndex
    tt.navigateTo({ url: '/pages/case-detail/case-detail?index=' + caseIndex })
  },

  goToCases() {
    tt.redirectTo({ url: '/pages/cases/cases' })
  },

  goAbout() {
    tt.navigateTo({ url: '/pages/about/about' })
  },

  goBusiness() {
    tt.redirectTo({ url: '/pages/business/business' })
  },

  goContact() {
    tt.navigateTo({ url: '/pages/contact/contact' })
  },

  goProfile() {
    tt.redirectTo({ url: '/pages/profile/profile' })
  },

  onHomeSearchInput(e) {
    this.setData({ homeSearchKeyword: e.detail.value || '' })
  },

  onHomeSearchConfirm() {
    var kw = (this.data.homeSearchKeyword || '').trim()
    var url = kw
      ? '/pages/cases/cases?keyword=' + encodeURIComponent(kw)
      : '/pages/cases/cases'
    tt.redirectTo({ url: url })
  }
})
