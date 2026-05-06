const { resolveImageUrl } = require('../../utils/image-url')
const api = require('../../utils/api')

Page({
  data: {
    favorites: [],
    loading: true,
    useLocalData: true
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    var self = this
    if (api.isLoggedIn()) {
      api.getFavorites(1)
        .then(function (data) {
          var list = (data && data.list) || []
          var favorites = list.map(function (f) {
            return Object.assign({}, f, {
              image: resolveImageUrl(f.coverImage || f.image || ''),
              index: f.index || 0
            })
          })
          self.setData({ favorites: favorites, loading: false, useLocalData: false })
          tt.setNavigationBarTitle({ title: '我的收藏(' + favorites.length + ')' })
        })
        .catch(function () {
          self._loadLocal()
        })
    } else {
      this._loadLocal()
    }
  },

  _loadLocal() {
    var raw = tt.getStorageSync('favorites') || []
    var favorites = raw.map(function (f) {
      return Object.assign({}, f, { image: resolveImageUrl(f.image) })
    })
    this.setData({ favorites: favorites, loading: false, useLocalData: true })
    tt.setNavigationBarTitle({ title: '我的收藏(' + favorites.length + ')' })
  },

  onTapCase(e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var source = this.data.useLocalData ? 'local' : 'server'
    var url = '/pages/case-detail/case-detail?index=' + index + '&source=' + source
    if (id) url += '&id=' + id
    tt.navigateTo({ url: url })
  },

  onImageError(e) {
    var index = e.currentTarget.dataset.index
    var key = 'favorites[' + index + '].showFallback'
    this.setData({ [key]: true })
  },

  onRemove(e) {
    var id = e.currentTarget.dataset.id
    var self = this

    if (api.isLoggedIn()) {
      api.toggleFavorite(id)
        .then(function () {
          var next = tt.getStorageSync('favorites') || []
          next = next.filter(function (f) { return f.id !== id })
          tt.setStorageSync('favorites', next)
          tt.setStorageSync('favorite_' + id, false)
          self._loadLocal()
        })
        .catch(function () {
          self._removeLocal(id)
        })
    } else {
      this._removeLocal(id)
    }
  },

  _removeLocal(id) {
    tt.setStorageSync('favorite_' + id, false)
    var next = tt.getStorageSync('favorites') || []
    next = next.filter(function (f) { return f.id !== id })
    tt.setStorageSync('favorites', next)
    this._loadLocal()
  }
})
