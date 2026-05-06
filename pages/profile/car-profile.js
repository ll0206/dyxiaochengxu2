const { switchTab } = require('../../utils/util')
const BRANDS = ['宝马', '奔驰', '保时捷', '奥迪', '大众', '其他']
const api = require('../../utils/api')

Page({
  data: {
    carInfo: null,
    brands: BRANDS,
    brandIndex: -1,
    showBrandPicker: false,
    form: {
      brand: '',
      series: '',
      year: '',
      plate: ''
    }
  },

  onLoad() {
    var carInfo = tt.getStorageSync('carInfo')
    if (carInfo) {
      this.setData({
        carInfo,
        form: { brand: carInfo.brand, series: carInfo.series, year: carInfo.year, plate: carInfo.plate },
        brandIndex: BRANDS.indexOf(carInfo.brand)
      })
    }
  },

  switchTab,

  showBrandPicker() {
    this.setData({ showBrandPicker: true })
  },

  hideBrandPicker() {
    this.setData({ showBrandPicker: false })
  },

  onBrandSelect(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      brandIndex: index,
      'form.brand': BRANDS[index],
      showBrandPicker: false
    })
  },

  onInputSeries(e) {
    this.setData({ 'form.series': e.detail.value })
  },

  onInputYear(e) {
    this.setData({ 'form.year': e.detail.value })
  },

  onInputPlate(e) {
    this.setData({ 'form.plate': e.detail.value })
  },

  onSave() {
    var form = this.data.form
    if (!form.brand) {
      tt.showToast({ title: '请选择品牌', icon: 'none' })
      return
    }
    if (!form.series) {
      tt.showToast({ title: '请输入车系', icon: 'none' })
      return
    }
    var self = this
    // 先保存本地
    tt.setStorageSync('carInfo', form)
    this.setData({ carInfo: form })
    // 同步到服务端
    if (api.isLoggedIn()) {
      api.updateUserProfile('', '')
        .then(function () {
          tt.showToast({ title: '保存成功', icon: 'success' })
          setTimeout(function () { tt.navigateBack() }, 1000)
        })
        .catch(function () {
          tt.showToast({ title: '保存成功', icon: 'success' })
          setTimeout(function () { tt.navigateBack() }, 1000)
        })
    } else {
      tt.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(function () { tt.navigateBack() }, 1000)
    }
  }
})
