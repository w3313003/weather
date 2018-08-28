import { map_xcxKey, getAreaInfo, getWeather } from "../../common/util";
import areaData from "../../common/area.js";
import { cities } from '../../common/cities.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: [],
    searchResult: [],
    showResult: false
  },
  onChange({detail}) {
    // 相当于onChange(event) => event.detail;
    console.log(detail)
  },
  selectHandler(event) {
    const keywrod = event.target.dataset.city.name;
    wx.setStorageSync("currentCity", keywrod)
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/main/index'
      })
    }, 100)
  },
  
  inputHandler(event) {
    const { value } = event.detail;
    if(!value) {
      this.setData({
        searchResult: [],
        showResult: false
      })
      return false;
    }
    const ret = [];
    const searchReg = new RegExp(`^${value}[A-z]*`)
    this.data.cities.forEach(v => {
      v.list.forEach(city => {
        const keyWrod = value.toLowerCase();
        if(searchReg.test(city.pinyin) || city.name.indexOf(keyWrod) > -1) {
          ret.push(city)
        }
      })
    });
    this.setData({
      searchResult: ret,
      showResult: true
    });
    console.log(this.data.searchResult);
  },
  _initList() {
    let storeCity = new Array(26);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    })
    cities.forEach((item) => {
      let firstName = item.pinyin.substring(0, 1);
      let index = words.indexOf(firstName);
      storeCity[index].list.push({
        pinyin: item.pinyin.toLowerCase(),
        name: item.name,
        key: firstName
      });
    })
    this.data.cities = storeCity;
    this.setData({
      cities: this.data.cities
    })
  },
  onLoad: function (options) {
    // getWeather('', 'forecast').then(res => {
    //   console.log(res);
    // })
    // getAreaInfo("宿州", 3).then(res => {
    //   console.log(res);
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this._initList();
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