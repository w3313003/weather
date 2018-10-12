const app = getApp()
const wxCharts = require("../../common/sdk/wx_chart");

import {
    map_xcxKey,
    getAreaInfo,
    getWeather,
    translate
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
        y: 30,
        top: 0,
        isPop: false
    },
    relocate() {
        wx.clearStorageSync();
        this._initHandler("重新定位中").then(res => {
            if (res) {
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
            if (res.weather.data === "晴") {
                weather = "sunny"
            } else if (res.weather.data === "多云") {
                weather = "cloudy"
            } else if (res.weather.data === "阴") {
                weather = "overcast"
            } else if (["中雨", "小雨", "大雨", "阵雨"].includes(res.weather.data)) {
                weather = "rain"
            } else {
                weather = ""
            }
            this.setData({
                currentCityInfo: res.liveData,
                isNight: new Date(date).getHours() >= 18 || new Date(date).getHours() <= 6,
                weather,
            });
            return true;
        }).catch(e => {
            console.log(e);
            if(e.errMsg.includes("getLocation:fail")) {
                wx.showModal({
                    title: "自动定位失败",
                    content: "是否尝试手动选择地址?",
                    confirm:() => {
                        this.chooseCity();
                    },
                    cancel: () => {

                    }
                });
            }
            
            return false;
        });;
    },
    getOpenId() {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success(res) {
                app.globalData.openid = res.result.openid;
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
        if (type === "person") {
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
            success: () => {
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
        if (!this.data.isPop) {
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
        animationThree.translate(0, 0).rotateZ(0).opacity(0).z()
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
            if(!_) {
                return false
            };
            return getWeather(city, "forecast").then(res => {
                wx.hideLoading();
                if (res) {
                    xAxisArr.length = 0;
                    dayTemp.length = 0;
                    nightTemp.length = 0;
                    res.forecast.casts.forEach(v => {
                        xAxisArr.push(v.day);
                        dayTemp.push(v.daytemp);
                        nightTemp.push(v.nighttemp);
                        v.week = new Date(v.date.replace(/\-/g, "/")).getDay();
                        v.day_weather = translate(v.dayweather);
                        v.night_weather = translate(v.nightweather);
                        v.day = v.date.slice(5);
                    });
                    console.log(res.forecast);
                    this.setData({
                        forecast: res.forecast,
                        dayTemp,
                        nightTemp,
                        xAxisArr
                    });
                    setTimeout(() => {
                        this.selectComponent("#temp_chart").render();
                    }, 500);
                    return true
                };
                return false;
            })
        })
    },
    onLoad() {
        // wx.getSetting({
        //     success(res) {
        //         if(!res.authSetting["scope.userLocation"]) {
        //             wx.authorize({
        //                 scope: "scope.userLocation",
        //                 success() {
        //                     wx.getLocation();
        //                 }
        //             })
        //         }
        //     }
        // });
        this._initHandler().then(res => {
            if (!res) {
                wx.showToast({
                    title: '加载失败',
                    icon: 'fail',
                    duration: 1500
                })
            }
        });
    },
    onShow: function () {
        const needRefresh = wx.getStorageSync("needRefresh");
        if (needRefresh) {
            this._initHandler().then(res => {
                if (!res) {
                    wx.showToast({
                        title: '加载失败',
                        icon: 'fail',
                        duration: 1500
                    })
                }
            });
            wx.clearStorageSync("needRefresh");
        }
    },
    refresh() {
        this._initHandler().then(res => {
            if (res) {
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
        this.refresh();
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