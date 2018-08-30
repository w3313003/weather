const echarts = require("../sdk/echarts.min");
const app = getApp();

function initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    return chart;
}
function setOption(chart, dayTemp, nightTemp, xAxis) {
    const min = Math.min(...[...nightTemp, ...dayTemp]);
    var option = {
        color: ["#ffbd3c", "#39bdfa"],
        grid: {
            x: 44,
            y: 25,
            x2: 44,
            y2: 30
        },
        tooltip: {
            show: false,
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
            show: false
        },
        yAxis: {
            x: 'center',
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            min,
            show: false
        },
        series: [{
            name: 'day',
            type: 'line',
            smooth: true,
            data: dayTemp,
            // 折点刻度
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    }
                }
            }
        }, {
            name: 'night',
            type: 'line',
            smooth: true,
            data: nightTemp,
            // 折点刻度
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    }
                }
            }
        }]
    };
    chart.setOption(option);
}
Component({
    properties: {
        dayTemp: {
            type: Array,
            value: []
        },
        nightTemp: {
            type: Array,
            value: []
        },
        xAxis: {
            type: Array,
            value: []
        }
    },
    data: {
        ec: {
            lazyLoad: true
        }
    },
    methods: {
        _init () {
            this.selectComponent('#ec').init((canvas, width, height) => {
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                console.log(this.data);
                setOption(chart, this.data.dayTemp, this.data.nightTemp, this.data.xAxis);
                this.chart = chart;
                this.setData({
                    isLoaded: true,
                    isDisposed: false
                });
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return chart;
            });
        },
        render() {
            this._init()
        }
    },
    onReady() {
        this.ecComponent = this.selectComponent('#ec');
    }
});