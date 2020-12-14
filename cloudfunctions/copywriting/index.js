// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  const requestUrl = 'https://pyq.shadiao.app/api.php'
  function getCoyyWriting(){
    return new Promise(resolve=>{
       rp(requestUrl,(error, response, body) => {
       if (!error && response.statusCode == 200) {
         console.log('response', response)
        resolve(response.body);
       }else{
         console.log('error',error)
         reject(error)
       }
       })
     })

   }
   let res = await getCoyyWriting()
   return res

}