// 元素
const echarts_div = echarts.init(document.getElementById('echarts_div'))

// 色彩
const colorList = [
    '#ff8080', '#0080ff', '#8080ff', '#30EE30', '#feb400', '#feb400', '#EEEEEE'
]

// 拍每分钟
var bpm = 0

// 拍键时列表
var beat_key_time_list = []
// 切片拍数
var part_beat_total = 0

// 时间列表
var time_list = []

// 按键名列表
const key_name_list = ["圆圈", "叉叉", "方框", "三角", "向左", "向右"]

// echarts可见区域时间范围长度
var echarts_view_range_length = 2
// 可见区域切片序号
var show_part_num = 0

// 使用中的echarts模板
var echarts_option = {}

// echarts配置模板
const basic_echarts_option = {
    xAxis: [
        {   // bpm轴
            show: true,
            type: "value",
            // scale: true,
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
                    if (value % 1 == 0) {
                        return time_to_string(value, false)
                    }
                },
            }
        }
    ],
    yAxis: [{
        splitLine: {
            show: true,
        },
        type: "category",
        data: key_name_list,
    }, {
        show: false,
        type: "value",
        data: [0, 1, 2, 3]
    }],
    series: [
        {
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
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
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'bar',
            barWidth: 5,
            itemStyle: {
                normal: {
                    color: function (params) {
                        if (params.dataIndex == last_of_time_part()) {
                            return "#1E9FFF"
                        } else {
                            return "#009688"
                        }
                    }
                }
            }
        }
    ],
    tooltip: {
        show: true,
        formatter: function (params) {
            if (params.componentIndex == 1) {
                return `<div>${time_to_string(params.data[0])}</div>`
            } else {
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
        }
    },
    grid: {
        left: "center",
        width: "90%",
    },
    animation: false,
}

// ---------------- 事件 ----------------
window.onresize = function () {
    echarts_div.resize();
}
// echarts按下beat_key
echarts_div.on('mousedown', 'series', function (params) {
    if (params.componentIndex == 1) {
        return false
    }
    change_beat_key_holding({ event_params_data: params.data })
})

// 按下按键
function key_down(key) {
    change_beat_key_holding({
        beat_time: time_list[show_part_num][last_of_time_part()][0],
        key: key
    })
}

// ---------------- 操作函数 ----------------
// 初始化echarts
function init_echarts(params_bpm, time_length) {
    $.extend(true, echarts_option, basic_echarts_option)

    // 拍每分钟
    bpm = params_bpm

    // 按键列表
    beat_key_time_list = []
    // 切片拍数
    part_beat_total = params_bpm / 60 * echarts_view_range_length
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
        // 切片拍索引
        // 每拍添加数据
        while (beat_time < (key_time_part_num + 1) * echarts_view_range_length) {
            beat_index++
            beat_time = beat_index * (60 / bpm)
            // 添加按键
            for (var key_index = 0; key_index < key_name_list.length; key_index++) {
                // [拍所在时间, 键索引, 是否按下, 拍索引]
                key_time_part.push([
                    beat_time, key_index, false, beat_index,
                ])
            }
        }
        beat_key_time_list.push(key_time_part)
    }
    // 时间列表
    // 按可见长度切片
    var time = 0
    for (var time_part_num = 0; time_part_num < Math.ceil(time_length / echarts_view_range_length); time_part_num++) {
        var time_part = []
        // 每秒添加数据
        while (time <= (time_part_num + 1) * echarts_view_range_length) {
            // time_part.push([time, -1])
            time_part.push([time, 1])
            // time_part.push([0, 1], [1, 1], [2, 1], [3, 1])
            time++
        }
        time--
        time_part.push([time_part[0][0], 1])
        time_list.push(time_part)
    }

    echarts_option.xAxis[0].interval = 60 / bpm
    set_echarts_show_area()
}

// 修改按键状态
function change_beat_key_holding(beat_key_params) {
    var info = get_beat_key_time_info(beat_key_params)
    console.log(info)
    beat_key_time_list[info.this_show_part_index][info.this_show_part_son_index][2] = !info.this_holding
    if (show_part_num == info.this_show_part_index) {
        // set_echarts_show_area()
        echarts_div.setOption(echarts_option)
    }
}

// 刷新表格
function echarts_update(now_time) {
    var beat_key_time_info = time_nearest_beat_key(now_time)
    if (show_part_num != beat_key_time_info.this_show_part_index) {
        show_part_num = beat_key_time_info.this_show_part_index
        set_echarts_show_area(false)
    }
    time_list[show_part_num][last_of_time_part()][0] = beat_key_time_info.this_beat_time
    echarts_div.setOption(echarts_option)
}

// 更新表格显示区域
function set_echarts_show_area(reset_option = true) {
    echarts_option.series[0].data = beat_key_time_list[show_part_num]
    echarts_option.series[1].data = time_list[show_part_num]

    echarts_option.xAxis[0].min = time_list[show_part_num][0][0]
    echarts_option.xAxis[0].max = time_list[show_part_num][time_list[show_part_num].length - 2][0]
    if (reset_option) {
        echarts_div.setOption(echarts_option)
    }
}

