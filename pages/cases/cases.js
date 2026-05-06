const app = getApp()
const { switchTab } = require('../../utils/util')
const { CASE_DATA } = require('../../utils/case-data')
const { callServiceHotline } = require('../../utils/phone-call')
const { resolveImageUrl } = require('../../utils/image-url')

function withResolvedImages(list) {
  return list.map(function (item) {
    return Object.assign({}, item, { image: resolveImageUrl(item.image) })
  })
}

Page({
  data: {
    caseList: CASE_DATA,
    computedCaseList: [],
    filterBrand: 'all',
    brands: ['全部', '宝马', '奔驰', '保时捷'],
    searchKeyword: ''
  },

  onLoad(options) {
    tt.setNavigationBarTitle({ title: '实拍案例 - 车尚友' })
    app.globalData.caseList = CASE_DATA
    var kw = ''
    if (options && options.keyword) {
      try {
        kw = decodeURIComponent(options.keyword)
      } catch (e) {
        kw = options.keyword
      }
    }
    this.setData({ searchKeyword: kw })
    this.applyFilters(CASE_DATA, kw)
  },

  switchTab,

  onTapCase(e) {
    const id = e.currentTarget.dataset.id
    // 找到原始数据中的索引位置
    let caseIndex = 0
    for (let i = 0; i < CASE_DATA.length; i++) {
      if (CASE_DATA[i].id === id) {
        caseIndex = i
        break
      }
    }
    tt.navigateTo({ url: '/pages/case-detail/case-detail?index=' + caseIndex })
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
    var kw
    if (keywordFromRoute !== undefined) {
      kw = String(keywordFromRoute || '').trim().toLowerCase()
    } else {
      kw = (this.data.searchKeyword || '').trim().toLowerCase()
    }
    var list = sourceList
    if (brand !== 'all') {
      list = list.filter(function (item) {
        return item.brand.indexOf(brand) !== -1
      })
    }
    if (kw) {
      list = list.filter(function (item) {
        var hay = (item.title + item.description + item.carModel + item.upgradeTarget + item.brand).toLowerCase()
        return hay.indexOf(kw) !== -1
      })
    }
    this.setData({ computedCaseList: withResolvedImages(list) })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.applyFilters(CASE_DATA)
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' })
    this.applyFilters(CASE_DATA)
  },

  onFilterBrand(e) {
    const brand = e.currentTarget.dataset.brand
    this.setData({ filterBrand: brand })
    this.applyFilters(CASE_DATA)
  }
})
