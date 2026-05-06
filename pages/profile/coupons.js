const { mergeCouponsWithStorage, markCouponUsed, getAvailableCouponCount } = require('../../utils/coupons-helper')

Page({
  data: {
    coupons: []
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    var list = mergeCouponsWithStorage()
    tt.setNavigationBarTitle({ title: '优惠券(' + getAvailableCouponCount() + ')' })
    this.setData({ coupons: list })
  },

  onUse(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var item = this.data.coupons[index]
    if (!item || item.used) return
    var self = this
    tt.showModal({
      title: '确认使用该券？',
      content: '标记为已使用后仍可向店员说明优惠内容；到店出示页面即可。',
      success: function (res) {
        if (!res.confirm) return
        markCouponUsed(item.id)
        self.refresh()
        tt.showToast({ title: '已标记使用', icon: 'success' })
      }
    })
  }
})
