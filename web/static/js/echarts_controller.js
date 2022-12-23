// 元素
const echarts_div = echarts.init(document.getElementById('echarts_div'))

// 色彩
const colorList = [
    '#ff8080', '#0080ff', '#8080ff', '#30EE30', '#feb400', '#feb400', '#EEEEEE'
]

// 拍每分钟
var bpm = 0

// 键时列表
var key_time_list = []

// 时间列表
var time_list = []

// 按键列表
const key_list = ["l", "k", "j", "i", "u", "o",]

// 按键名列表
const key_name_list = ["圆圈", "叉叉", "方框", "三角", "向左", "向右"]

// echarts可见区域时间范围长度
var echarts_view_range_length = 3
// 可见区域切片序号
var show_part_num = 0

const basic_echarts_option = {
    xAxis: [
        {   // bpm轴
            show: true,
            type: "value",
            scale: true,
            axisLabel: {
                show: true,
                rotate: -45,
                formatter: function (value, index) {
                    if ((value / echarts_option.xAxis[0].interval).toFixed() % 10 == 0) {
                        return (value / echarts_option.xAxis[0].interval).toFixed() + "\n"
                    } else {

                    }
                },
            }
        },
        {   // 时间轴
            show: true,
            type: "value",
            scale: true,
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
        data: key_name_list,
    },
    series: [
        {
            symbolSize: 10,
            type: 'scatter',
            symbol: function (value, params) {
                return "rect"
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
            type: 'scatter',
        }
    ],
    tooltip: {
        show: true,
        formatter: function (params) {
            var now_time = time_to_string(params.data[0], false)
            var now_key = params.data[1]
            var now_beat = params.data[3]
            var beat_of_second = beat_to_beat_of_second(now_beat)
            return `<div style='color:${colorList[params.data[1]]}'>
                        ${params.name}
                        <br> 
                        时间：${now_time}
                        <br> 
                        拍：${now_beat}
                        <br>
                        秒内拍：${beat_of_second}
                    </div>`
        }
    },
    grid: {
        left: "center",
        width: "90%",
    }
}

var echarts_option = {}

// 初始化echarts
function init_echarts(params_bpm, time_length) {
    $.extend(true, echarts_option, basic_echarts_option)

    // 拍每分钟
    bpm = params_bpm

    // 按键列表
    key_time_list = []
    // 时间列表
    time_list = []
    // 切片序号
    show_part_num = 0

    // 按键列表
    // 按可见长度切片
    var beat_index = 0
    var beat_time = 0
    for (var key_time_part_num = 0; key_time_part_num < Math.ceil(time_length / echarts_view_range_length); key_time_part_num++) {
        var key_time_part = []
        // 每拍添加数据
        while (beat_time < (key_time_part_num + 1) * echarts_view_range_length) {
            beat_index++
            beat_time = beat_index * (60 / bpm)
            // 添加按键
            for (var key_index = 0; key_index < key_list.length; key_index++) {
                // [拍所在时间, 键索引, 是否按下, 拍索引]
                key_time_part.push([
                    beat_time, key_index, false, beat_index
                ])
            }
        }
        key_time_list.push(key_time_part)
    }
    // 时间列表
    // 按可见长度切片
    var time = 0
    for (var time_part_num = 0; time_part_num < Math.ceil(time_length / echarts_view_range_length); time_part_num++) {
        var time_part = []
        // 每秒添加数据
        while (time <= (time_part_num + 1) * echarts_view_range_length) {
            time_part.push([time, -1])
            time++
        }
        time_list.push(time_part)
    }

    echarts_option.xAxis[0].interval = 60 / bpm
    echarts_option.series[0].data = key_time_list[0]
    echarts_option.series[1].data = time_list[0]

    echarts_div.setOption(echarts_option)
}

// 修改展示区域
function change_echarts_show_range(now_time) {
    if (now_time >= show_part_num * echarts_view_range_length &&
        now_time <= (show_part_num + 1) * echarts_view_range_length) {
        return false
    }
    if (now_time < show_part_num * echarts_view_range_length) {
        while (now_time < show_part_num * echarts_view_range_length) {
            show_part_num--
        }
    } else {
        while (now_time > (show_part_num + 1) * echarts_view_range_length) {
            show_part_num++
        }
    }

    echarts_option.series[0].data = key_time_list[show_part_num]
    echarts_option.series[1].data = time_list[show_part_num]
    echarts_div.setOption(echarts_option)
}

// ---------------- 事件 ----------------
window.onresize = function () {
    echarts_div.resize();
}
// 按下
echarts_div.on('mousedown', 'series', function (params) {
    console.log(params.data)
})

// ---------------- 工具函数 ----------------
// 拍数转在秒内的排数
function beat_to_beat_of_second(beat) {
    return beat % (bpm / 60)
}

// 获取 键时 信息
function get_key_time_info(params) {
    // 所在键时切片
    var this_show_part_num
    // 所在键时切片的索引
    var this_index
    // 拍所在时间
    var this_beat_time
    // 键索引
    var this_key_index
    // 键是否被按下
    var this_holding
    // 拍索引
    var this_beat_index
    if (params.event_params) {
    } else if (params.index) {
    } else if (params.KB) {
    } else {
    }
    return {
        index: index,
        key: key,
        beat: beat,
        holding: holding,
        time: time,
    }
}