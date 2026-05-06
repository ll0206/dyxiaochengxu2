Page({
  data: {
    companyName: '',
    phone: '',
    address: '',
    businessHours: ''
  },

  onLoad() {
    var app = getApp()
    this.setData({
      companyName: app.globalData.companyName,
      phone: app.globalData.phone,
      address: app.globalData.address,
      businessHours: app.globalData.businessHours
    })
  }
})
