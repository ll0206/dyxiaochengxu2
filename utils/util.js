/**
 * 全局工具方法
 */
const TAB_PAGES = [
  '/pages/index/index',
  '/pages/cases/cases',
  '/pages/vehicle-gallery/vehicle-gallery',
  '/pages/profile/profile'
]

function switchTab(e, currentIndex) {
  const index = e.currentTarget.dataset.index
  if (index === currentIndex) return
  tt.redirectTo({ url: TAB_PAGES[index] })
}

module.exports = {
  switchTab,
  TAB_PAGES
}
