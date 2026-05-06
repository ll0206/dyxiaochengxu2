/**
 * 优惠券默认数据与本地「已使用」状态合并（与个人中心、优惠券页共用）
 */
const DEFAULT_COUPONS = [
  { id: 1, title: '老改新满减券', desc: '满10000减500', displayValue: '¥500', condition: '满¥10,000可用', expire: '2026-12-31' },
  { id: 2, title: '内饰翻新折扣券', desc: '8.8折优惠', displayValue: '8.8折', condition: '无门槛', expire: '2026-09-30' },
  { id: 3, title: '首次预约券', desc: '到店检查免费', displayValue: '免费', condition: '首次预约可用', expire: '2026-08-31' }
]

const STORAGE_KEY = 'couponsUsedMap'

function getUsedMap() {
  return tt.getStorageSync(STORAGE_KEY) || {}
}

function mergeCouponsWithStorage() {
  const usedMap = getUsedMap()
  return DEFAULT_COUPONS.map(function (c) {
    return Object.assign({}, c, { used: !!usedMap[c.id] })
  })
}

function getAvailableCouponCount() {
  const usedMap = getUsedMap()
  var n = 0
  for (var i = 0; i < DEFAULT_COUPONS.length; i++) {
    if (!usedMap[DEFAULT_COUPONS[i].id]) n++
  }
  return n
}

function markCouponUsed(id) {
  const usedMap = getUsedMap()
  usedMap[id] = true
  tt.setStorageSync(STORAGE_KEY, usedMap)
}

module.exports = {
  DEFAULT_COUPONS,
  STORAGE_KEY,
  mergeCouponsWithStorage,
  getAvailableCouponCount,
  markCouponUsed
}
