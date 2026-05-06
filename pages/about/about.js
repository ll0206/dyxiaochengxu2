const app = getApp()
const { switchTab } = require('../../utils/util')
const { callServiceHotline } = require('../../utils/phone-call')

const TECH_LINES = [
  '奔驰/宝马/保时捷全车系外观升级专业技术',
  '无损安装与切割钣金两种方案可选',
  '喷漆环节注重色差控制与漆面平整度（具体工艺以施工方案为准）',
  '交付前进行车辆功能与外观复检，记录可追溯'
]

const PHILOSOPHY = [
  { label: '专注：', text: '聚焦奔驰、宝马等德系车型升级整备，持续深耕细分市场' },
  { label: '品质：', text: '配件来源与工艺标准在方案确认阶段向您说明，关键环节可追溯沟通' },
  { label: '服务：', text: '从咨询、勘车到交付保持对接；质保与售后范围以书面约定为准' }
]

const NEWS_LIST = [
  { date: '2026-04-28', title: '车尚友白云车间春季施工档期开放预约，老改新方案可到店沟通。' },
  { date: '2026-04-10', title: '外观无损升级与切割方案差异说明已更新，欢迎到店勘车后选型。' },
  { date: '2026-03-15', title: '门店服务时间调整请以「联系我们」公示为准，节假日可提前电话确认。' }
]

Page({
  data: {
    techLines: TECH_LINES,
    philosophy: PHILOSOPHY,
    newsList: NEWS_LIST
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '关于我们 - 车尚友' })
  },

  switchTab,

  makeCall() {
    callServiceHotline(app.globalData.phone)
  },

  goBusiness() {
    tt.navigateTo({ url: '/pages/business/business' })
  },

  goCases() {
    tt.navigateTo({ url: '/pages/cases/cases' })
  },

  goContact() {
    tt.navigateTo({ url: '/pages/contact/contact' })
  },

  scrollToIntro() {
    this._pageScrollToSelector('#corp-intro')
  },

  scrollToNews() {
    this._pageScrollToSelector('#corp-news')
  },

  _pageScrollToSelector(selector) {
    var query = tt.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      var rect = res[0]
      var viewport = res[1]
      if (!rect || !viewport) return
      var top = rect.top + viewport.scrollTop - 24
      tt.pageScrollTo({ scrollTop: top < 0 ? 0 : top, duration: 280 })
    })
  }
})
