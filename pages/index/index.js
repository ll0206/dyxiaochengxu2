const app = getApp()
const { switchTab } = require('../../utils/util')
const { CASE_DATA } = require('../../utils/case-data')
const { resolveImageUrl } = require('../../utils/image-url')
const api = require('../../utils/api')

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
  { nickname: '张**', avatarIcon: '张', nicknameIcon: '张', content: '老款5系升级22款运动版，效果非常满意！师傅手艺很好，价格也很公道。', car: '宝马5系 F18', stars: '★★★★★' },
  { nickname: '李**', avatarIcon: '李', nicknameIcon: '李', content: 'S级升级迈巴赫，太帅了！朋友都以为我买了新车。', car: '奔驰S级 W221', stars: '★★★★★' },
  { nickname: '王**', avatarIcon: '王', nicknameIcon: '王', content: 'X5升级24款运动版，外观变化很大，家人都很喜欢。', car: '宝马X5 E70', stars: '★★★★★' },
  { nickname: '陈**', avatarIcon: '陈', nicknameIcon: '陈', content: '帕拉梅拉改Turbo S包围，质感很好，做工精细。', car: '保时捷帕拉梅拉', stars: '★★★★★' }
]

Page({
  data: {
    featureCases: FEATURE_CASES,
    reviews: REVIEWS,
    announcements: app.globalData.announcements,
    caseCount: CASE_DATA.length,
    homeSearchKeyword: '',
    banners: [],
    bannersLoaded: false
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '车尚友汽车科技' })
    // 尝试从服务端加载 Banner 和评价
    this._loadBanners()
    this._loadReviews()
  },

  switchTab,

  _loadBanners() {
    var self = this
    api.getBanners()
      .then(function (data) {
        var banners = (data && data.list) || []
        self.setData({ banners: banners, bannersLoaded: true })
      })
      .catch(function () {
        // 保持使用轮播模板
        self.setData({ bannersLoaded: true })
      })
  },

  _loadReviews() {
    var self = this
    api.getReviews({}, 1)
      .then(function (data) {
        var list = (data && data.list) || []
        if (list.length > 0) {
          var reviews = list.map(function (r) {
            return Object.assign({}, r, {
              avatarIcon: (r.nickname || '用').charAt(0),
              nicknameIcon: (r.nickname || '用').charAt(0)
            })
          })
          self.setData({ reviews: reviews })
        }
      })
      .catch(function () {
        // 使用本地硬编码评价
      })
  },

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
