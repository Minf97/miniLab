import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// index.js
// 获取应用实例
const app = getApp()
// 数据库初始化
wx.cloud.init()
const db = wx.cloud.database()

Page({
  data: {
    time:{
      date:new Date().getDate(),
      month:new Date().getMonth()+1,  
      day:new Date().getDay(),
    },
    // 金刚区内容  
    left:0.625,      // 初始化滑块位置
    scrollItem:[],   // 主体内容
    hasSlider:false, // 控制滑块显示与隐藏
    // 通知栏内容  
    inform:[],       // 主体内容
    // 需要渲染的课表信息
    scheduleAll:[],  // 课表信息
    schedule:[],     // 当日课表信息
    today:'',        // 进行判断课表是否是今天的
  },


  // 1.获取信息函数
  getIndexInfo(){
    // 1.1请求数据库获取index集合内数据
    db.collection('index').get().then(res => {
      this.setData({
        inform:res.data[0].inform,
        scrollItem:res.data[0].scrollItem
      });
      console.log('index数据库请求成功',res.data);
    }).catch(console.error)
    // 1.2请求数据库获取schedule集合内数据（课表）
    db.collection('schedule').get().then(res => {
      this.setData({
        scheduleAll:res.data
      });
      app.globalData.scheduleAll = res.data;
      console.log("scheduleAll数据库请求成功",res.data);
      // 处理课表信息函数 解决(异步非阻塞调用与同步)顺序问题
      this.handleSchedule(res.data);
    }).catch(console.error)
  },
  // 2.跳转页面函数
  goToInterview(){
    wx.switchTab({
      url: '../interview/interview.wxml',
    })
  },
  goToIntroLab(){
    wx.navigateTo({
      url: '../introLab/introLab.wxml',
    })
  },
  // 3.处理课表信息函数
  handleSchedule(scheduleAll){
    const schedule = this.data.schedule;
    const time = this.data.time;
    // 处理加工变量
    const today = time.month + '.' + time.date;
    const tomorrow = time.month + '.' + (parseInt(time.date) + 1);
    const nextTomorrow = time.month + '.' + (parseInt(time.date) + 2);
    this.setData({
      today:today
    })
    // 遍历总课表，得到近三日课表
    for(let i =0; i < scheduleAll.length; i++){
      if(scheduleAll[i].date == today || scheduleAll[i].date == tomorrow || scheduleAll[i].date == nextTomorrow){
        schedule.push(scheduleAll[i])
      }
    }
    console.log("计算得到三日课表啦",schedule);
    // 对三日课表排序  -> width 也代表星期几
    schedule.sort(this.compare('width'))
    // 处理完毕，将结果赋值回去
    this.setData({
      schedule:schedule
    })
    app.globalData.schedule = schedule
    console.log("setData三日课表啦",this.data.schedule);
  },
  // 3.1数组对象排序用的函数 配合sort使用
  compare(property){
    return function(a,b){
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;   //升序，降序是 value2 - value1
    }
  },
  // 4.金刚区逻辑
  scroll(event){
    let scrollLeft = event.detail.scrollLeft + 375;
    let scrllWidth = event.detail.scrollWidth;
    let left;
    if(scrollLeft < 395){
      left = `65.625%`
    }else{
      left = `${(scrollLeft) / scrllWidth * 100}%`
    }
    this.setData({
      left, //模拟滑块滑动 根据css设置 距离左边的百分比
    })
  },
  // 4.1判断滑块
  judgeHasSlider(){
    if(this.data.scrollItem.length > 8){
      this.setData({
        hasSlider:true
      })
    } 
  },
  onLoad: function (options) {
    // 获取所有信息
    this.getIndexInfo();
    // 判断金刚区滑块隐藏与显示
    this.judgeHasSlider();
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration:100
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
})