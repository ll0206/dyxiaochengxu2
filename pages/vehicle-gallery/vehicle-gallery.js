const app = getApp()
const { switchTab } = require('../../utils/util')
const { getGalleryData, resolveGalleryImageUrl } = require('../../utils/gallery-data')

function withResolvedUrls(groups) {
  return groups.map(function (group) {
    return Object.assign({}, group, {
      images: group.images.map(function (img) {
        return Object.assign({}, img, {
          resolvedUrl: resolveGalleryImageUrl(img.cdnPath)
        })
      })
    })
  })
}

Page({
  data: {
    filterBrand: 'all',     // all | bmw | benz | porsche
    filterType: 'all',      // all | 外观 | 内饰
    brands: [
      { key: 'all', name: '全部' },
      { key: 'bmw', name: '宝马' },
      { key: 'benz', name: '奔驰' },
      { key: 'porsche', name: '保时捷' }
    ],
    types: [
      { key: 'all', name: '全部' },
      { key: '外观', name: '外观' },
      { key: '内饰', name: '内饰' }
    ],
    // 展开的车型分组 key 集合
    expandedGroups: {},
    // 当前显示的车型分组列表（已预解析 CDN URL）
    modelGroups: [],
    // 图库总图片数
    totalImages: 0,
    // 图片加载错误记录
    imageErrors: {}
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '车型图库 - 车尚友' })
    this.applyFilters()
  },

  switchTab,

  onImageError(e) {
    const { groupIndex, imgIndex } = e.currentTarget.dataset
    const key = groupIndex + '_' + imgIndex
    var errors = Object.assign({}, this.data.imageErrors)
    errors[key] = true
    this.setData({ imageErrors: errors })
  },

  // 切换车型分组展开/收起
  onTapModelGroup(e) {
    var groupKey = e.currentTarget.dataset.groupKey
    var expanded = Object.assign({}, this.data.expandedGroups)
    if (expanded[groupKey]) {
      delete expanded[groupKey]
    } else {
      expanded[groupKey] = true
    }
    this.setData({ expandedGroups: expanded })
  },

  // 图片预览
  onTapImage(e) {
    var urlsStr = e.currentTarget.dataset.urlsStr
    var current = e.currentTarget.dataset.current
    if (urlsStr) {
      var urls = urlsStr.split(',')
      tt.previewImage({ current: current, urls: urls })
    }
  },

  onFilterBrand(e) {
    var brand = e.currentTarget.dataset.brand
    this.setData({ filterBrand: brand })
    this.applyFilters()
  },

  onFilterType(e) {
    var type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    this.applyFilters()
  },

  applyFilters() {
    var brand = this.data.filterBrand
    var type = this.data.filterType
    var allData = getGalleryData()
    var groups = allData.brands

    // 品牌筛选
    if (brand !== 'all') {
      groups = groups.filter(function (g) { return g.brand === brand })
    }
    // 类型筛选
    if (type !== 'all') {
      groups = groups.filter(function (g) { return g.typeName === type })
    }

    // 计算总数
    var total = 0
    for (var i = 0; i < groups.length; i++) {
      total += groups[i].images.length
    }

    // 预解析所有图片的 CDN URL
    groups = withResolvedUrls(groups)

    // 为每组预计算 URL 列表字符串（用于图片预览）
    for (var j = 0; j < groups.length; j++) {
      var urlList = []
      for (var k = 0; k < groups[j].images.length; k++) {
        urlList.push(groups[j].images[k].resolvedUrl)
      }
      groups[j]._urlListStr = urlList.join(',')
    }

    this.setData({
      modelGroups: groups,
      totalImages: total,
      expandedGroups: {},
      imageErrors: {}
    })
  }
})
