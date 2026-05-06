const { switchTab } = require('../../utils/util')
const api = require('../../utils/api')
const SERVICE_ITEMS = ['老改新外观升级', '迈巴赫风格升级', 'AMG/M运动升级', '无损安装', '切割钣金', '喷漆服务', '内饰翻新', '其他服务']

Page({
  data: {
    loading: false,
    errorMsg: '',
    form: {
      carModel: '',
      serviceItem: '',
      rating: 5,
      content: '',
      images: []
    },
    serviceItems: SERVICE_ITEMS,
    showServicePicker: false,
    serviceIndex: -1,
    maxImages: 9
  },

  switchTab,

  onLoad() {
    tt.setNavigationBarTitle({ title: '写评价' })
    if (!api.isLoggedIn()) {
      tt.showModal({
        title: '提示',
        content: '请先登录后再评价',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            tt.navigateTo({ url: '/pages/profile/login' })
          }
        }
      })
    }
  },

  onInputCarModel(e) {
    this.setData({ 'form.carModel': e.detail.value })
  },

  onInputContent(e) {
    this.setData({ 'form.content': e.detail.value })
  },

  showServicePickerFn() {
    this.setData({ showServicePicker: true })
  },

  hideServicePicker() {
    this.setData({ showServicePicker: false })
  },

  onServiceSelect(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      serviceIndex: index,
      'form.serviceItem': SERVICE_ITEMS[index],
      showServicePicker: false
    })
  },

  onRatingChange(e) {
    this.setData({ 'form.rating': e.detail.value })
  },

  onTapStar(e) {
    var rating = parseInt(e.currentTarget.dataset.rating)
    this.setData({ 'form.rating': rating })
  },

  onAddImage() {
    var self = this
    var remaining = this.data.maxImages - this.data.form.images.length
    if (remaining <= 0) {
      tt.showToast({ title: '最多上传9张图片', icon: 'none' })
      return
    }
    tt.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var images = self.data.form.images.concat(res.tempFilePaths)
        self.setData({ 'form.images': images })
      }
    })
  },

  onRemoveImage(e) {
    var index = e.currentTarget.dataset.index
    var images = this.data.form.images.filter(function (_, i) { return i !== index })
    this.setData({ 'form.images': images })
  },

  onSubmit() {
    var form = this.data.form
    if (!form.carModel) {
      tt.showToast({ title: '请输入车型', icon: 'none' })
      return
    }
    if (!form.serviceItem) {
      tt.showToast({ title: '请选择服务项目', icon: 'none' })
      return
    }
    if (!form.content) {
      tt.showToast({ title: '请输入评价内容', icon: 'none' })
      return
    }

    var self = this
    this.setData({ loading: true, errorMsg: '' })

    var reviewData = {
      carModel: form.carModel,
      serviceItem: form.serviceItem,
      rating: form.rating,
      content: form.content,
      imageCount: form.images.length
    }

    api.submitReview(reviewData)
      .then(function () {
        tt.showToast({ title: '评价提交成功', icon: 'success' })
        setTimeout(function () {
          tt.navigateBack()
        }, 800)
      })
      .catch(function (err) {
        // 降级：保存到本地
        console.warn('服务端提交失败，保存到本地:', err.message)
        var localReviews = tt.getStorageSync('localReviews') || []
        localReviews.unshift(Object.assign({}, reviewData, {
          id: Date.now(),
          createTime: Date.now(),
          status: 'pending'
        }))
        tt.setStorageSync('localReviews', localReviews)
        self.setData({ loading: false })
        tt.showToast({ title: '评价已保存（离线模式）', icon: 'success' })
        setTimeout(function () {
          tt.navigateBack()
        }, 800)
      })
  }
})
