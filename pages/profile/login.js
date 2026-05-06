const { switchTab } = require('../../utils/util')
const { PRIVACY_TERMS_AGREED_KEY } = require('../../utils/legal-constants')
const api = require('../../utils/api')

Page({
  data: {
    agreed: false,
    loading: false,
    errorMsg: ''
  },

  switchTab,

  onLoad(options) {
    tt.setNavigationBarTitle({ title: '登录' })
    // 如果已同意隐私协议，直接尝试登录
    if (tt.getStorageSync(PRIVACY_TERMS_AGREED_KEY)) {
      this.setData({ agreed: true })
      this.doLogin()
    }
  },

  onToggleAgree(e) {
    this.setData({ agreed: e.detail.value })
  },

  goPrivacy() {
    tt.navigateTo({ url: '/pages/legal/privacy' })
  },

  goTerms() {
    tt.navigateTo({ url: '/pages/legal/terms' })
  },

  onLoginTap() {
    if (!this.data.agreed) {
      tt.showModal({
        title: '用户协议与隐私保护',
        content: '登录即表示您已阅读并同意《隐私政策》和《用户服务协议》',
        confirmText: '同意并登录',
        cancelText: '去阅读',
        success: (res) => {
          if (res.confirm) {
            tt.setStorageSync(PRIVACY_TERMS_AGREED_KEY, true)
            this.setData({ agreed: true })
            this.doLogin()
          } else {
            tt.navigateTo({ url: '/pages/legal/privacy' })
          }
        }
      })
      return
    }
    this.doLogin()
  },

  doLogin() {
    if (this.data.loading) return
    this.setData({ loading: true, errorMsg: '' })

    tt.login({
      success: (loginRes) => {
        if (!loginRes.code) {
          this.setData({ loading: false, errorMsg: '获取登录凭证失败' })
          return
        }
        // 优先尝试服务端登录
        api.douyinLogin(loginRes.code)
          .then((data) => {
            // 登录成功，获取用户信息
            this.fetchAndSaveUserInfo()
          })
          .catch((err) => {
            // 服务端不可用时降级为本地登录
            console.warn('服务端登录失败，使用本地模式:', err.message)
            this.fetchAndSaveUserInfo()
          })
      },
      fail: () => {
        this.setData({ loading: false, errorMsg: '登录失败，请重试' })
      }
    })
  },

  fetchAndSaveUserInfo() {
    tt.getUserInfo({
      success: (res) => {
        const userInfo = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
        }
        tt.setStorageSync('userInfo', userInfo)
        var letter = userInfo.nickname ? String(userInfo.nickname).charAt(0) : '友'
        // 设置登录状态
        this.setData({
          loading: false,
          userInfo: userInfo,
          avatarLetter: letter
        })
        tt.showToast({ title: '登录成功', icon: 'success' })
        // 延迟返回上一页
        setTimeout(() => {
          tt.navigateBack()
        }, 800)
      },
      fail: () => {
        this.setData({ loading: false, errorMsg: '获取用户信息失败' })
      }
    })
  },

  goBack() {
    tt.navigateBack()
  }
})
