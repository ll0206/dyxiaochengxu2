Page({
  data: {
    team: [
      { name: '张师傅', role: '技术总监', experience: '15年德系车改装经验', brands: '宝马/奔驰/保时捷', avatar: '张', desc: '精通老改新外观升级、迈巴赫风格改装' },
      { name: '李师傅', role: '首席技师', experience: '12年豪车施工经验', brands: '奔驰/奥迪', avatar: '李', desc: '擅长内饰翻新、AMG/M运动升级' },
      { name: '王师傅', role: '钣金喷漆技师', experience: '10年钣喷经验', brands: '全品牌', avatar: '王', desc: '专业调色、无痕修复、原厂漆面还原' },
      { name: '赵师傅', role: '电路技师', experience: '8年汽车电路经验', brands: '宝马/奔驰', avatar: '赵', desc: '专注老款升级新款电路适配、智能系统加装' }
    ]
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '技师团队' })
  },

  onTapMember(e) {
    var member = this.data.team[e.currentTarget.dataset.index]
    tt.showModal({
      title: member.name + ' - ' + member.role,
      content: member.experience + '\n擅长：' + member.brands + '\n' + member.desc,
      showCancel: false
    })
  }
})
