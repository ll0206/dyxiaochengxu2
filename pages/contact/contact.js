const app = getApp()
const { switchTab } = require('../../utils/util')
const { callServiceHotline } = require('../../utils/phone-call')

const SERVICE_TYPES = [
  '老改新外观升级',
  '迈巴赫风格升级',
  'AMG / M运动升级',
  '无损安装',
  '切割钣金',
  '喷漆服务',
  '其他咨询'
]

Page({
  data: {
    form: {
      name: '',
      phone: '',
      carModel: '',
      licensePlate: '',
      serviceType: '',
      appointmentDate: '',
      timeSlot: '',
      description: ''
    },
    serviceTypes: SERVICE_TYPES,
    timeSlots: ['09:00-12:00', '14:00-17:00', '17:00-19:00'],
    typeIndex: -1,
    timeSlotIndex: -1,
    showTypePicker: false
  },

  onLoad() {
    tt.setNavigationBarTitle({ title: '联系我们 - 车尚友' })
  },

  switchTab,

  makeCall() {
    callServiceHotline(app.globalData.phone)
  },

  goPrivacy() {
    tt.navigateTo({ url: '/pages/legal/privacy' })
  },

  goTerms() {
    tt.navigateTo({ url: '/pages/legal/terms' })
  },

  copyPhone() {
    var phone = app.globalData.phone
    tt.setClipboardData({
      data: phone,
      success: function () {
        tt.showToast({ title: '电话号码已复制', icon: 'none' })
      }
    })
  },

  copyAddress() {
    var addr = app.globalData.address
    tt.setClipboardData({
      data: addr,
      success: function () {
        tt.showToast({ title: '地址已复制', icon: 'none' })
      }
    })
  },

  openLocation() {
    tt.openLocation({
      latitude: 23.3205,
      longitude: 113.2736,
      name: '车尚友（广州）汽车科技有限公司',
      address: '广州市白云区江高镇广花二路935号3栋101房',
      scale: 16
    })
  },

  onInputName(e) {
    this.setData({ 'form.name': e.detail.value })
  },

  onInputPhone(e) {
    this.setData({ 'form.phone': e.detail.value })
  },

  onInputCarModel(e) {
    this.setData({ 'form.carModel': e.detail.value })
  },

  onInputPlate(e) {
    this.setData({ 'form.licensePlate': e.detail.value })
  },

  onTimeSlotChange(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      timeSlotIndex: index,
      'form.timeSlot': this.data.timeSlots[index]
    })
  },

  onInputDate(e) {
    this.setData({ 'form.appointmentDate': e.detail.value })
  },

  onInputDesc(e) {
    this.setData({ 'form.description': e.detail.value })
  },

  showTypePicker() {
    this.setData({ showTypePicker: true })
  },

  hideTypePicker() {
    this.setData({ showTypePicker: false })
  },

  onTypeChange(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      typeIndex: index,
      'form.serviceType': SERVICE_TYPES[index],
      showTypePicker: false
    })
  },

  onSubmit() {
    const { form } = this.data
    if (!form.name) {
      tt.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      tt.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!form.serviceType) {
      tt.showToast({ title: '请选择服务类型', icon: 'none' })
      return
    }

    // 保存预约记录到本地存储
    const appointment = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      carModel: form.carModel,
      licensePlate: form.licensePlate,
      serviceType: form.serviceType,
      appointmentDate: form.appointmentDate,
      timeSlot: form.timeSlot,
      description: form.description,
      status: 'pending',
      createTime: Date.now()
    }
    const appointments = tt.getStorageSync('appointments') || []
    appointments.unshift(appointment)
    tt.setStorageSync('appointments', appointments)

    // 模拟施工进度数据
    if (!tt.getStorageSync('construction')) {
      tt.setStorageSync('construction', {
        stage: 'pending',
        carModel: form.carModel || '未填写',
        project: form.serviceType,
        startDate: form.appointmentDate || '待定',
        expectedDate: '待定',
        updates: [{ time: new Date().toLocaleString(), content: '预约已提交，等待技师接单' }]
      })
    }

    const content = `姓名：${form.name}\n电话：${form.phone}\n车型：${form.carModel || '未填写'}\n车牌：${form.licensePlate || '未填写'}\n服务类型：${form.serviceType}\n预约日期：${form.appointmentDate || '未选择'}\n时段：${form.timeSlot || '未选择'}\n需求：${form.description || '无'}`
    tt.showModal({
      title: '留言成功',
      content: `${form.name}，您的预约信息已提交！\n\n${content}\n\n我们会尽快以电话方式与您联系确认。`,
      showCancel: false,
      success: () => {
        this.setData({
          form: { name: '', phone: '', carModel: '', licensePlate: '', serviceType: '', appointmentDate: '', timeSlot: '', description: '' },
          typeIndex: -1,
          timeSlotIndex: -1
        })
      }
    })
  }
})
