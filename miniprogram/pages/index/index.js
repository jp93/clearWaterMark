

//index.js
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    inputValue:"",
    timer: null ,
    loading:false
  },

  onLoad: function() {

    //this.clearWaterMark()


  },
  bindChangeInput(e){
    this.setData({
      inputValue: e.detail.value
    })

  },
  submit() {
    console.log('点击')
    if(this.data.loading){
      return
    }
    this.setData({
      loading:true
    })
    this.clearWaterMark()

  },

  clearWaterMark(){
    wx.showLoading({
      title: '解析中...',
    })
    wx.cloud.callFunction({
      name: 'clearWaterMark',
      data: {
        url:this.data.inputValue
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数水印]', res)
        wx.navigateTo({
          url: `/pages/video/video?url=${res.result.video}`,
        })



        this.setData({
          loading:false
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.hideLoading()
        this.setData({
          loading:false
        })
   
      }
    })

  }
})
