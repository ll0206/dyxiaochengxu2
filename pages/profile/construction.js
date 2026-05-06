const { callServiceHotline } = require('../../utils/phone-call')
const api = require('../../utils/api')

const STAGES = [
  { key: 'pending', label: '待接单', desc: '您的预约已提交，等待技师接单' },
  { key: 'accepted', label: '已接单', desc: '技师已接单，准备施工中' },
  { key: 'in_progress', label: '施工中', desc: '车辆正在施工中，请耐心等待' },
  { key: 'qc', label: '质检中', desc: '施工完成，正在进行质量检查' },
  { key: 'done', label: '已完成', desc: '质检通过，可以提车了' }
]

Page({
  data: {
    stages: STAGES,
    currentStage: 0,
    construction: null,
    hasConstruction: false,
    loading: true
  },

  onShow() {
    var self = this
    if (api.isLoggedIn()) {
      api.getConstructionStatus()
        .then(function (data) {
          if (data) {
            var stageIdx = STAGES.findIndex(function (s) { return s.key === data.stage })
            self.setData({
              construction: data,
              currentStage: stageIdx >= 0 ? stageIdx : 0,
              hasConstruction: true,
              loading: false
            })
          } else {
            self._loadLocal()
          }
        })
        .catch(function () {
          self._loadLocal()
        })
    } else {
      this._loadLocal()
    }
  },

  _loadLocal() {
    var construction = tt.getStorageSync('construction')
    if (construction) {
      var stageIdx = STAGES.findIndex(function (s) { return s.key === construction.stage })
      this.setData({
        construction: construction,
        currentStage: stageIdx >= 0 ? stageIdx : 0,
        hasConstruction: true,
        loading: false
      })
    } else {
      this.setData({
        construction: null,
        currentStage: 0,
        hasConstruction: false,
        loading: false
      })
    }
  },

  goContact() {
    tt.redirectTo({ url: '/pages/contact/contact' })
  },

  makeCall() {
    callServiceHotline(getApp().globalData.phone)
  }
})
