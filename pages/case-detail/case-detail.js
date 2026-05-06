const app = getApp()
const { CASE_DATA } = require('../../utils/case-data')
const { callServiceHotline } = require('../../utils/phone-call')
const { resolveImageUrl } = require('../../utils/image-url')
const api = require('../../utils/api')

Page({
  data: {
    caseInfo: null,
    isLiked: false,
    isFavorited: false,
    likeCount: 0,
    loading: true,
    caseReviews: []
  },

  onLoad(options) {
    var index = parseInt(options.index || '0')
    var source = options.source || 'local'
    var self = this

    if (source === 'server') {
      // 从服务端加载详情
      var caseId = options.id || ''
      if (caseId) {
        api.getCaseDetail(caseId)
          .then(function (data) {
            var info = {
              id: data.id || data.caseId,
              title: data.title,
              image: data.coverImage || data.image,
              brand: data.brand,
              category: data.category || '外观',
              description: data.description || '',
              carModel: data.carModel || '',
              upgradeTarget: data.upgradeTarget || '',
              tags: data.tags || [],
              parts: data.parts || [],
              installType: data.installType || '',
              oldParts: data.oldParts || '',
              paintInfo: data.paintInfo || '',
              price: data.price || ''
            }
            self._loadDetailState(info)
          })
          .catch(function () {
            // 降级为本地数据
            self._loadFromLocal(index)
          })
      } else {
        self._loadFromLocal(index)
      }
    } else {
      self._loadFromLocal(index)
    }
  },

  _loadDetailState(caseInfo) {
    // 写入浏览历史
    var history = tt.getStorageSync('viewHistory') || []
    var entry = { id: caseInfo.id, title: caseInfo.title, carModel: caseInfo.carModel, upgradeTarget: caseInfo.upgradeTarget, image: caseInfo.image, time: Date.now() }
    var filtered = history.filter(function(h) { return (h.id || h.index) !== caseInfo.id })
    tt.setStorageSync('viewHistory', [entry].concat(filtered).slice(0, 50))

    // 记录浏览（服务端）
    if (api.isLoggedIn() && caseInfo.id) {
      api.recordView(caseInfo.id).catch(function () {})
    }

    var liked = tt.getStorageSync('liked_' + caseInfo.id) || false
    var favorited = tt.getStorageSync('favorite_' + caseInfo.id) || false
    var likeCount = tt.getStorageSync('likeCount_' + caseInfo.id) || (caseInfo.likeCount || 12)

    var displayInfo = Object.assign({}, caseInfo, { image: resolveImageUrl(caseInfo.image) })
    this.setData({ caseInfo: displayInfo, isLiked: liked, isFavorited: favorited, likeCount: likeCount, loading: false })
    tt.setNavigationBarTitle({ title: caseInfo.title })
    // 加载案例评价
    this._loadCaseReviews(caseInfo)
  },

  _loadCaseReviews(caseInfo) {
    var self = this
    if (api.isLoggedIn()) {
      api.getReviews({ caseId: caseInfo.id }, 1)
        .then(function (data) {
          var reviews = (data && data.list) || []
          self.setData({ caseReviews: reviews })
        })
        .catch(function () {
          self._loadLocalReviews(caseInfo)
        })
    } else {
      this._loadLocalReviews(caseInfo)
    }
  },

  _loadLocalReviews(caseInfo) {
    // 降级：展示示例评价
    var reviews = [
      { id: 1, nicknameIcon: '张', nickname: '张**', stars: '★★★★★', content: '施工非常专业，老款改新款效果很好，朋友都说好看', carModel: caseInfo.carModel || '', timeText: '05-02 14:30' },
      { id: 2, nicknameIcon: '李', nickname: '李**', stars: '★★★★★', content: '技师态度很好，施工速度快，质量不错', carModel: '', timeText: '04-28 10:15' }
    ]
    this.setData({ caseReviews: reviews })
  },

  goWriteReview() {
    if (!api.isLoggedIn()) {
      tt.navigateTo({ url: '/pages/profile/login' })
    } else {
      tt.navigateTo({ url: '/pages/review/submit-review' })
    }
  },

  _loadFromLocal(index) {
    var caseList = app.globalData.caseList.length > 0 ? app.globalData.caseList : CASE_DATA
    var caseInfo = caseList[index] || null
    if (!caseInfo) {
      this.setData({ loading: false })
      return
    }
    this._loadDetailState(caseInfo)
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

  toggleLike() {
    var caseInfo = this.data.caseInfo
    if (!caseInfo || !caseInfo.id) return
    var self = this

    if (api.isLoggedIn()) {
      api.toggleLike(caseInfo.id)
        .then(function (data) {
          var newLiked = data && data.liked !== undefined ? data.liked : !self.data.isLiked
          var newCount = data && data.likeCount !== undefined ? data.likeCount : (newLiked ? self.data.likeCount + 1 : self.data.likeCount - 1)
          tt.setStorageSync('liked_' + caseInfo.id, newLiked)
          tt.setStorageSync('likeCount_' + caseInfo.id, newCount)
          self.setData({ isLiked: newLiked, likeCount: newCount })
        })
        .catch(function () {
          // 降级为本地逻辑
          self._toggleLikeLocal()
        })
    } else {
      this._toggleLikeLocal()
    }
  },

  _toggleLikeLocal() {
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
    var self = this

    if (api.isLoggedIn()) {
      api.toggleFavorite(caseInfo.id)
        .then(function (data) {
          var newFav = data && data.favorited !== undefined ? data.favorited : !self.data.isFavorited
          tt.setStorageSync('favorite_' + caseInfo.id, newFav)
          self.setData({ isFavorited: newFav })
          // 更新本地收藏列表
          var favorites = tt.getStorageSync('favorites') || []
          if (newFav) {
            favorites = favorites.filter(function(f) { return f.id !== caseInfo.id })
            favorites.unshift(caseInfo)
          } else {
            favorites = favorites.filter(function(f) { return f.id !== caseInfo.id })
          }
          tt.setStorageSync('favorites', favorites)
          tt.showToast({ title: newFav ? '已收藏' : '已取消', icon: 'none' })
        })
        .catch(function () {
          self._toggleFavoriteLocal()
        })
    } else {
      this._toggleFavoriteLocal()
    }
  },

  _toggleFavoriteLocal() {
    var caseInfo = this.data.caseInfo
    if (!caseInfo) return
    var newFav = !this.data.isFavorited
    tt.setStorageSync('favorite_' + caseInfo.id, newFav)
    this.setData({ isFavorited: newFav })

    var favorites = tt.getStorageSync('favorites') || []
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
