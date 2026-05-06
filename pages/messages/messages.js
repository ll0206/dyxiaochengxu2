const api = require('../../utils/api')

const MSG_TYPES = {
  construction: '施工通知',
  appointment: '预约通知',
  activity: '活动通知',
  system: '系统公告'
}

Page({
  data: {
    messages: [],
    empty: true,
    loading: true
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '消息中心' })
    this.refresh()
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    var self = this
    if (api.isLoggedIn()) {
      api.getMessages(1)
        .then(function (data) {
          var list = (data && data.list) || []
          var messages = list.map(function (m) {
            return Object.assign({}, m, {
              typeLabel: MSG_TYPES[m.type] || '通知',
              timeText: self.formatTime(m.createTime)
            })
          })
          self.setData({ messages: messages, empty: messages.length === 0, loading: false })
        })
        .catch(function () {
          self._loadLocal()
        })
    } else {
      this._loadLocal()
    }
  },

  _loadLocal() {
    var localMsgs = tt.getStorageSync('localMessages') || []
    var self = this
    var messages = localMsgs.map(function (m) {
      return Object.assign({}, m, {
        typeLabel: MSG_TYPES[m.type] || '通知',
        timeText: self.formatTime(m.createTime)
      })
    })
    // 添加默认消息
    if (messages.length === 0) {
      messages = [
        { id: 1, type: 'system', typeLabel: '系统公告', title: '欢迎来到车尚友', content: ' browse实拍案例、预约改装服务，开启您的豪车升级之旅', createTime: Date.now(), read: false },
        { id: 2, type: 'activity', typeLabel: '活动通知', title: '老改新限时优惠', content: '即日起至年底，预约老改新外观升级享专属优惠，详情咨询门店', createTime: Date.now() - 86400000, read: false }
      ]
    }
    this.setData({ messages: messages, empty: messages.length === 0, loading: false })
  },

  formatTime(ts) {
    if (!ts) return ''
    var d = new Date(ts)
    var pad = function (n) { return n < 10 ? '0' + n : '' + n }
    return pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
  },

  onTapMessage(e) {
    var index = e.currentTarget.dataset.index
    var msg = this.data.messages[index]
    if (!msg) return

    // 标记已读
    var messages = this.data.messages.slice()
    messages[index].read = true
    this.setData({ messages: messages })

    // 根据类型跳转
    if (msg.type === 'construction') {
      tt.navigateTo({ url: '/pages/profile/construction' })
    } else if (msg.type === 'appointment') {
      tt.navigateTo({ url: '/pages/profile/appointments' })
    } else {
      // 查看详情
      tt.showModal({ title: msg.title, content: msg.content, showCancel: false })
    }
  }
})
