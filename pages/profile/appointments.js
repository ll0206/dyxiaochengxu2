const app = getApp()
const { callServiceHotline } = require('../../utils/phone-call')

const STATUS_MAP = {
  pending: { label: '待确认', className: 'status-pending' },
  confirmed: { label: '已确认', className: 'status-confirmed' },
  cancelled: { label: '已取消', className: 'status-cancelled' }
}

function decorate(list) {
  return list.map(function (item) {
    var meta = STATUS_MAP[item.status] || STATUS_MAP.pending
    return Object.assign({}, item, {
      statusLabel: meta.label,
      statusClass: meta.className,
      timeText: formatTime(item.createTime)
    })
  })
}

function formatTime(ts) {
  if (!ts) return ''
  var d = new Date(ts)
  var pad = function (n) { return n < 10 ? '0' + n : '' + n }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

Page({
  data: {
    list: [],
    empty: true
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    var raw = tt.getStorageSync('appointments') || []
    var decorated = decorate(raw)
    this.setData({
      list: decorated,
      empty: decorated.length === 0
    })
  },

  makeCall() {
    callServiceHotline(app.globalData.phone)
  },

  goContact() {
    tt.redirectTo({ url: '/pages/contact/contact' })
  },

  onDelete(e) {
    var id = e.currentTarget.dataset.id
    var self = this
    tt.showModal({
      title: '删除预约',
      content: '确定删除这条预约记录吗？仅删除本地记录，不影响线下沟通。',
      success: function (res) {
        if (!res.confirm) return
        var appointments = tt.getStorageSync('appointments') || []
        var next = appointments.filter(function (a) { return a.id !== id })
        tt.setStorageSync('appointments', next)
        self.refresh()
        tt.showToast({ title: '已删除', icon: 'none' })
      }
    })
  }
})
