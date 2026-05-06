/**
 * 小程序 API 请求封装
 * 自动带 token、401 自动刷新、错误提示
 */

var BASE_URL = 'https://1m0m5xs1wbkeh-env-fPb3Y4TOOL.service.douyincloud.run' // 抖音云容器服务地址

// 获取 token
function getToken() {
  try {
    return tt.getStorageSync('csy_token') || ''
  } catch (e) {
    return ''
  }
}

// 保存 token
function setToken(token) {
  tt.setStorageSync('csy_token', token)
}

// 保存 refresh token
function setRefreshToken(token) {
  tt.setStorageSync('csy_refresh_token', token)
}

// 获取 refresh token
function getRefreshToken() {
  try {
    return tt.getStorageSync('csy_refresh_token') || ''
  } catch (e) {
    return ''
  }
}

// 清除登录信息
function clearAuth() {
  tt.removeStorageSync('csy_token')
  tt.removeStorageSync('csy_refresh_token')
}

// 刷新 token
function refreshToken() {
  var refToken = getRefreshToken()
  if (!refToken) {
    clearAuth()
    return Promise.reject(new Error('no_refresh_token'))
  }

  return new Promise(function (resolve, reject) {
    tt.request({
      url: BASE_URL + '/api/auth/refresh',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { refreshToken: refToken },
      success: function (res) {
        if (res.data && res.data.code === 0 && res.data.data) {
          setToken(res.data.data.token)
          setRefreshToken(res.data.data.refreshToken)
          resolve(res.data.data.token)
        } else {
          clearAuth()
          reject(new Error('refresh_failed'))
        }
      },
      fail: function () {
        clearAuth()
        reject(new Error('refresh_failed'))
      }
    })
  })
}

// 核心请求方法
function request(options) {
  var url = BASE_URL + options.url
  var method = options.method || 'GET'
  var header = options.header || {}
  var data = options.data || {}

  header['Content-Type'] = 'application/json'

  // 自动带 token
  var token = getToken()
  if (token) {
    header['Authorization'] = 'Bearer ' + token
  }

  return new Promise(function (resolve, reject) {
    tt.request({
      url: url,
      method: method,
      header: header,
      data: data,
      success: function (res) {
        if (res.statusCode === 200 && res.data) {
          // 401 需要刷新 token
          if (res.data.code === 401) {
            refreshToken()
              .then(function (newToken) {
                // 重试原请求
                header['Authorization'] = 'Bearer ' + newToken
                tt.request({
                  url: url,
                  method: method,
                  header: header,
                  data: data,
                  success: function (res2) {
                    if (res2.data && res2.data.code === 0) {
                      resolve(res2.data.data, res2.data.meta)
                    } else {
                      showToast(res2.data.message || '请求失败')
                      reject(new Error(res2.data.message))
                    }
                  },
                  fail: function () {
                    showToast('网络异常，请检查网络')
                    reject(new Error('network_error'))
                  }
                })
              })
              .catch(function () {
                showToast('登录已过期，请重新登录')
                reject(new Error('auth_expired'))
              })
            return
          }

          if (res.data.code === 0) {
            resolve(res.data.data, res.data.meta)
          } else {
            showToast(res.data.message || '请求失败')
            reject(new Error(res.data.message))
          }
        } else {
          showToast('服务器异常')
          reject(new Error('server_error'))
        }
      },
      fail: function () {
        showToast('网络异常，请检查网络')
        reject(new Error('network_error'))
      }
    })
  })
}

// 提示
function showToast(message) {
  tt.showToast({ title: message, icon: 'none', duration: 2000 })
}

// ========== 便捷方法 ==========

// 抖音登录
function douyinLogin(code) {
  return request({ url: '/api/auth/douyin-login', method: 'POST', data: { code: code } })
    .then(function (data) {
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      return data
    })
}

// 绑定手机号
function bindPhone(encryptedData, iv) {
  return request({ url: '/api/auth/bind-phone', method: 'POST', data: { encryptedData: encryptedData, iv: iv } })
}

