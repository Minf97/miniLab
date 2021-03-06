const util = require("../../utils/util");

const app = getApp()
wx.cloud.init()

var startX, endX;
var moveFlag = true;
const userInfo = wx.getStorageSync('userInfo');

Page({
  data: {
    time:{
       year: new Date().getFullYear(),
       month: new Date().getMonth()+1,    //当前月
       date: new Date().getDate(),        //当前日
       day: new Date().getDay()           //星期几
    },
    // 1.控制时间函数内所用参数
    weekNow:1,
    startTime: "",     // 每学期起始时间 - 2021/8/30   
    arr:{},            // 存放 month 和 date 两个数组,当前周的日期
    courseTime:[       // 课表左侧的时间栏（不变）
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
    // 2.获取课表函数内所用参数
    scheduleAll:[],    // 获取全部课表
    schedule:[],       // 本实验室课表
    labTitle:'',       // 接收实验室名称
    place: '',         // 接收教室地点
    
    colorArrays: [     // 排课时变色的颜色数组（常量）
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
    index:'',          // 课表变色的随机数
    
    editing:false,     // 进入编辑模式
    showDotScroll:true,  // 显示绿点Scroll
    addClass:true,     // 添加课表
    classMsg:[
      {text:'*课程名',key:'className'},
      {text:'教室',key:'classRoom'},
      {text:'教师',key:'classMaster'},
    ],
    weekArray: ['一', '二', '三', '四','五','六','日'],
    weekIndex:0,
    sectionArray: ['1-2','3-4','5-6','7-8','9-10'],
    sectionIndex:0,
    weekList:[{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},{checked: false},],
    
  },
  // 1.控制时间的总函数
  InitTime(){
    this.InitStartTime();
    this.getWeekNow();
    this.linkWeekAndTime(this.data.weekNow);
  },
  InitStartTime(){                         // 初始化每学期起始时间
    const time = this.data.time;
    
    if(time.month >= 8 || (time.month <= 1 && time.date <= 20)){  // 上学期
      this.setData({
        startTime:time.year + "-8-30"
      })
    }else {                                                       // 下学期
      this.setData({
        startTime:time.year + "-2-28"
      })
    };
    // console.log(this.data.startTime,"初始化学期起始时间")
  },
  dateDiff:function(sDate1,sDate2){        // 计算时间天数差 （不动）
    // sDate1 和 sDate2 必须是2021-8-30格式
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    // 转换为 8-30-2021 的形式
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + "-" + aDate[0])
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + "-" + aDate[0])

    if(oDate2 < oDate1) {
      // 如果当前时间小于初始化时间
      return 1
    }else {
      // 把相差的毫秒数转换为天数
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 /60 /60 /24);
      return iDays;
    }
  },
  getWeekNow:function(){                   // 得到weekNow 
    const time = this.data.time
    time.day == 0 ? 7 : time.day
    this.setData({
      time:time
    })
    const sDate1 = this.data.startTime     // 起始时间
    const sDate2 = time.year + "-" + time.month + "-" + time.date

    var daysUntilNow = this.dateDiff(sDate1,sDate2);       // 计算天数差
    (daysUntilNow/7)%1 == 0 ? daysUntilNow += 1 : '';      // 解决每周一还停留在上一周的BUG
    this.setData({
      weekNow:Math.ceil(daysUntilNow / 7)  // 向上取整，有小数就加一
    })
    console.log(this.data.weekNow,"计算出weekNow啦");
  },
  linkWeekAndTime:function(weekNow){       // 将时间startTime与weekNow连接起来
    // Date(year,month,date)  
    // Date(2021,7,31)    返回出来是 2021年8月31号 
    // Date(2021,7,30+10) 返回出来是 距离2021年8月30号过去十天后的日期
    const startTime = this.data.startTime.split("-");
    const weekMonday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) + (weekNow-1)*7);
    const weekTuesday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +1 + (weekNow-1)*7);
    const weekWednesday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +2 + (weekNow-1)*7);
    const weekThursday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +3 + (weekNow-1)*7);
    const weekFriday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +4 + (weekNow-1)*7);
    const weekSaturday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +5 + (weekNow-1)*7);
    const weekSunday = new Date(startTime[0],parseInt(startTime[1])-1,parseInt(startTime[2]) +6 + (weekNow-1)*7);
    this.setData({
      arr:{
        month:[
          weekMonday.getMonth()+1,
          weekTuesday.getMonth()+1,
          weekWednesday.getMonth()+1,
          weekThursday.getMonth()+1,
          weekFriday.getMonth()+1,
          weekSaturday.getMonth()+1,
          weekSunday.getMonth()+1,
        ],
        date:[
          weekMonday.getDate(),
          weekTuesday.getDate(),
          weekWednesday.getDate(),
          weekThursday.getDate(),
          weekFriday.getDate(),
          weekSaturday.getDate(),
          weekSunday.getDate(),
        ],
      },
    })
  },

  // 2.控制翻页总函数
  touchStart:function(e){
    startX = e.touches[0].pageX; // 获取触摸时的原点
    moveFlag = true;
  },
  touchMove:function(e){                   // 触摸移动事件
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        moveFlag = false;
        this.setData({
          weekNow: this.data.weekNow - 1,
        })
        this.linkWeekAndTime(this.data.weekNow)
      }
      if (startX - endX > 50) {
        moveFlag = false;
        this.setData({
          weekNow: this.data.weekNow + 1,
        })
        this.linkWeekAndTime(this.data.weekNow)
      }
    }
  },
  touchEnd:function(e){                    // 触摸结束事件
    moveFlag = true; // 回复滑动事件
  },

  // 3.课表处理总函数
  handleScheduleAll(){                     // 处理得到当前实验室内的课表
    let scheduleAll = wx.getStorageSync('scheduleAll');
    let schedule = this.data.schedule;
    let labTitle = this.data.labTitle;

    // 遍历全部课表，得到当前实验室课表   
    scheduleAll.map(item => {
      item.title == labTitle ? schedule.push(item) : ''
    })
    this.setData({
      schedule:schedule
    })
    console.log(schedule,"本实验室课表处理完成");
  },
  
  // 4. 排课操作总函数
  isEdit(){                                // 进入编辑模式，点击事件触发
    this.setData({
      editing:!this.data.editing
    })
    if(this.data.editing){
      wx.showToast({
        title: '再次点击取消',
        icon:'none',
        duration:1000
      })
    }
  },
  showClassDetail(){
    wx.showToast({
      title: `教师：${userInfo.nickName}\n地点：${this.data.place}`,
      icon: "none",
      duration: 1000
    })
  },
  arrange(e){                              // 编辑模式下，排课操作函数，点击事件触发
    // 点击后传参
    const height =  e.currentTarget.dataset.height
    const width =  e.currentTarget.dataset.width
    const date = this.data.arr.month[width-1] + "." + this.data.arr.date[width-1]

    this.showLoadingMs(1000);
    this.controlDatabaseAdd(date,width,height);
    this.changeColor();
  },
  changeColor(){                           // 点击更改课表颜色 仅arrange引用
    let colorArrays = this.data.colorArrays;
    let index = Math.floor( Math.random()*colorArrays.length)

    this.setData({
      index:index                          // 课表颜色随机数
    })
  },
  showLoadingMs(timeMs){                   // 显示加载图标函数
    wx.showLoading({
      title: '处理中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, timeMs)
  },
  controlDatabaseAdd(date,width,height){   // 排课成功，向数据库发送请求 仅 arrange()函数引用
    let that = this;
    let scheduleAll = wx.getStorageSync('scheduleAll');
    let schedule = this.data.schedule;
    const page = this.data.weekNow;
    
    const newScheduleObj = {
      index: that.data.place,
      title: that.data.labTitle,
      date: date,
      page: page,
      width: width,
      height: height
    }
    const arr = [newScheduleObj]
    wx.cloud.callFunction({
      name:"getSchedule",
      data:{
        type:"addSchedule",
        arr:arr
      }
    }).then(res => {
      console.log(res,"存储成功");
      wx.showToast({
        title: '排课成功',
        duration: 1000
      });
      (function () {                                       // 更新信息
        scheduleAll.push(newScheduleObj);
        schedule.push(newScheduleObj)
        that.setData({ scheduleAll,schedule })
        wx.setStorageSync('scheduleAll', scheduleAll);   // 更新缓存
      })();
    })
  },

  // 5. 删除排课信息总函数
  excelClass(e){                           // 不做引用，点击事件触发
    const height =  e.currentTarget.dataset.height
    const width =  e.currentTarget.dataset.width

    this.showLoadingMs(1000);
    this.controlDatabaseDel(width,height);
  },
  // 取消排课时，将数据库内信息删除 仅excelClass() 内部引用
  controlDatabaseDel(width,height){
    let that = this;
    const page = this.data.weekNow;
    const title = this.data.labTitle;

    wx.cloud.callFunction({
      name:"getSchedule",
      data:{
        type:"delSchedule",
        title:title,
        page:page,
        width:width,
        height:height
      }
    }).then(res => {
      console.log(res,"删除数据库数据成功");
      wx.showToast({
        title: '删除成功',
        duration: 1000
      });
      
      // 删除成功后更新缓存
      (function(title,page,width,height){
        const schedule = that.data.schedule;
        const scheduleAll = that.data.scheduleAll;

        schedule.forEach((item,index,arr) => {
          if(item.page == page && item.width == width && item.height == height) {
            arr.splice(index,1)
            console.log(arr);
          }
        })
        scheduleAll.forEach((item,index,arr) => {
          if(item.title == title && item.page == page && item.width == width && item.height == height) {
            arr.splice(index,1)
          }
        })

        that.setData({ schedule,scheduleAll });
        wx.setStorageSync('scheduleAll', scheduleAll);
      })(title,page,width,height)
    })
    
  },
  // 6、滚动选择器
  weekChange(e) {
    this.setData({
      weekIndex: e.detail.value
    })
  },
  sectionChange(e){
    this.setData({
      sectionIndex: e.detail.value
    })
  },
  // 7、上课周数的复选按钮
  weekListChoice(options){
    let index = options.currentTarget.dataset.index;
    let item = this.data.weekList[index];
    item.checked = !item.checked;
    // 更新
    this.setData({
      weekList: this.data.weekList
    });
  },
  // 关闭
  addViewClose(){
    this.setData({
      addClass:true
    })
    util.slideupshow(this, "addToClassView", 600, 0)     // 动效
  },
  // 打开
  addViewOpen(){
    this.setData({
      addClass:false
    })
    util.slideupshow(this, "addToClassView", -600, 1)     // 动效
  },
  // 添加课表的信息提交
  addViewSubmmit(e){
    let that = this;
    let addClassMsg = e.detail.value;
    let weekList = [];
    
    that.data.weekList.map(item => {
      item.checked ? weekList.push(Number(that.data.weekList.indexOf(item))+1) : '';
      item.checked = false;      // 还原用于表单清零
    })

    if(weekList == '' || 
    addClassMsg.classMaster == '' || 
    addClassMsg.className == '' || 
    addClassMsg.classRoom == ''){
      wx.showToast({
        title: '请填写完整！',
        icon:'none',
        duration:1000
      })
      return;
    }

    const getArr = (addClassMsg,weekList) => {
      const {className, classRoom, classMaster, weekNum, sectionNum} = addClassMsg;
      // weekNum 处理成横坐标，sectionNum 处理成纵坐标
      const width = Number(weekNum)+1;
      const height = Number(sectionNum)+1;
      const date = that.data.arr.month[width-1] + "." + that.data.arr.date[width-1]

      let arr = [];
      weekList.map(item => {
        let obj = {
          index: that.data.place,
          title: that.data.labTitle,
          date: date,
          page: '',
          width: width,
          height: height,
          className: className,
          classMaster: classMaster
        };
        obj["page"] = Number(item);
        arr.push(obj);
      })
      console.log(arr,233);
      return arr;
    }
    const arr = getArr(addClassMsg,weekList);

    this.showLoadingMs(1000)
    wx.cloud.callFunction({
      name:"getSchedule",
      data:{
        type:"addSchedule",
        arr:arr
      }
    }).then(res => {
      console.log(res,"存储成功");
      wx.showToast({
        title: '排课成功',
        duration: 1000
      });
      (function () {                                       // 更新信息
        let scheduleAll = wx.getStorageSync('scheduleAll');
        let schedule = that.data.schedule;
        scheduleAll.push(...arr);
        schedule.push(...arr)
        that.setData({ scheduleAll,schedule })
        console.log(schedule);
        wx.setStorageSync('scheduleAll', scheduleAll);   // 更新缓存
      })();
    })

    // 表单清零
    this.setData({
      addClass:true,
      addClassvalue:'',
      weekList:that.data.weekList,
      sectionIndex:0,
      weekIndex:0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options) {
      try {
        this.setData({
          labTitle:options.name,
          place: options.place,
          userInfo
        });
      } catch (e){
        console.log(e);
      }
    }
    
    this.InitTime()                 // 控制时间总函数
    this.handleScheduleAll()        // 处理课表总函数

    // 处理的绿色小点点
    let that = this;
    (function() {
      let schedule = that.data.schedule;
      let dotList = new Array();

      // 遍历得到点点容器
      for (var i = 0; i < 20; i++) { 
        dotList[i] = new Array();
        for (var j = 0; j < 35; j++) {
          dotList[i][j] = null;
        }
      }
      // 逻辑运算处理得到绿色点点
      schedule.map(item => {
        let greenDot = (item.height-1)*7 + (item.width-1)
        dotList[item.page-1][greenDot] = 1;
      })
      that.setData({ dotList })
    })()
  },
  dotBoxClick(e) {
    this.setData({
      weekNow:e.currentTarget.dataset.page
    })
    this.linkWeekAndTime(this.data.weekNow)
  },
  showDotScroll() {
    this.setData({
      showDotScroll: !this.data.showDotScroll
    })
  },
  onShareAppMessage: function () {
    return {
      title:'广油实验室小程序'
    }
  }
})