const BRANDS = ['宝马', '奔驰', '保时捷', '奥迪', '大众', '其他']

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
    const carInfo = tt.getStorageSync('carInfo')
    if (carInfo) {
      this.setData({
        carInfo,
        form: { brand: carInfo.brand, series: carInfo.series, year: carInfo.year, plate: carInfo.plate },
        brandIndex: BRANDS.indexOf(carInfo.brand)
      })
    }
  },

  showBrandPicker() {
    this.setData({ showBrandPicker: true })
  },

  hideBrandPicker() {
    this.setData({ showBrandPicker: false })
  },

  onBrandSelect(e) {
    const index = parseInt(e.currentTarget.dataset.index)
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
    const { form } = this.data
    if (!form.brand) {
      tt.showToast({ title: '请选择品牌', icon: 'none' })
      return
    }
    if (!form.series) {
      tt.showToast({ title: '请输入车系', icon: 'none' })
      return
    }
    tt.setStorageSync('carInfo', form)
    this.setData({ carInfo: form })
    tt.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => tt.navigateBack(), 1000)
  }
})
