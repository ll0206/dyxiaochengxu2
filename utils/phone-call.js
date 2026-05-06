/**
 * 门店热线拨号：号码强制纯数字；失败时仅提示号码并提供复制
 */

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '')
}

function callServiceHotline(phoneOverride) {
  var app = getApp()
  var raw = normalizePhone(phoneOverride != null ? phoneOverride : (app && app.globalData && app.globalData.phone))
  if (!raw || raw.length < 7) {
    tt.showToast({ title: '电话号码无效', icon: 'none' })
    return
  }

  tt.makePhoneCall({
    phoneNumber: raw,
    fail: function () {
      tt.showModal({
        title: '暂无法直接拨号',
        content: '门店热线：' + raw,
        confirmText: '复制号码',
        cancelText: '关闭',
        success: function (r) {
          if (!r.confirm) return
          tt.setClipboardData({
            data: raw,
            success: function () {
              tt.showToast({ title: '号码已复制', icon: 'none' })
            },
            fail: function () {
              tt.showToast({ title: '复制失败，请手动记录号码', icon: 'none' })
            }
          })
        }
      })
    }
  })
}

module.exports = {
  normalizePhone,
  callServiceHotline
}
