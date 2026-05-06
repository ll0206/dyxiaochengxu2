// 调用抖音云容器服务统一封装
// 域名：https://1m0m5xs1wbkeh-env-fPb3Y4TOOL.service.douyincloud.run

const CONTAINER_SERVICE_URL = 'https://1m0m5xs1wbkeh-env-fPb3Y4TOOL.service.douyincloud.run'

/**
 * 封装容器服务调用
 * @param {string} path - 接口路径
 * @param {string} method - GET / POST
 * @param {object} data - 请求数据
 * @param {object} header - 自定义请求头
 */
function callContainer({ path, method, data, header, success, fail }) {
  tt.cloud.callContainer({
    url: CONTAINER_SERVICE_URL + path,
    method: method || 'GET',
    data: data || {},
    header: header || { 'Content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode === 200 && typeof res.data === 'string') {
        try {
          const parsed = JSON.parse(res.data)
          success && success(parsed)
        } catch (e) {
          success && success(res.data)
        }
      } else {
        success && success(res)
      }
    },
    fail: function (err) {
      console.error('容器服务调用失败:', path, err)
      fail && fail(err)
    }
  })
}

/**
 * 获取用户 OpenID（免登录）
 * 抖音云网关自动将 OpenID 注入请求头 X-TT-OPENID
 */
function getOpenID(callback) {
  callContainer({
    path: '/api/get_open_id',
    method: 'GET',
    success: callback,
    fail: callback
  })
}

/**
 * 敏感词检测
 */
function checkSensitiveWord(text, callback) {
  callContainer({
    path: '/api/antidirt',
    method: 'POST',
    data: { text: text },
    success: callback,
    fail: callback
  })
}

module.exports = {
  callContainer,
  getOpenID,
  checkSensitiveWord
}
