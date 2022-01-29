
// app.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const lab = db.collection('lab')
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    classList:[],
    userInfo:{},
    labData:[],
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
    ],
    labClass_item:[],

    // 新：
    scheduleAll:[],
    // 三日课表
    schedule:[]
  }
})
