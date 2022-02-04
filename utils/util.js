const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

  //渐变
  const fadein =  (that, param, opacity) => {
    var select = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    select.opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = select.export()
    that.setData(json)
  }
  //垂直滑动 渐入渐出
  const slideupshow = (that, param, px, opacity) => {
    var select = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    select.translateY(px).opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = select.export()
    that.setData(json)
  }
  //平行滑动 渐入渐出
  const sliderightshow = (that, param, px, opacity) => {
    var select = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 80
    });
    select.translateX(px).opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = select.export()
    console.log(json);
    that.setData(json)
  }


module.exports = {
  formatTime,
  fadein,
  slideupshow,
  sliderightshow
}
