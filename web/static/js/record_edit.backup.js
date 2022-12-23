// ----------- 时间轴 - start -----------
// KB 键_节拍
var echarts_div = echarts.init(document.getElementById('echarts_div'))
console.log(echarts_div)
// 色彩
var colorList = [
    '#ff8080', '#0080ff', '#8080ff', '#30EE30', '#feb400', '#feb400', '#EEEEEE'
]

// echarts可见区域时间范围长度
var echarts_view_range_length = 3

var now_key = 0
var now_beat = 0
// 谱面时长
// var map_time = 3 * 60 + 40
var map_time = 60 * 3
// var bpm = 340
var bpm = 60 * 30
// 按键数量
var key_total = 6

// 初始化数据
var data = []
var beat = 0
while (beat < map_time / 60 * bpm) {
    beat++
    beat_at_time = beat * 60 / bpm
    for (var num = 0; num < key_total; num++) {
        data.push([
            beat_at_time, num, false, beat
        ])
    }
}

var time_data = []
var now_time = 0
while (now_time < map_time) {
    time_data.push([now_time, -1])
    now_time++
}

// 指定图表的配置项和数据
var option = {
    xAxis: [
        {   // bpm轴
            show: true,
            type: "value",
            interval: 60 / bpm,
            axisLabel: {
                show: true,
                rotate: -45,
                formatter: function (value) {
                    // return (value / (60 / bpm)).toFixed()
                    if ((value / (60 / bpm)).toFixed() % 10 == 0) {
                        return (value / (60 / bpm)).toFixed()
                    } else {

                    }
                },
            }
        },
        {   // 时间轴
            show: true,
            type: "value",
            position: "top",
            interval: 1,
            alignTicks: true,
            axisLabel: {
                show: true,
                formatter: function (value) {
                    return time_to_string(value, false)
                },
            }
        }
    ],
    yAxis: {
        splitLine: {
            show: true,
        },
        type: "category",
        data: ["圆圈", "叉叉", "方框", "三角", "向左", "向右"],
    },
    series: [
        {
            symbolSize: 10,
            data: data,
            type: 'scatter',
            symbol: function (value, params) {
                return "rect"
                if (!value[2]) {
                    return "rect"
                }
            },
            symbolSize: [
                10, 30
            ],
            itemStyle: {
                normal: {
                    color: function (params) {
                        if (!params.data[2]) {
                            return colorList[colorList.length - 1]
                        }
                        return colorList[params.data[1]]
                    }
                }
            }
        }, {
            symbolSize: 10,
            xAxisIndex: 1,
            data: time_data,
            type: 'scatter',
        }
    ],
    tooltip: {
        show: true,
        formatter: function (params) {
            console.log(params.data[0])
            now_time = time_to_string(params.data[0], false)
            now_key = params.data[1]
            now_beat = params.data[3]
            return `<div style='color:${colorList[params.data[1]]}'>
                            ${params.name} 
                            ${now_time}
                            ${now_beat}
                        </div>`
        }
    },
    dataZoom: [{
        xAxisIndex: [0, 1],
        endValue: 3
    }]
}

// 初始化
function init_echarts(bpm) {

}
// 使用刚指定的配置项和数据显示图表。
echarts_div.setOption(option)

// ---------------- 事件 ----------------
window.onresize = function () {
    echarts_div.resize();
}

var hold_start_KB = false
var hold_start_option_for_mouseup = false
// 按下
echarts_div.on('mousedown', 'series', function (params) {
    hold_start_KB = get_KB_info({ event_params: params })
    hold_start_option_for_mouseup = $.extend(true, hold_start_option_for_mouseup, option)
})
// 抬起
echarts_div.on('mouseup', 'series', function (params) {
    var hold_end_KB = get_KB_info({ event_params: params })
    if (!hold_start_KB) {
        return false
    }
    // 选择范围
    var index_range_list = get_index_range_list(hold_start_KB.index, hold_end_KB.index)
    if (index_range_list.length == 0) {
        echarts_div.setOption(hold_start_option_for_mouseup)
    }
    index_range_list.forEach(each_index => {
        hold_start_option_for_mouseup.series[0].data[each_index][2] = !hold_start_KB.holding
    })
    // 选择
    echarts_div.setOption(hold_start_option_for_mouseup)

    // 重置
    hold_start_KB = false
    hold_start_option_for_mouseup = false
})
// 悬浮
echarts_div.on("mouseover", "series", function (params) {
    if (!hold_start_KB) {
        return false
    }

    var hold_end_KB = get_KB_info({ event_params: params })
    var hold_start_option_for_mouseover = $.extend(true, hold_start_option_for_mouseover, hold_start_option_for_mouseup)

    // 选择范围
    var index_range_list = get_index_range_list(hold_start_KB.index, hold_end_KB.index)
    index_range_list.forEach(each_index => {
        hold_start_option_for_mouseover.series[0].data[each_index][2] = !hold_start_KB.holding
    })
    // 选择
    echarts_div.setOption(hold_start_option_for_mouseover)
})

// ---------------- 工具函数 ----------------
// KB信息
function get_KB_info(params) {
    var index, key, beat, holding, time
    if (params.event_params) {
        var event_params = params.event_params.value
        time = event_params[0]
        key = event_params[1]
        holding = event_params[2]
        beat = event_params[3]
        index = key + (beat - 1) * key_total
    } else if (params.index) {
        index = params.index
        var index_params = option.series[0].data[index]
        time = index_params[0]
        key = index_params[1]
        holding = index_params[2]
        beat = index_params[3]
    } else if (params.KB) {
        key = KB.key
        beat = KB.beat
        index = key + (beat - 1) * key_total
        time = index_params[0]
        holding = index_params[2]
    } else {
        return false
    }
    return {
        index: index,
        key: key,
        beat: beat,
        holding: holding,
        time: time,
    }
}

function get_index_range_list(start_index, end_index) {
    var index_range_list = []
    if (start_index > end_index) {
        var temp_index = start_index
        start_index = end_index
        end_index = temp_index
    }
    if ((start_index - end_index) % key_total != 0) {
        return index_range_list
    }
    var now_index = start_index
    while (now_index <= end_index) {
        index_range_list.push(now_index)
        now_index += key_total
    }
    return index_range_list
}