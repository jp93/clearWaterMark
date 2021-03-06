// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()
//let requestUrl = `https://v.douyin.com/JPcUaC2/`

let send = {
  'Error:':'查询失败',
  'code':400,
}


//解析视频


//解析字符串里面的url
const httpString = (s) =>{
   let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
   try {
       return s.match(reg)[0];
   } catch (error) {
       return null;
   }
}


// 云函数入口函数
exports.main = async (event, context) => {
    let requestUrl =httpString(event.url) 

    function getItemId(){
     return new Promise(resolve=>{
        rp(requestUrl,(error, response, body) => {
        if (!error && response.statusCode == 200) {
            let href = response.request.href;
            console.log('href',href)
            let id;
            try {
              id = href.match(/video\/(\S*)\/\?region/)[1];
            } catch (error) {
              console.log('id报错',error)
               
                return false;
            }
            console.log('id',id)
            resolve(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${id}`);
        }else{
          console.log('error',error)
          reject(error)
        }
        })
      })

    }
    function getVideoObject(watermark) {
      return new Promise((resolve,reject) => {
        rp(watermark,async (error, response, body)=>{
          if (!error && response.statusCode == 200) {
              let result = JSON.parse(body);
              let data = result.item_list[0];
              //视频url解析
             let video = await videourl(data['video']["play_addr"]["url_list"][0]);
              //let video = data['video']["play_addr"]["url_list"][0].replace('playwm','play')
              // 拼接返回指定数
               let r = {
                'title':data["share_info"]["share_title"],
                'cover':data['video']["origin_cover"]["url_list"][0],
                'video':video,
                'audio':data['music']["play_url"]["uri"],
                'code':200,
              }
              resolve(r)
          }else{
            reject(error)
            return error
          }
        })
  
      })

    }
   function videourl(url){
      //截取字符串 wm
      url = url.replace(/wm/g,'');
      return new Promise(resolve=>{
       rp(url,(error, response, body) => {
          resolve(response.request.href)
       })
      })
    }
    let watermark = await getItemId()
    let res = await getVideoObject(watermark)
    return res
    console.log('resres',res)
    let formateVideourl = await videourl(res.video);
    console.log('formateVideourl',formateVideourl)
    res.video = formateVideourl
    return res



    



}