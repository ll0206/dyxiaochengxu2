const app = getApp()
const { switchTab } = require('../../utils/util')
const { CASE_DATA } = require('../../utils/case-data')
const { callServiceHotline } = require('../../utils/phone-call')
const { resolveImageUrl } = require('../../utils/image-url')
const api = require('../../utils/api')

function withResolvedImages(list) {
  return list.map(function (item) {
    var isInterior = item.image.indexOf('neishi') !== -1
    return Object.assign({}, item, {
      image: resolveImageUrl(item.image),
      category: isInterior ? '内饰' : '外观'
    })
  })
}

Page({
  data: {
    caseList: [],
    computedCaseList: [],
    filterBrand: 'all',
    filterType: 'all',
    brands: ['全部', '宝马', '奔驰', '保时捷'],
    types: ['全部', '外观', '内饰'],
    searchKeyword: '',
    loading: true,
    useLocalData: false
  },

  onLoad(options) {
    tt.setNavigationBarTitle({ title: '实拍案例 - 车尚友' })
    var kw = ''
    if (options && options.keyword) {
      try {
        kw = decodeURIComponent(options.keyword)
      } catch (e) {
        kw = options.keyword
      }
    }
    this.setData({ searchKeyword: kw })
    this.loadCases(kw)
  },

  switchTab,

  loadCases(keyword) {
    var self = this
    self.setData({ loading: true })
    api.getCases({ brand: null, category: null, keyword: keyword || '' }, 1)
      .then(function (data) {
        var list = (data && data.list) || []
        // 服务端返回的数据可能需要适配格式
        var adapted = list.map(function (item) {
          return {
            id: item.id || item.caseId,
            title: item.title,
            image: item.coverImage || item.image || '',
            brand: item.brand,
            category: item.category || '外观',
            description: item.description || '',
            carModel: item.carModel || '',
            upgradeTarget: item.upgradeTarget || '',
            tags: item.tags || [],
            parts: item.parts || [],
            installType: item.installType || '',
            oldParts: item.oldParts || '',
            paintInfo: item.paintInfo || '',
            price: item.price || ''
          }
        })
        self.setData({
          caseList: adapted,
          computedCaseList: adapted,
          loading: false,
          useLocalData: false
        })
      })
      .catch(function () {
        // 降级为本地数据
        console.warn('案例API请求失败，使用本地数据')
        app.globalData.caseList = CASE_DATA
        self.setData({
          caseList: CASE_DATA,
          loading: false,
          useLocalData: true
        })
        self.applyFilters(CASE_DATA, keyword)
      })
  },

  onTapCase(e) {
    const id = e.currentTarget.dataset.id
    var sourceList = this.data.useLocalData ? CASE_DATA : this.data.caseList
    // 找到索引位置
    var caseIndex = 0
    for (var i = 0; i < sourceList.length; i++) {
      if (sourceList[i].id === id) {
        caseIndex = i
        break
      }
    }
    tt.navigateTo({ url: '/pages/case-detail/case-detail?index=' + caseIndex + (this.data.useLocalData ? '&source=local' : '&source=server') })
  },

  makeCall() {
    callServiceHotline(app.globalData.phone)
  },

  onImageError(e) {
    const index = e.currentTarget.dataset.index
    const key = `computedCaseList[${index}].showFallback`
    this.setData({ [key]: true })
  },

  applyFilters(sourceList, keywordFromRoute) {
    var brand = this.data.filterBrand
    var type = this.data.filterType
    var kw
    if (keywordFromRoute !== undefined) {
      kw = String(keywordFromRoute || '').trim().toLowerCase()
    } else {
      kw = (this.data.searchKeyword || '').trim().toLowerCase()
    }
    var list = sourceList
    if (brand !== 'all') {
      list = list.filter(function (item) {
        return item.brand && item.brand.indexOf(brand) !== -1
      })
    }
    if (type !== 'all') {
      list = list.filter(function (item) {
        return (item.category || (item.image && item.image.indexOf('neishi') !== -1 ? '内饰' : '外观')) === type
      })
    }
    if (kw) {
      list = list.filter(function (item) {
        var hay = ((item.title || '') + (item.description || '') + (item.carModel || '') + (item.upgradeTarget || '') + (item.brand || '')).toLowerCase()
        return hay.indexOf(kw) !== -1
      })
    }
    var resolvedList = this.data.useLocalData ? withResolvedImages(list) : list
    this.setData({ computedCaseList: resolvedList })
  },

  onSearchInput(e) {
    var kw = e.detail.value
    this.setData({ searchKeyword: kw })
    var source = this.data.useLocalData ? CASE_DATA : this.data.caseList
    this.applyFilters(source)
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' })
    var source = this.data.useLocalData ? CASE_DATA : this.data.caseList
    this.applyFilters(source)
  },

  onFilterBrand(e) {
    const brand = e.currentTarget.dataset.brand
    this.setData({ filterBrand: brand })
    var source = this.data.useLocalData ? CASE_DATA : this.data.caseList
    this.applyFilters(source)
  },

  onFilterType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    var source = this.data.useLocalData ? CASE_DATA : this.data.caseList
    this.applyFilters(source)
  }
})
