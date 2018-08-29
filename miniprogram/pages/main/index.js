const app = getApp()

import {
    map_xcxKey,
    getAreaInfo,
    getWeather
} from "../../common/util";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        forecast: {},
        currentCity: {},
        weather: "",
        x: 300,
        y: 20
    },
    relocate() {
        wx.showLoading({
            title: "定位中..",
            mask: true
        });
        wx.clearStorageSync();
        this.getWeather("").then(_ => {
            getWeather("", "forecast").then(res => {
              console.log(res);
              if (res) {
                res.forecast.casts.forEach(v => {
                  v.week = new Date(v.date.replace(/\-/g, "/")).getDay();
                  v.day = v.date.slice(5);
                })
                this.setData({
                  forecast: res.forecast,
                })
              }
            })
            wx.hideLoading();
            wx.showToast({
                title: '定位成功',
                icon: 'success',
                duration: 1500
            })
        })
    },
    getWeather(city) {
        return getWeather(city).then(res => {
            const date = res.liveData.reporttime.replace(/\-/g, "/");
            let weather;
            if(res.weather.data === "晴") {
                weather = "sunny"
            } else if(res.weather.data === "多云") {
                weather = "cloudy"
            } else if(res.weather.data === "阴") {
                weather = "overcast"
            } else if(["中雨", "小雨"].includes(res.weather.data)) {
                weather = "rain"
            } else {
                weather = ""
            }
            this.setData({
                currentCityInfo: res.liveData,
                isNight: new Date(date).getHours() >= 18 ||  new Date(date).getHours() <= 6,
                weather,
            });
        });
    },
    getOpenId() {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success(res) {
                app.globalData.openid = res.result.openid;
                console.log(res);
            }
        })
    },
    chooseCity() {
        wx.redirectTo({
          url: '/pages/area/area'
        })
    },
    onGetUserInfo: function (e) {
        console.log(e);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const city = wx.getStorageSync('currentCity');
        this.getWeather(city).then(_ => {
            getWeather(city, "forecast").then(res => {
                console.log(res);
                if(res) {
                    res.forecast.casts.forEach(v => {
                        v.week = new Date(v.date.replace(/\-/g, "/")).getDay();
                        v.day = v.date.slice(5);
                    })
                    this.setData({
                        forecast: res.forecast,
                    })
                }
            })
        });
        
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

    }
})