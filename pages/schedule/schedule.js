const app = getApp()
var startX, endX;
var moveFlag = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取当前时间 -月份-日期-星期几
    time:{
       year: new Date().getFullYear(),
       month: new Date().getMonth(),
       date: new Date().getDate(),
       day: new Date().getDay()
    },
    
    // 设置开始时间 - 2021/8/30
    startTime: {},
    // 存放 星期二 - 星期天 的月份和日期
    arr:{},
    // 课表左侧的时间栏（不变）
    courseTime:[
      '8:00',
      '9:40',
      '10:00',
      '11:40',
      '14:30',
      '16:10',
      '16:20',
      '17:50',
      '19:40',
      '21:20',
      '22:05'
    ],
    colorArrays: [
      '#99CCFF',
      '#FFCC99',
      '#FFCCCC',
      '#CC6699',
      '#99CCCC',
      '#FF6666',
      '#CCCC66',
      '#66CC99',
      '#FF9966',
      '#66CCCC',
      '#6699CC',
      '#99CC99',
      '#669966',
      '#99CC99',
      '#99CCCC',
      '#66CCFF',
      '#CCCCFF',
      '#99CC66',
      '#CCCC99',
      '#FF9999',
    ],
    bgc: "rgb(231, 227, 227)",
    // 判断是否当前时间
    // isTimeNow:false,
    weekNow:1,
    isSelected:false,
    // 课表
    classList:app.globalData.classList,
    // 登录
    userInfo:'',
    hasUserInfo:false
  },
  // 点击出现上一星期课表 - 函数
  lastWeek:function(){
    const weekNowBefore = this.data.weekNow
    this.setData({
      // 正则表达式判断 weekNow 不能为 0 
      weekNow: this.data.weekNow - 1 == 0 ? 1 : this.data.weekNow - 1
    })
    this.defineClassList(weekNowBefore)
    this.linkWeekAndTime(this.data.weekNow)
  },
  // 点击出现下一星期课表 - 函数
  nextWeek:function(){
    const weekNowBefore = this.data.weekNow
    this.setData({
      weekNow: this.data.weekNow + 1 == 20 ? 19 : this.data.weekNow + 1
    })
    this.defineClassList(weekNowBefore)
    this.linkWeekAndTime(this.data.weekNow)
  },
  // 格式化时间输出
  formateTime:function(){
    const time = this.data.time
    time.month += 1
    time.day == 0 ? 7 : time.day
    this.setData({
      time:time
    })
    const sDate1 = "2021-8-30"
    const sDate2 = time.year + "-" + time.month + "-" + time.date
    this.dateDiff(sDate1,sDate2)
  },
  // 计算时间天数差
  dateDiff:function(sDate1,sDate2){
    // sDate1 和 sDate2 是2021-8-30格式
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    // 转换为 8-30-2023 的形式
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + "-" + aDate[0])
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + "-" + aDate[0])
    // 把相差的毫秒数转换为天数
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 /60 /60 /24)
    
    this.setData({
      // 向上取整，有小数就加一
      weekNow:Math.ceil(iDays / 7)
    })
  },
  // 将时间startTime与weekNow连接起来
  linkWeekAndTime:function(weekNow){
    const date = 30 + (weekNow-1)*7
    const year = new Date().getFullYear() 
    const startTime = new Date(year,7,date)
    // console.log(startTime);
    // console.log(startTime.getDate());
    // 计算curWeekNow
    // const curWeekNow = (当前时间 - 2021-8-30)/7
    this.setData({
      startTime:{
        month:startTime.getMonth() + 1,
        Monday:startTime.getDate(),
      },
      arr:{
        month:[
          new Date(year,7,date+1).getMonth()+1,
          new Date(year,7,date+2).getMonth()+1,
          new Date(year,7,date+3).getMonth()+1,
          new Date(year,7,date+4).getMonth()+1,
          new Date(year,7,date+5).getMonth()+1,
          new Date(year,7,date+6).getMonth()+1
        ],
        date:[
          new Date(year,7,date+1).getDate(),
          new Date(year,7,date+2).getDate(),
          new Date(year,7,date+3).getDate(),
          new Date(year,7,date+4).getDate(),
          new Date(year,7,date+5).getDate(),
          new Date(year,7,date+6).getDate()
        ]
    },
    })
  },
  // 点击更改课表颜色
  changeColor(){
    let colorArrays = this.data.colorArrays;
    let bgc = this.data.bgc;
    let index =Math.floor( Math.random()*colorArrays.length)
    bgc = colorArrays[index]
    this.setData({
      bgc: bgc
    })
  },
  isSelected(e){
    // 点击后传参，得到点击组件的page值 
    const page = e.currentTarget.dataset.page
    const idWidth =  e.currentTarget.dataset.width
    const idHeight =  e.currentTarget.dataset.height
    const classList = this.data.classList
    // console.log(page,idWidth,idHeight);
    for (let i = 0; i < classList.length; i++) {
      // console.log(page == classList[i].page && idWidth == classList[i].idWidth && idHeight == classList[i].idHighth);
      // console.log(classList[i].page,classList[i].idWidth,classList[i].idHighth);
      if (page == classList[i].page && idWidth == classList[i].idWidth && idHeight == classList[i].idHighth) {
        classList[i].isSelected = !classList[i].isSelected
        classList[i].teachName = app.globalData.userInfo.nickName
        this.setData({
          classList:classList
        })
        app.globalData.classList = classList
        // console.log(app.globalData.classList);
        break
      }
    }
    this.changeColor()
  },
  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    moveFlag = true;
  },
  // 触摸移动事件
  touchMove: function (e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        moveFlag = false;
        this.setData({
          weekNow: this.data.weekNow - 1,
        })
        this.defineClassList()
        this.linkWeekAndTime(this.data.weekNow)
      }
      if (startX - endX > 50) {
        moveFlag = false;
        this.setData({
          weekNow: this.data.weekNow + 1,
        })
        this.defineClassList()
        this.linkWeekAndTime(this.data.weekNow)
      }
    }
  },
  // 触摸结束事件
  touchEnd: function (e) {
    moveFlag = true; // 回复滑动事件
  },
  // 定义课表内容
  defineClassList(weekNowBefore){
    // 先拿到全局变量classList
    var classList = app.globalData.classList
    const weekNow = this.data.weekNow
    // 容器
    const classListEqual = []
    console.log(weekNowBefore,weekNow);
    // 判断全局变量 classList 是否有课表，有则说明不是第一次进入；不需重新渲染
    // 没有课表（classList.length == 0）或者当前页面变更 则：
    if (classList.length == 0 || weekNow !== weekNowBefore) {
      classListEqual.push(
        {
        page: weekNow,
        idWidth: 1,
        idHighth: 1,
        teachName: '',
        isSelected:false,
      },
      {
        page: weekNow,
        idWidth: 2,
        idHighth: 1,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 3,
        idHighth: 1,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 4,
        idHighth: 1,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 5,
        idHighth: 1,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 1,
        idHighth: 2,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 2,
        idHighth: 2,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 3,
        idHighth: 2,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 4,
        idHighth: 2,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 5,
        idHighth: 2,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 1,
        idHighth: 3,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 2,
        idHighth: 3,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 3,
        idHighth: 3,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 4,
        idHighth: 3,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 5,
        idHighth: 3,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 1,
        idHighth: 4,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 2,
        idHighth: 4,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 3,
        idHighth: 4,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 4,
        idHighth: 4,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 5,
        idHighth: 4,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 1,
        idHighth: 5,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 2,
        idHighth: 5,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 3,
        idHighth: 5,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 4,
        idHighth: 5,
        teachName: '',
        isSelected:false,
      },{
        page: weekNow,
        idWidth: 5,
        idHighth: 5,
        teachName: '',
        isSelected:false,
      },
      
      )
      classList = classListEqual
      app.globalData.classList = classList
      this.setData({
        classList:app.globalData.classList
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.formateTime()
    this.defineClassList()
    this.linkWeekAndTime(this.data.weekNow)
    // this.changeIsTimeNow(this.data.arr.month,this.data.arr.date,this.data.startTime)

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
    this.setData({
      classList:app.globalData.classList
    })
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
    return {
      title:'占课小程序'
    }
  }
})