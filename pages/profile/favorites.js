const { resolveImageUrl } = require('../../utils/image-url')

Page({
  data: {
    favorites: []
  },

  onShow() {
    const raw = tt.getStorageSync('favorites') || []
    const favorites = raw.map(function (f) {
      return Object.assign({}, f, { image: resolveImageUrl(f.image) })
    })
    this.setData({ favorites })
    tt.setNavigationBarTitle({ title: `我的收藏(${favorites.length})` })
  },

  onTapCase(e) {
    const index = e.currentTarget.dataset.index
    tt.navigateTo({ url: `/pages/case-detail/case-detail?index=${index}` })
  },

  onImageError(e) {
    const index = e.currentTarget.dataset.index
    const key = `favorites[${index}].showFallback`
    this.setData({ [key]: true })
  },

  onRemove(e) {
    const id = e.currentTarget.dataset.id
    tt.setStorageSync(`favorite_${id}`, false)
    let next = tt.getStorageSync('favorites') || []
    next = next.filter(function (f) {
      return f.id !== id
    })
    tt.setStorageSync('favorites', next)
    const favorites = next.map(function (f) {
      return Object.assign({}, f, { image: resolveImageUrl(f.image) })
    })
    this.setData({ favorites })
    tt.setNavigationBarTitle({ title: '我的收藏(' + favorites.length + ')' })
  }
})