// 获取用户资料
function getUserProfile() {
  return request({ url: '/api/user/profile', method: 'GET' })
}

// 更新用户资料
function updateUserProfile(nickname, avatarUrl) {
  return request({ url: '/api/user/profile', method: 'PUT', data: { nickname: nickname, avatarUrl: avatarUrl } })
}

// 登出
function logout() {
  return request({ url: '/api/auth/logout', method: 'POST' }).then(function () {
    clearAuth()
  }).catch(function () {
    clearAuth()
  })
}

// 预约
function createAppointment(data) {
  return request({ url: '/api/appointments', method: 'POST', data: data })
}

function getAppointments(page) {
  return request({ url: '/api/appointments', method: 'GET', data: { page: page || 1 } })
}

// 案例
function getCases(filters, page) {
  var data = { page: page || 1 }
  if (filters) {
    if (filters.brand) data.brand = filters.brand
    if (filters.category) data.category = filters.category
    if (filters.keyword) data.keyword = filters.keyword
  }
  return request({ url: '/api/cases', method: 'GET', data: data })
}

function getCaseDetail(id) {
  return request({ url: '/api/cases/' + id, method: 'GET' })
}

// 收藏
function toggleFavorite(caseId) {
  return request({ url: '/api/cases/' + caseId + '/favorite', method: 'POST' })
}

function getFavorites(page) {
  return request({ url: '/api/user/favorites', method: 'GET', data: { page: page || 1 } })
}

// 点赞
function toggleLike(caseId) {
  return request({ url: '/api/cases/' + caseId + '/like', method: 'POST' })
}

// 浏览历史
function getHistory(page) {
  return request({ url: '/api/user/history', method: 'GET', data: { page: page || 1 } })
}

function clearHistory() {
  return request({ url: '/api/user/history', method: 'DELETE' })
}

// 记录浏览
function recordView(caseId) {
  return request({ url: '/api/cases/' + caseId + '/view', method: 'POST' }).catch(function () {})
}

// 检查是否已登录
function isLoggedIn() {
  return !!getToken()
}

// 获取施工状态
function getConstructionStatus() {
  return request({ url: '/api/construction/status', method: 'GET' })
}

// 评价列表
function getReviews(filters, page) {
  var data = { page: page || 1 }
  if (filters) {
    if (filters.brand) data.brand = filters.brand
    if (filters.caseId) data.caseId = filters.caseId
  }
  return request({ url: '/api/reviews', method: 'GET', data: data })
}

// 提交评价
function submitReview(data) {
  return request({ url: '/api/reviews', method: 'POST', data: data })
}

// 获取我的评价
function getMyReviews(page) {
  return request({ url: '/api/user/reviews', method: 'GET', data: { page: page || 1 } })
}

// 获取 Banner 列表
function getBanners() {
  return request({ url: '/api/banners', method: 'GET' })
}

// 获取优惠券列表
function getCoupons() {
  return request({ url: '/api/coupons', method: 'GET' })
}

// 获取消息列表
function getMessages(page) {
  return request({ url: '/api/messages', method: 'GET', data: { page: page || 1 } })
}

// 获取未读消息数
function getUnreadMessageCount() {
  return request({ url: '/api/messages/unread-count', method: 'GET' })
}

module.exports = {
  request: request,
  douyinLogin: douyinLogin,
  bindPhone: bindPhone,
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile,
  logout: logout,
  createAppointment: createAppointment,
  getAppointments: getAppointments,
  getCases: getCases,
  getCaseDetail: getCaseDetail,
  toggleFavorite: toggleFavorite,
  getFavorites: getFavorites,
  toggleLike: toggleLike,
  getHistory: getHistory,
  clearHistory: clearHistory,
  recordView: recordView,
  isLoggedIn: isLoggedIn,
  clearAuth: clearAuth,
  getConstructionStatus: getConstructionStatus,
  getReviews: getReviews,
  submitReview: submitReview,
  getMyReviews: getMyReviews,
  getBanners: getBanners,
  getCoupons: getCoupons,
  getMessages: getMessages,
  getUnreadMessageCount: getUnreadMessageCount
}
