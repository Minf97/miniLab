// pages/interview/interview.js
const app = getApp()
Page({
   data: {
      labList:[]
   },
   lab808(e){
      wx.navigateTo({
        url: '../schedule/schedule?labTitle=嵌入式实验室',
      })
   },
   lab901(e){
      wx.navigateTo({
        url: '../schedule/schedule?labTitle=智慧农业实验室',
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      this.setData({
         labList:app.globalData.labList
      })
      console.log(app.globalData.labList);
   },
})