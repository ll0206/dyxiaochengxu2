App({
  globalData: {
    /**
     * 七牛外链域名：与控制台「文件管理 → 外链域名」一致，末尾不要斜杠。
     * 测试域名多为 HTTP，抖音正式版可能要求 HTTPS，届时请换绑定域名并改 https。
     * case-data 里 image 如 /images/cases/xx.jpg 会与空间内 Key「images/cases/xx.jpg」拼接。
     * 抖音后台「服务器域名」需添加该域名（含协议）；HTTP 若被拒则必须上 HTTPS 自定义域名。
     */
    imageCDNBase: 'https://img.hcmg.store',
    phone: '18820163820',
    companyName: '车尚友（广州）汽车科技有限公司',
    address: '广州市白云区江高镇广花二路935号3栋101房',
    businessHours: '周一至周日 9:00–19:00',
    caseList: [],
    announcements: [
      '营业时间以「联系我们」公示为准，建议提前预约沟通到店时间',
      '奔驰S级等迈巴赫风格升级方案欢迎到店详询，费用以书面报价为准',
      '保时捷帕拉梅拉等改装方案可在「实拍案例」浏览示意，详情电话咨询'
    ]
  }
})
