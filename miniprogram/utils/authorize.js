export default function handleDownload(fileID) {
  if(!fileID){
    return
  }
  console.log('fileID',fileID)

  let fileName = new Date().valueOf();

  const downloadTask = wx.cloud.downloadFile({
    fileID: fileID,
    success: res => {
      console.log(res);
      let filePath = res.tempFilePath;
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
          //下载成功后从云端删除
          wx.cloud.callFunction({
            name: 'deleteVideo',
            data: {
              fileID: fileID,
            },
            success: res => {
              
            },
            fail: err => {
          
            }
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
    },fail(res){
      console.log('res',res)
      wx.showToast({
        title: '超过微信最大下载下载，建议复制无水印链接去浏览器下载',
        icon:'none',
        duration:2000
      })
    }
  })
  downloadTask.onProgressUpdate((res) => {
    console.log('下载进度', res.progress)
    wx.showLoading({
      title:`下载中...${res.progress}%`
    })
  })
}