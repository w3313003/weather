const amapFile = require("./sdk/amap-wx.js");

export const map_xcxKey = '6801647d803b1d5108721dc88aa68218';
export const map_jsKey = '5dfddda2499a49ee2dd3ef5a2ff19b7a';

/**
 * @param {*} areaName: string
 * @param {*} subdistrict: number 
 * @returns AreaInfo: object 返回高德城市信息
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
 * @returns object 天气信息
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
                                title: '获取信息失败',
                                icon: "fail",
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
                success(res) {
                    resolve(res);
                },
                fail(info) {
                    wx.showToast({
                        title: '获取信息失败',
                        icon: "fail",
                        duration: 1000
                    })
                    reject(info);
                }
            })
        }
    })

}