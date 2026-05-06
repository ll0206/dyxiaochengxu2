const { resolveImageUrl } = require('../../utils/image-url')

Page({
  data: {
    history: []
  },

  onShow() {
    const raw = tt.getStorageSync('viewHistory') || []
    const history = raw.map(function (h) {
      return Object.assign({}, h, { image: resolveImageUrl(h.image) })
    })
    this.setData({ history })
    tt.setNavigationBarTitle({ title: '浏览历史(' + history.length + ')' })
  },

  onTapCase(e) {
    const index = e.currentTarget.dataset.index
    tt.navigateTo({ url: `/pages/case-detail/case-detail?index=${index}` })
  },

  onImageError(e) {
    const index = e.currentTarget.dataset.index
    const key = `history[${index}].showFallback`
    this.setData({ [key]: true })
  },

  formatTime(ts) {
    const d = new Date(ts)
    return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  },

  onClear() {
    tt.showModal({
      title: '确认清除',
      content: '确定要清除所有浏览历史吗？',
      success: (res) => {
        if (res.confirm) {
          tt.setStorageSync('viewHistory', [])
          this.setData({ history: [] })
          tt.setNavigationBarTitle({ title: '浏览历史(0)' })
        }
      }
    })
  }
})
