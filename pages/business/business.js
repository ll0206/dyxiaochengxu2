const app = getApp()
const { switchTab } = require('../../utils/util')
const { callServiceHotline } = require('../../utils/phone-call')

Page({
  data: {},

  onLoad() {
    tt.setNavigationBarTitle({ title: '核心业务 - 车尚友' })
  },

  switchTab,

  makeCall() {
    callServiceHotline(app.globalData.phone)
  }
})
