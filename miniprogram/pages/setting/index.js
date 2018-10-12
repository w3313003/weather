Page({

    /**
     * 页面的初始数据
     */
    data : {
        is_wifiopen : true,
        networkType: ""
    },
    onChange({detail}){
        wx.makePhoneCall({
            phoneNumber: '21666666'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const ctx = this;
        wx.getNetworkType({
            success(res) {
                if(res.errMsg === "getNetworkType:ok") {
                    res.networkType === "wifi"
                    ctx.setData({
                        networkType: res.networkType,
                        is_wifiopen: res.networkType === "wifi"
                    })
                }
                console.log(res);
            }
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

    }
})