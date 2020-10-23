export default function handleDownload(url) {
  if(!url){
    return
  }
  url = url.replace(/http/,'https')
  let link = url
  let fileName = new Date().valueOf();
  wx.showLoading({
    title:"下载中..."
  })
  wx.downloadFile({
    url: link,
    filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
    success: res => {
      console.log(res);
      let filePath = res.filePath;
      wx.saveVideoToPhotosAlbum({
        filePath,
        success: file => {
          wx.showToast({
            title: '下载成功',
            icon: 'success',
            duration: 2000
          })
          let fileMgr = wx.getFileSystemManager();
          fileMgr.unlink({
            filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
            success: function (r) {

            },
          })
        },
        fail: err => {
          console.log(err)
          if (err.errMsg === 'saveVideoToPhotosAlbum:fail auth deny') {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: data => {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击下载即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
                  },
                })
              }
            })
          }
        }
      })
    }
  })
}