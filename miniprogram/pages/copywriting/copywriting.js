// miniprogram/pages/manual/manual.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    list:[],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoypWriteing()
  },
  loadSuccess() {
   wx.hideLoading()
  },
  loadNext() {
    this.getCoypWriteing().then(e => {
      let index = this.data.index
      index = index + 1
      this.setData({
        index
      })

    })

  },
  loadUp(){
    let index = this.data.index
    if(index <= 1) {
      return
    }
    index = index - 1
    this.setData({
      index
    })

  },
   getCoypWriteing() { 
    return new Promise((resolve, reject) => {
      wx.showLoading()
      wx.cloud.callFunction({
        name: 'copywriting',
  
        success: res => {
          console.log('转寄', res)
          let list = this.data.list
          list.push( res.result)
          this.setData({
            list
          })
          this.loadSuccess()
          resolve()
         
        },
        fail: err => {
          wx.hideLoading()
          reject()
         
        }
      })
    })


  },
  copyText() {
    wx.setClipboardData({
      data: this.data.list[this.data.index],
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return {
      title: this.data.list[this.data.index],
      imageUrl:"/static/1.jpg",
      path:'/pages/index/index'
    }

  },
})