/**
 * 案例图片地址：支持本地路径、完整 URL、七牛 CDN 前缀（app.globalData.imageCDNBase）
 * 七牛对象键建议与 path 去掉首 "/" 后一致，例如 images/cases/xxx.jpg（含中文文件名时对每段做编码）
 */

function resolveImageUrl(path) {
  if (path == null || path === '') return ''
  var s = String(path)
  if (/^https?:\/\//i.test(s)) return s

  var base = ''
  try {
    var app = getApp()
    base = (app && app.globalData && app.globalData.imageCDNBase) || ''
  } catch (e) {
    base = ''
  }
  base = String(base).trim()
  if (!base) return s

  var p = s.replace(/^\/+/, '')
  var parts = p.split('/')
  var encoded = []
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] !== '') encoded.push(encodeURIComponent(parts[i]))
  }
  return base.replace(/\/+$/, '') + '/' + encoded.join('/')
}

module.exports = {
  resolveImageUrl
}
