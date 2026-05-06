const { switchTab } = require('../../utils/util')
const { getAvailableCouponCount } = require('../../utils/coupons-helper')
const { PRIVACY_TERMS_AGREED_KEY } = require('../../utils/legal-constants')
const { callServiceHotline } = require('../../utils/phone-call')
const api = require('../../utils/api')

const STAGE_LABEL = {
  pending: '待接单',
  accepted: '已接单',
  in_progress: '施工中',
  qc: '质检中',
  done: '已完成'
}

function maskPhone(phone) {
  if (!phone || String(phone).length < 7) return ''
  var s = String(phone)
  return s.slice(0, 3) + '****' + s.slice(-4)
}

Page({
  data: {
    userInfo: null,
    carInfo: null,
    appointmentCount: 0,
    favoriteCount: 0,
    historyCount: 0,
    couponCount: 0,
    constructionStatus: null,
    constructionLabel: '',
    maskedPhone: '',
    avatarLetter: '尚'
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '个人中心' })
    // 检查登录状态
    if (!api.isLoggedIn()) {
      // 未登录，跳转登录页
      tt.redirectTo({ url: '/pages/profile/login' })
      return
    }
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  switchTab,

  loadUserData() {
    const appInst = getApp()
    const appointments = tt.getStorageSync('appointments') || []
    const favorites = tt.getStorageSync('favorites') || []
    const history = tt.getStorageSync('viewHistory') || []
    const construction = tt.getStorageSync('construction')
    var cLabel = ''
    if (construction && construction.stage) {
      cLabel = STAGE_LABEL[construction.stage] || construction.stage
    }

    var userInfo = tt.getStorageSync('userInfo')
    var carInfo = tt.getStorageSync('carInfo')
    var letter = '尚'
    if (userInfo && userInfo.nickname) {
      letter = String(userInfo.nickname).charAt(0) || '友'
    }

    // 尝试从服务端获取最新用户资料
    var self = this
    if (api.isLoggedIn()) {
      api.getUserProfile()
        .then(function (data) {
          if (data) {
            userInfo = data
            tt.setStorageSync('userInfo', data)
            if (data.nickname) {
              letter = String(data.nickname).charAt(0) || '友'
            }
            if (data.carInfo) {
              carInfo = data.carInfo
              tt.setStorageSync('carInfo', data.carInfo)
            }
          }
          self.setData({
            userInfo: userInfo,
            carInfo: carInfo,
            appointmentCount: appointments.length,
            favoriteCount: favorites.length,
            historyCount: history.length,
            couponCount: getAvailableCouponCount(),
            constructionStatus: construction,
            constructionLabel: cLabel,
            maskedPhone: maskPhone(appInst.globalData.phone),
            avatarLetter: letter
          })
        })
        .catch(function () {
          // 服务端不可用，使用本地数据
          self.setData({
            userInfo: userInfo,
            carInfo: carInfo,
            appointmentCount: appointments.length,
            favoriteCount: favorites.length,
            historyCount: history.length,
            couponCount: getAvailableCouponCount(),
            constructionStatus: construction,
            constructionLabel: cLabel,
            maskedPhone: maskPhone(appInst.globalData.phone),
            avatarLetter: letter
          })
        })
    } else {
      this.setData({
        userInfo: userInfo,
        carInfo: carInfo,
        appointmentCount: appointments.length,
        favoriteCount: favorites.length,
        historyCount: history.length,
        couponCount: getAvailableCouponCount(),
        constructionStatus: construction,
        constructionLabel: cLabel,
        maskedPhone: maskPhone(appInst.globalData.phone),
        avatarLetter: letter
      })
    }
  },

  onLogin() {
    // 统一跳转登录页
    tt.navigateTo({ url: '/pages/profile/login' })
  },

  goPrivacy() {
    tt.navigateTo({ url: '/pages/legal/privacy' })
  },

  goTerms() {
    tt.navigateTo({ url: '/pages/legal/terms' })
  },

  onClearLocalData() {
    tt.showModal({
      title: '清除本地数据',
      content: '将清除本设备上的预约记录、收藏、浏览历史、车辆信息、登录状态、优惠券标记、施工进度缓存及协议同意记录等，不可恢复。是否继续？',
      confirmText: '清除',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return
        try {
          tt.clearStorageSync()
        } catch (e) {
          tt.showToast({ title: '清除失败', icon: 'none' })
          return
        }
        var appInst = getApp()
        if (appInst && appInst.globalData) {
          appInst.globalData.caseList = []
        }
        this.loadUserData()
        tt.showToast({ title: '已清除本地数据', icon: 'none' })
      }
    })
  },

  goCarProfile() {
    tt.navigateTo({ url: '/pages/profile/car-profile' })
  },

  goAppointments() {
    tt.navigateTo({ url: '/pages/profile/appointments' })
  },

  goFavorites() {
    tt.navigateTo({ url: '/pages/profile/favorites' })
  },

  goHistory() {
    tt.navigateTo({ url: '/pages/profile/history' })
  },

  goConstruction() {
    tt.navigateTo({ url: '/pages/profile/construction' })
  },

  goCoupons() {
    tt.navigateTo({ url: '/pages/profile/coupons' })
  },

  makeCall() {
    callServiceHotline(getApp().globalData.phone)
  },

  goAbout() {
    tt.navigateTo({ url: '/pages/about/about' })
  },

  goContact() {
    tt.navigateTo({ url: '/pages/contact/contact' })
  },

  goBusiness(e) {
    const type = e.currentTarget.dataset.type
    tt.navigateTo({ url: '/pages/business/business?type=' + type })
  },

  goMessages() {
    tt.navigateTo({ url: '/pages/messages/messages' })
  },

  goReviews() {
    tt.navigateTo({ url: '/pages/review/submit-review' })
  },

  goTeam() {
    tt.navigateTo({ url: '/pages/team/team' })
  },

  goWorkshop() {
    tt.navigateTo({ url: '/pages/workshop/workshop' })
  },

  goFAQ() {
    tt.navigateTo({ url: '/pages/faq/faq' })
  }
})
