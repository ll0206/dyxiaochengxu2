const { resolveImageUrl } = require('../../utils/image-url')
const api = require('../../utils/api')

Page({
  data: {
    history: [],
    loading: true,
    useLocalData: true
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    var self = this
    if (api.isLoggedIn()) {
      api.getHistory(1)
        .then(function (data) {
          var list = (data && data.list) || []
          var history = list.map(function (h) {
            return Object.assign({}, h, { image: resolveImageUrl(h.coverImage || h.image || '') })
          })
          self.setData({ history: history, loading: false, useLocalData: false })
          tt.setNavigationBarTitle({ title: '浏览历史(' + history.length + ')' })
        })
        .catch(function () {
          self._loadLocal()
        })
    } else {
      this._loadLocal()
    }
  },

  _loadLocal() {
    var raw = tt.getStorageSync('viewHistory') || []
    var history = raw.map(function (h) {
      return Object.assign({}, h, { image: resolveImageUrl(h.image) })
    })
    this.setData({ history: history, loading: false, useLocalData: true })
    tt.setNavigationBarTitle({ title: '浏览历史(' + history.length + ')' })
  },

  onTapCase(e) {
    var index = e.currentTarget.dataset.index
    var source = this.data.useLocalData ? 'local' : 'server'
    tt.navigateTo({ url: '/pages/case-detail/case-detail?index=' + index + '&source=' + source })
  },

  onImageError(e) {
    var index = e.currentTarget.dataset.index
    var key = 'history[' + index + '].showFallback'
    this.setData({ [key]: true })
  },

  formatTime(ts) {
    var d = new Date(ts)
    return (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes())
  },

  onClear() {
    var self = this
    tt.showModal({
      title: '确认清除',
      content: '确定要清除所有浏览历史吗？',
      success: function (res) {
        if (!res.confirm) return
        if (api.isLoggedIn()) {
          api.clearHistory()
            .catch(function () {})
        }
        tt.setStorageSync('viewHistory', [])
        self.setData({ history: [] })
        tt.setNavigationBarTitle({ title: '浏览历史(0)' })
      }
    })
  }
})
