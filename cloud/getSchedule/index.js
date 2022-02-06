// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
   switch(event.type) {
      case "getSchedule":
         return await getSchedule(event);
      case "addSchedule":
          return await addSchedule(event);      // 添加课程记录
      case "delSchedule":
          return await delSchedule(event);  // 隐藏课程记录
  }
}

async function getSchedule (event) {
   // 1. 获取数据总个数
   let count = await cloud.database().collection('schedule').count();
   count = count.total;
   // 2. 通过循环做多次请求，并把多次请求的数据装在一个数组里
   let arr = [];
   for(let i = 0; i < count; i += 100) {
      let list = await cloud.database().collection('schedule').skip(i).get();
      arr = arr.concat(list.data)
   }
   // 3. 返回数组
   return arr;
}

async function addSchedule (event) {
   return await cloud.database().collection('schedule').add({
      data:event.arr
   })
}

async function delSchedule (event) {
   return await cloud.database().collection('schedule').where({
      title: event.title,
      page: event.page,
      width: event.width,
      height: event.height
   }).remove()
}