// ---------------- 工具函数 ----------------
// 拍数转在秒内的排数
function beat_to_beat_of_second(beat) {
    return beat % (bpm / 60)
}

// 时间切片最后一位索引
function last_of_time_part() {
    return time_list[show_part_num].length - 1
}

// 时间接近的beat_time
function time_nearest_beat_time(time) {
    return time_nearest_beat_key(time).this_beat_time
}

// 压缩键时信息(只保留按下的键)
function zip_beat_key_time_list() {
    var temp_beat_key_time_list = []
    beat_key_time_list.forEach(each_part => {
        each_part.forEach(each_key_time => {
            if (each_key_time[2]) {
                temp_beat_key_time_list.push(each_key_time)
            }
        })
    })
    return temp_beat_key_time_list
}

// 时间最接近的 拍键时 信息
function time_nearest_beat_key(time, key = false) {
    var part_num = Math.floor(time / echarts_view_range_length)
    // 所在切片
    var beat_key_time_part = beat_key_time_list[part_num]

    // 距离目标时间距离
    var distance = false
    // 上次获取到的信息
    var last_data = []

    if (part_num != 0) {
        last_data = beat_key_time_list[part_num - 1][beat_key_time_list[part_num - 1].length - 1]
        distance = Math.abs(last_data[0] - time)
    }

    if (key === false) {
        key = 0
    }

    for (var index = key; index < beat_key_time_part.length; index += key_name_list.length) {
        var each = beat_key_time_part[index]
        if (distance === false) {
            distance = Math.abs(each[0] - time)
            last_data = each
            continue
        }
        if (distance < Math.abs(each[0] - time)) {
            break
        } else {
            distance = Math.abs(each[0] - time)
        }
        last_data = each
    }

    return get_beat_key_time_info({ event_params_data: last_data })
}

// 修改 时间最接近的 键拍 的 按下状态
function change_time_nearest_beat_key_holding(time, key = false, holding = undefined) {
    if (key === false) {
        key = step_fill_array(6)
    } else if (typeof (key) == "number") {
        key = [key]
    }
    key.forEach(each => {
        var info = time_nearest_beat_key(time, each)
        if (holding == undefined) {
            beat_key_time_list[info.this_show_part_index][info.this_show_part_son_index][2] =
                !beat_key_time_list[info.this_show_part_index][info.this_show_part_son_index][2]
        } else {
            beat_key_time_list[info.this_show_part_index][info.this_show_part_son_index][2] = holding
        }
    })
    echarts_div.setOption(echarts_option)
}

// 下一拍的某个key
function beat_key_of_next_beat(params) {
    var this_beat_key = get_beat_key_time_info(params)
    console.log(this_beat_key)
}

// 某个key下一次被按下的时间

// 上一拍的某个key

// 获取 拍键时 信息
function get_beat_key_time_info(params) {
    // 所在拍键时切片索引
    var this_show_part_index = false
    // 所在拍键时切片子索引
    var this_show_part_son_index = false
    // 拍所在时间
    var this_beat_time = false
    // 键索引
    var this_key_index = false
    // 键是否被按下
    var this_holding = false
    // 拍索引
    var this_beat_index = false
    if (params.frame) {
    } else if (params.event_params_data) {
        return get_beat_key_time_info({ beat: params.event_params_data[3], key: params.event_params_data[1] })
        this_show_part_index = Math.floor((params.event_params_data[3] - 1) / part_beat_total)
        this_show_part_son_index = ((params.event_params_data[3] - 1) * key_name_list.length + params.event_params_data[1]) - (this_show_part_index * part_beat_total * key_name_list.length)
        this_beat_time = params.event_params_data[0]
        this_key_index = params.event_params_data[1]
        this_holding = params.event_params_data[2]
        this_beat_index = params.event_params_data[3]
    } else if (params.beat !== undefined && params.key !== undefined) {
        this_show_part_index = Math.floor((params.beat - 1) / part_beat_total)
        this_show_part_son_index = ((params.beat - 1) * key_name_list.length + params.key) - (this_show_part_index * part_beat_total * key_name_list.length)
        var beat_key_time_part = beat_key_time_list[this_show_part_index][this_show_part_son_index]
        this_beat_time = beat_key_time_part[0]
        this_key_index = beat_key_time_part[1]
        this_holding = beat_key_time_part[2]
        this_beat_index = beat_key_time_part[3]
    } else if (params.beat_time !== undefined && params.key !== undefined) {
        return time_nearest_beat_key(params.beat_time, params.key)
    }
    return {
        this_show_part_index: this_show_part_index,
        this_show_part_son_index: this_show_part_son_index,
        this_beat_time: this_beat_time,
        this_key_index: this_key_index,
        this_holding: this_holding,
        this_beat_index: this_beat_index,
    }
}