
// 获取应用实例
const app = getApp()
// 数据库初始化
wx.cloud.init()
const db = wx.cloud.database()

Page({
   data: {
      labList:[
         {
           name: "嵌入式实验室",
           icon: "images/soft.png",
           place: "主教D808",
           click:"lab808"
         },{
           name: "智慧农业实验室",
           icon: "images/electric.png",
           place: "主教D901",
           click: "lab901"
         }
       ]
   },
   goToPage(e) {
      let name = e.currentTarget.dataset.name;
      let place = e.currentTarget.dataset.place;

      wx.navigateTo({
        url: `../schedule/schedule?name=${name}&place=${place}`,
      })
   },

   onLoad: function (options) {
      // db.collection('')
   },
})