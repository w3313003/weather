const app = getApp()
const wxCharts = require("../../common/sdk/wx_chart");

import {
    map_xcxKey,
    getAreaInfo,
    getWeather
} from "../../common/util";
const dayTemp = [];
const nightTemp = [];
const xAxisArr = [];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        forecast: {},
        currentCity: {},
        weather: "",
        x: 300,
        y: 20,
        top: 0,
        isPop: false
    },
    relocate() {
        wx.clearStorageSync();
        this._initHandler("重新定位中").then(res => {
            if(res){
                wx.showToast({
                    title: '定位成功',
                    icon: 'success',
                    duration: 1500
                })
            } else {
                wx.showToast({
                    title: '数据获取失败',
                    icon: 'fail',
                    duration: 1500
                })
            }
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
            } else if(["中雨", "小雨", "大雨", "阵雨"].includes(res.weather.data)) {
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
    navigateTo({currentTarget}) {
        const { type } = currentTarget.dataset;
        if(type === "person") {
            wx.navigateTo({
                url: '/pages/my/index'
            });
            return;
        };
        wx.showToast({
            title: `功能开发中`,
            image: `../../images/${type}.png`,
            duration: 1500,
            mask: true,
            success:() => {
                setTimeout(() => {
                    this.takeback()
                    this.setData({
                        isPop: false
                    })
                }, 1500)
            }
        })
    },
    toggle_ball() {
        if(!this.data.isPop) {
            this.pop()
            this.setData({
                isPop: true
            })
        } else {
            this.takeback()
            this.setData({
                isPop: false
            })
        };
    },
    pop() {
        const animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        animationOne.translate(-80, -15).rotateZ(360).opacity(1).step()
        animationTwo.translate(-65, 40).rotateZ(360).opacity(1).step()
        animationThree.translate(-10, 65).rotateZ(360).opacity(1).step()
        this.setData({
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
        })
    },
    takeback() {
        const animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
        animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
        animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
        this.setData({
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
        })
    },
    _initHandler(title = "全力加载中") {
        const city = wx.getStorageSync('currentCity');
        wx.showLoading({
            title,
            mask: true
        });
        return this.getWeather(city).then(_ => {
            return getWeather(city, "forecast").then(res => {
                console.log(res);
                wx.hideLoading();
                if(res) {
                    xAxisArr.length = 0;
                    dayTemp.length = 0;
                    nightTemp.length = 0;
                    res.forecast.casts.forEach(v => {
                        xAxisArr.push(v.day);
                        dayTemp.push(v.daytemp);
                        nightTemp.push(v.nighttemp);
                        v.week = new Date(v.date.replace(/\-/g, "/")).getDay();
                        v.day = v.date.slice(5);
                    });
                    console.log(dayTemp);
                    this.setData({
                        forecast: res.forecast,
                        dayTemp,
                        nightTemp,
                        xAxisArr
                    });
                    setTimeout(() => {
                        this.selectComponent("#temp_chart").render();
                    }, 100);
                    return true
                };
                return false;
            })
        })
    },
    onShow: function () {
        this._initHandler().then(res => {
            if(!res) {
                wx.showToast({
                    title: '加载失败',
                    icon: 'fail',
                    duration: 1500
                })
            }
        });
    },
    refresh() {
        this._initHandler().then(res => {
            if(res) {
                wx.showToast({
                    title: '刷新成功',
                    icon: 'success',
                    duration: 1500
                })
            } else {
                wx.showToast({
                    title: '刷新失败',
                    icon: 'fail',
                    duration: 1500
                })
            }
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this._initHandler().then(res => {
            if(!res) {
                wx.showToast({
                    title: '加载失败',
                    icon: 'fail',
                    duration: 1500
                })
            }
        });
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