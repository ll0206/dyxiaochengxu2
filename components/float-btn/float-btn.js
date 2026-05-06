const { callServiceHotline } = require('../../utils/phone-call')

Component({
  data: {
    phone: ''
  },
  methods: {
    makeCall() {
      callServiceHotline(this.data.phone)
    }
  },
  attached() {
    this.setData({ phone: getApp().globalData.phone })
  }
})
