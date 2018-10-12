const amapFile = require("./sdk/amap-wx.js");

export const map_xcxKey = '6801647d803b1d5108721dc88aa68218';
export const map_jsKey = '5dfddda2499a49ee2dd3ef5a2ff19b7a';

/**
 * @param {*} areaName: string
 * @param {*} subdistrict: number 
 * @returns AreaInfo: promise 高德城市信息
 */
export function getAreaInfo(areaName, subdistrict) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://restapi.amap.com/v3/config/district',
            method: "get",
            data: {
                key: '5dfddda2499a49ee2dd3ef5a2ff19b7a',
                keywords: areaName,
                subdistrict
            },
            success(res) {
                if (res.statusCode === 200 && res.errMsg === 'request:ok') {
                    resolve(res.data)
                }
            },
            fail(error) {
                reject(error)
            }
        })
    })
}
/**
 *
 * @export
 * @param {*} adcode
 * @param {string} [type='live or forecast'] live实时天气 forecast预报天气
 * @returns promise 天气信息
 */
export function getWeather(city, type = 'live') {
    return new Promise((resolve, reject) => {
        const myAmapFun = new amapFile.AMapWX({
            key: map_xcxKey
        });
        if(city) {
            getAreaInfo(city).then(res => {
                if(res) {
                    const queryCode = res.districts[0].adcode;
                    myAmapFun.getWeather({
                        type,
                        city: queryCode,
                        success(res) {
                            resolve(res);
                        },
                        fail(info) {
                            wx.showToast({
                                title: '1获取信息失败',
                                duration: 1000
                            })
                            reject(info);
                        }
                    })
                } else {
                    reject({message: `未查询到${city}地区信息`})
                }
            })
        } else {
            myAmapFun.getWeather({
                type,
                city: "",
                success(res) {
                    resolve(res);
                },
                fail(info) {
                    wx.showToast({
                        title: '2获取信息失败',
                        duration: 10000
                    })
                    reject(info);
                }
            })
        }
    })

};

export function translate(keywords, type = "cn") {
    const mapList = [
        {
            weather_cn: "晴",
            weather_en: "sunny"
        },
        {
            weather_cn: "多云",
            weather_en: "cloudy"
        },
        {
            weather_cn: "阴",
            weather_en: "overcast"
        },
        {
            weather_cn: "雷阵雨",
            weather_en: "thunder_shower"
        },
        {
            weather_cn: "阵雨",
            weather_en: "shower"
        },
        {
            weather_cn: "小雨",
            weather_en: "light_rain"
        },
        {
            weather_cn: "中雨",
            weather_en: "rain"
        },
        {
            weather_cn: "大雨",
            weather_en: "heavy_rain"
        },
        {
            weather_cn: "暴雨",
            weather_en: "rainstorm"
        },
        {
            weather_cn: "大雨-暴雨",
            weather_en: "rainstorm2"
        },
    ];
    const ret = mapList.find(v => v.weather_cn === keywords || v.weather_en === keywords);
    try {
        return type === 'cn' ? ret.weather_en : ret.weather_cn;
    } catch(e) {
        return 'default'
    }
};
