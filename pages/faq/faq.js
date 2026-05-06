const FAQ_DATA = [
  {
    category: '价格咨询',
    items: [
      { q: '老改新外观升级大概多少钱？', a: '根据车型和升级项目不同，价格从几千到数万不等。例如宝马5系F18改F90外观套件约3-5万，奔驰S级W221改迈巴赫风格约8-15万。建议到店详询获取准确报价。' },
      { q: '是否支持分期付款？', a: '目前不支持分期付款，需到店时全款支付。具体付款方式可咨询门店。' },
      { q: '报价包含喷漆费用吗？', a: '报价包含基本喷漆费用，如需特殊颜色或珍珠漆等可能会有额外费用。' }
    ]
  },
  {
    category: '施工周期',
    items: [
      { q: '外观改装需要多长时间？', a: '简单的外观件更换约1-3天，涉及切割钣金的改装约5-15天，具体时间视项目复杂程度而定。' },
      { q: '施工期间可以使用代步车吗？', a: '建议施工期间将车辆留在店内，如需代步车请提前与门店沟通。' },
      { q: '可以实时查看施工进度吗？', a: '可通过小程序「个人中心」-「施工进度」实时查看施工状态和更新。' }
    ]
  },
  {
    category: '质保政策',
    items: [
      { q: '改装后有质保吗？', a: '我们使用的配件均提供1-2年质保，施工质保期为6个月。具体质保期限以施工合同为准。' },
      { q: '喷漆保色多久？', a: '使用进口汽车漆，正常保养下可保持5年以上不褪色。' },
      { q: '旧件可以退还吗？', a: '可选择旧件归还或旧件回收抵扣费用，详情可在案例详情中查看各项目的旧件处理方式。' }
    ]
  },
  {
    category: '预约流程',
    items: [
      { q: '如何预约？', a: '可通过「联系我们」页面填写预约表单，或拨打门店热线 18820163820 直接预约。' },
      { q: '预约需要定金吗？', a: '预约无需定金，到店勘车沟通方案后确定价格，确认施工时支付。' },
      { q: '可以取消预约吗？', a: '可以在「个人中心」-「我的预约」中取消预约，或直接致电门店。' }
    ]
  }
]

Page({
  data: {
    categories: [],
    faqData: FAQ_DATA,
    expandedMap: {}
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '常见问题' })
    var cats = []
    for (var i = 0; i < FAQ_DATA.length; i++) {
      cats.push(FAQ_DATA[i].category)
    }
    this.setData({ categories: cats })
  },

  toggleExpand(e) {
    var key = e.currentTarget.dataset.key
    var map = Object.assign({}, this.data.expandedMap)
    if (map[key]) {
      delete map[key]
    } else {
      map[key] = true
    }
    this.setData({ expandedMap: map })
  }
})
