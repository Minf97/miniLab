// index.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:{
      date:new Date().getDate(),
      month:new Date().getMonth(),
      day:new Date().getDay(),
    },
    labList: [
      {
        name: "应用科技软件实验室",
        icon: "images/soft.png",
        place: "主教D808",
        click:"lab808"
      },{
        name: "嵌入式硬件实验室",
        icon: "images/electric.png",
        pleca: "主教D901",
        click: "lab901"
      }
    ],
    clssList:app.globalData.classList,
    classListToday:[],
    userInfo:{},
    hasUserInfo:false,
  },
  lab808(e){
    console.log(e,"808");
  },
  lab901(e){
    console.log(e,"901");
  },
  formatData(){
    const classList = app.globalData.classList
    const classListToday = []
    // 格式化星期几
    const timeDay = this.data.time.day == 0 ? 7 : this.data.time.day
    
    // 将今天的课表提取出来
    for (let i = 0; i < classList.length; i++) {
      if(classList[i].idWidth == timeDay){
        classListToday.push(classList[i])
      }
    }
    this.setData({
      classListToday:classListToday
    })
    console.log(classListToday);
  },
  // 登录
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = this.data.userInfo
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.formatData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  setClass:function(){
    const hasUserInfo = this.data.hasUserInfo
    console.log(this.data.hasUserInfo);
    if (!hasUserInfo) {
      this.getUserProfile()
    }else{
      wx.navigateTo({
        url: '/pages/schedule/schedule',
      })
    }
  }
})