const { resolveImageUrl } = require('../../utils/image-url')

Page({
  data: {
    sections: [
      {
        title: '施工车间',
        desc: '11600㎡标准化施工车间',
        images: [
          { path: '/images/workshop/main.jpg', label: '主施工区' },
          { path: '/images/workshop/area1.jpg', label: '外观施工区' },
          { path: '/images/workshop/area2.jpg', label: '内饰施工区' }
        ]
      },
      {
        title: '烤漆房',
        desc: '恒温无尘烤漆房，保证漆面质量',
        images: [
          { path: '/images/workshop/paint.jpg', label: '烤漆房' }
        ]
      },
      {
        title: '设备展示',
        desc: '专业改装设备与工具',
        images: [
          { path: '/images/workshop/equipment.jpg', label: '专业设备' }
        ]
      }
    ],
    certs: [
      { title: '营业执照', desc: '车尚友（广州）汽车科技有限公司' },
      { title: '道路运输经营许可证', desc: '合法合规经营' },
      { title: '环保备案', desc: '施工环保达标' }
    ]
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '车间环境' })
  },

  onTapImage(e) {
    var urls = e.currentTarget.dataset.urls
    var current = e.currentTarget.dataset.current
    tt.previewImage({ current: current, urls: urls })
  }
})
