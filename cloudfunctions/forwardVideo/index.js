// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = event.url;
  let fileName = new Date().valueOf();
  const res = await rp(url)
  let buf = new Buffer(res.length)
  buf.write(res)
  return await cloud.uploadFile({
    cloudPath: `uploadedVideo/${fileName}.mp4`,
    fileContent: buf
  })
}