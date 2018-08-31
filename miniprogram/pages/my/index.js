Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        needAuth: false
    },
    onGetUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            needAuth: false
        });
    },
    onLoad(options) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                userInfo: res.userInfo
                            });
                        }
                    });
                } else {
                    this.setData({
                        needAuth: true
                    })
                }
            }
        });
    },
    onShow() {
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