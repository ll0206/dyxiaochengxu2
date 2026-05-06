const app = getApp()
const { CASE_DATA } = require('../../utils/case-data')
const { callServiceHotline } = require('../../utils/phone-call')
const { resolveImageUrl } = require('../../utils/image-url')

Page({
  data: {
    caseInfo: null,
    showCompare: false,
    isLiked: false,
    isFavorited: false,
    likeCount: 0
  },

  onLoad(options) {
    const index = parseInt(options.index || '0')
    const caseList = app.globalData.caseList.length > 0 ? app.globalData.caseList : CASE_DATA
    const caseInfo = caseList[index] || null
    if (caseInfo) {
      // 写入浏览历史
      const history = tt.getStorageSync('viewHistory') || []
      const entry = { index: index, title: caseInfo.title, carModel: caseInfo.carModel, upgradeTarget: caseInfo.upgradeTarget, imageTheme: caseInfo.imageTheme, image: caseInfo.image, showFallback: caseInfo.showFallback, time: Date.now() }
      // 去重，最新放前面
      const filtered = history.filter(function(h) { return h.index !== index })
      tt.setStorageSync('viewHistory', [entry].concat(filtered).slice(0, 50))

      // 读取点赞/收藏状态
      var liked = tt.getStorageSync('liked_' + caseInfo.id)
      if (!liked) liked = false
      var favorited = tt.getStorageSync('favorite_' + caseInfo.id)
      if (!favorited) favorited = false
      var likeCount = tt.getStorageSync('likeCount_' + caseInfo.id)
      if (!likeCount) likeCount = 12

      var displayInfo = Object.assign({}, caseInfo, { image: resolveImageUrl(caseInfo.image) })
      this.setData({ caseInfo: displayInfo, isLiked: liked, isFavorited: favorited, likeCount: likeCount })
      tt.setNavigationBarTitle({ title: caseInfo.title })
    }
  },

  makeCall() {
    callServiceHotline(app.globalData.phone)
  },

  goBack() {
    tt.navigateBack()
  },

  onImageError() {
    if (!this.data.caseInfo) return
    this.setData({ 'caseInfo.showFallback': true })
  },

  toggleCompare() {
    this.setData({ showCompare: !this.data.showCompare })
  },

  toggleLike() {
    var caseInfo = this.data.caseInfo
    if (!caseInfo) return
    var newLiked = !this.data.isLiked
    var newCount = newLiked ? this.data.likeCount + 1 : this.data.likeCount - 1
    tt.setStorageSync('liked_' + caseInfo.id, newLiked)
    tt.setStorageSync('likeCount_' + caseInfo.id, newCount)
    this.setData({ isLiked: newLiked, likeCount: newCount })
  },

  toggleFavorite() {
    var caseInfo = this.data.caseInfo
    if (!caseInfo) return
    var newFav = !this.data.isFavorited
    tt.setStorageSync('favorite_' + caseInfo.id, newFav)
    this.setData({ isFavorited: newFav })

    // 更新收藏列表
    var favorites = tt.getStorageSync('favorites')
    if (!favorites) favorites = []
    if (newFav) {
      var idx = parseInt((this.options && this.options.index) || '0')
      var entry = { index: idx, id: caseInfo.id, title: caseInfo.title, carModel: caseInfo.carModel, upgradeTarget: caseInfo.upgradeTarget, imageTheme: caseInfo.imageTheme, image: caseInfo.image, showFallback: caseInfo.showFallback }
      favorites = favorites.filter(function(f) { return f.id !== caseInfo.id })
      favorites.unshift(entry)
    } else {
      favorites = favorites.filter(function(f) { return f.id !== caseInfo.id })
    }
    tt.setStorageSync('favorites', favorites)

    tt.showToast({ title: newFav ? '已收藏' : '已取消', icon: 'none' })
  },

  onShareAppMessage() {
    var caseInfo = this.data.caseInfo
    var idx = (this.options && this.options.index) || '0'
    return {
      title: caseInfo ? caseInfo.title : '车尚友汽车改装',
      path: '/pages/case-detail/case-detail?index=' + idx
    }
  },

  onShareTap() {
    tt.showShareMenu({ showShareItems: ['shareAppMessage'] })
    tt.showToast({ title: '点击右上角分享', icon: 'none' })
  }
})
