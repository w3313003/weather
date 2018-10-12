import { getAreaInfo, getWeather } from "../../common/util";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: "23.099994",
        longitude: "113.324520",
        markers: [{
            latitude: "23.099994",
            longitude: "113.324520"
        }]
    },
    mapMoveHandler() {
        this.getCenterLocation();
    },
    getCenterLocation() {
        this.mapCtx.getCenterLocation({
            success: res => {
                console.log(res);
                const { longitude, latitude } = res;
                this.setData({
                    // longitude,
                    // latitude,
                    markers: [{
                        longitude,
                        latitude
                    }]
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getLocation({
            type: "wgs84",
            success: res => {
                if(res.errMsg === "getLocation:ok") {
                    const { longitude, latitude } = res;
                    this.setData({
                        longitude,
                        latitude,
                        markers: [{
                            longitude,
                            latitude
                        }]
                    })
                }
            }
        })
    },
    onReady: function () {
        this.mapCtx = wx.createMapContext('map')
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

    }
})