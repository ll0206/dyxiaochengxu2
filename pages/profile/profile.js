const { switchTab } = require('../../utils/util')
const { getAvailableCouponCount } = require('../../utils/coupons-helper')
const { PRIVACY_TERMS_AGREED_KEY } = require('../../utils/legal-constants')
const { callServiceHotline } = require('../../utils/phone-call')

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
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  switchTab,

  loadUserData() {
    const appInst = getApp()
    const userInfo = tt.getStorageSync('userInfo')
    const carInfo = tt.getStorageSync('carInfo')
    const appointments = tt.getStorageSync('appointments') || []
    const favorites = tt.getStorageSync('favorites') || []
    const history = tt.getStorageSync('viewHistory') || []
    const construction = tt.getStorageSync('construction')
    var cLabel = ''
    if (construction && construction.stage) {
      cLabel = STAGE_LABEL[construction.stage] || construction.stage
    }

    var letter = '尚'
    if (userInfo && userInfo.nickname) {
      letter = String(userInfo.nickname).charAt(0) || '友'
    }

    this.setData({
      userInfo,
      carInfo,
      appointmentCount: appointments.length,
      favoriteCount: favorites.length,
      historyCount: history.length,
      couponCount: getAvailableCouponCount(),
      constructionStatus: construction,
      constructionLabel: cLabel,
      maskedPhone: maskPhone(appInst.globalData.phone),
      avatarLetter: letter
    })
  },

  onLogin() {
    if (!tt.getStorageSync(PRIVACY_TERMS_AGREED_KEY)) {
      tt.showModal({
        title: '用户协议与隐私保护',
        content: '使用头像、昵称展示前，请先阅读《隐私政策》和《用户服务协议》。点击「同意继续」表示您已阅读并同意。',
        confirmText: '同意继续',
        cancelText: '去阅读',
        success: (res) => {
          if (res.confirm) {
            tt.setStorageSync(PRIVACY_TERMS_AGREED_KEY, true)
            this.fetchUserProfile()
          } else {
            tt.navigateTo({ url: '/pages/legal/privacy' })
          }
        }
      })
      return
    }
    this.fetchUserProfile()
  },

  fetchUserProfile() {
    tt.getUserInfo({
      success: (res) => {
        const userInfo = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
        }
        tt.setStorageSync('userInfo', userInfo)
        var letter = userInfo.nickname ? String(userInfo.nickname).charAt(0) : '友'
        this.setData({ userInfo: userInfo, avatarLetter: letter })
      },
      fail: () => {
        tt.showToast({ title: '登录失败', icon: 'none' })
      }
    })
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
  }
})
