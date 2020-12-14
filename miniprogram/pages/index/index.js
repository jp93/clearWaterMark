

//index.js
const app = getApp()
import Notify from '@vant/weapp/notify/notify';
import handleDownload from '../../utils/authorize.js';

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    inputValue:"",
    timer: null ,
    loading:false,
    url:''
  },

  onLoad: function() {

    //this.clearWaterMark()


  },
  onShow(){
    let self = this
    wx.getClipboardData({
      success:(res)=>{
        console.log(res.data)
        if(!res.data.trim()){
          return
        }
        let getUrl = this.httpString(res.data)
        if(!getUrl){
          return
        }
        if(getUrl === this.data.inputValue){
          return
        }
 
        wx.showModal({
          title: '是否获取剪切板中的链接资源',
          content: getUrl,
          success :(result)=>{
            if (result.confirm) {
              this.setData({
                inputValue:getUrl,
                url:''
              })
              
            } else if (result.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    })
  },
  onShareAppMessage(){
    return {
      title: '抖音一键去水印，永久免费！',
      imageUrl:"/static/2.jpg"
    }
  },
  bindChangeInput(e){
    this.setData({
      inputValue: e.detail.value
    })

  },
  httpString(s){
    let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    try {
        return s.match(reg)[0];
    } catch (error) {
        return null;
    }
 },
  submit() {
    console.log('点击')
    if(!this.data.inputValue){
      Notify({ type: 'warning', message: '请先复制需要解析的视频链接',background:"#1989fa" });
      return

    }
    if(!this.httpString(this.data.inputValue)){
      Notify({ type: 'warning', message: '复制的地址链接不正确,请检查后重试！',background:"#1989fa" });
      return

    }

   
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
        // wx.navigateTo({
        //   url: `/pages/video/video`,
        // })
  
        this.setData({
          url:res.result.video
        })



        this.setData({
          loading:false
        })
      },
      fail: err => {
        console.error('解析失败', err)
        wx.hideLoading()
        this.setData({
          loading:false
        })
   
      }
    })

  },
  saveVideo() {
    handleDownload(this.data.url)
  },
  setClipboardData() {
    wx.setClipboardData({
      data:this.data.url
    })
  },
  toManual(){
    wx.navigateTo({
      url: '/pages/manual/manual',
    })
  },
  forwardVideo() {
    wx.showLoading()
    
    wx.cloud.callFunction({
      name: 'forwardVideo',
      data: {
        url:this.data.url
      },
      success: res => {
        console.log('转寄', res)
        let fileID = res.result.fileID
        handleDownload(fileID)
      },
      fail: err => {
        wx.hideLoading()
        console.log('转寄失败',err)
      }
    })

  }
})
