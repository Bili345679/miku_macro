// ----------- 测试用 - start -----------
// video_div充满剩下的高度
$("#video_div").height($("body").height() - $("#time_line_div").height() - $("#time_button_list_div").height())
$("#temp_btn").click(function () {
    // video_player.src({ type: "video/mp4", src: "file:///E:/Nvdia%E5%BD%95%E5%83%8F/Desktop/Desktop%202022.10.07%20-%2012.27.51.01.mp4" })
    // video_player.load("file:///E:/Nvdia%E5%BD%95%E5%83%8F/Desktop/Desktop%202022.10.07%20-%2012.27.51.01.mp4")
})
// ----------- 测试用 - end -----------

// ----------- 视频播放器 - start -----------
// 初始化播放器宽度
var video_player_height = $("#video_player").height()
var video_player_width = video_player_height / 1080 * 1920
$("#video_player").width(video_player_width)
var video_player_options = {
    controlBar: {
        fullscreenToggle: false,
        "pictureInPictureToggle": false
    }
}
var video_player = videojs('video_player', video_player_options, function onPlayerReady() {
    // 禁用全屏
    this.tech_.off('dblclick');

    // 调整播放器尺寸
    this.on('canplay', function () {
        // 长宽比
        var video_height = this.videoHeight()
        var video_width = this.videoWidth()
        var ratio = video_width / video_height
        ratio = ratio > 0.5 ? ratio : 0.5
        // 宽度
        var video_player_height = $("#video_player").height()
        var video_player_width = video_player_height * ratio
        // 调整宽度
        $("#video_player").width(video_player_width)
        $("#video_player").children("video").width(video_player_width)

        // 视频长度
        $("#duration").val(this.duration())
    })
})

// 加载视频
var video_info = {}
$("#fileinput_btn").click(function () {
    $("#fileinput").click();
})
const onChangeFile = (mediainfo) => {
    const file = $("#fileinput")[0].files[0]

    // 加载视频
    var video_src = get_object_url(file)
    video_player.src({ type: "video/mp4", src: video_src })
    video_player.load(video_src)

    if (file) {
        $("#fileinput_info").val("读取中")

        const getSize = () => file.size

        const readChunk = (chunkSize, offset) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target.error) {
                        reject(event.target.error)
                    }
                    resolve(new Uint8Array(event.target.result))
                }
                reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
            })

        mediainfo
            .analyzeData(getSize, readChunk)
            .then((result) => {
                set_video_info(result)
                $("#fileinput_info").val("读取成功")
            })
            .catch((error) => {
                $("#fileinput_info").val("读取失败")
                console.log(error.stack)
            })
    }
}
MediaInfo({ format: 'text' }, (mediainfo) => {
    $("#fileinput").change(() => onChangeFile(mediainfo))
})
// input获取到的本地视频链接
function get_object_url(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
// 视频信息
function set_video_info(result) {
    video_info = {}
    // console.log(result)
    result = result.split("\n").filter((each) => {
        return each != ""
    })
    var parent_key = ""
    result.forEach(each => {
        if (each.search(/\s+:\s/) == -1) {
            parent_key = each
            video_info[parent_key] = {}
            return false
        }
        var key = each.substr(0, each.search(/:/)).replaceAll(" ", "")
        var value = each.substr(each.search(/:/) + 2)
        video_info[parent_key][key] = value
    });
    console.log(video_info)
    console.log(video_info.Video)

    // 数据处理
    // 帧率
    video_info.Video.Framerate = parseFloat(video_info.Video.Framerate.replace(" FPS", ""))
    // 视频长度
    video_info.Video.Duration = video_player.duration()
    // 帧数
    video_info.Video.FrameTotal = video_info.Video.Duration * video_info.Video.Framerate
    // 帧时间
    video_info.Video.FrameTime = 1 / video_info.Video.Framerate

    $("#fps").val(video_info.Video.Framerate)
    $("#duration").val(time_to_string(video_info.Video.Duration))
    $("#frame_total").val(video_info.Video.FrameTotal)
    $("#frame_time").val(video_info.Video.FrameTime.toFixed(3))
    $("#now_frame").val(0);
    $("#now_time").val(time_to_string(0));

    // 循序编辑当前帧数/时间
    $("#now_frame").attr('disabled', false);
    $("#now_time").attr('disabled', false);
}

// 控件
var frame_jump_step = 5
var time_jump_step = 5
var now_frame = 0
var now_time = 0
// 前一帧
$("#last_frame").click(function () {
    jump_to_frame(now_frame - 1)
})
// 后一帧
$("#next_frame").click(function () {
    jump_to_frame(now_frame + 1)
})
// 前(步进)帧
$("#last_step_frame").click(function () {
    jump_to_frame(now_frame - frame_jump_step)
})
// 后(步进)帧
$("#next_step_frame").click(function () {
    // if(now_frame() == 0){
    //     return false
    // }
    jump_to_frame(now_frame + frame_jump_step)
})
// 当前帧数跳转
$("#now_frame").change(function () {
    var input_val = $(this).val()
    if (!is_integer(input_val)) {
        update_now_info()
        return false
    }
    jump_to_frame(parseInt(input_val))
})

// 事件
var video_player_playing_flag = false
video_player.on("play", function () {
    video_player_playing_flag = true
    // 禁止修改当前帧数与当前时间
    $("#now_frame").attr('disabled', true);
    $("#now_time").attr('disabled', true);
    start_play_interval();
})
video_player.on("pause", function () {
    video_player_playing_flag = false
    $("#now_frame").attr('disabled', false);
    $("#now_time").attr('disabled', false);
    clearInterval(play_interval)
})
// 帧数步进
$("#frame_jump_step").change(function () {
    var input_val = $(this).val()
    if (!is_integer(input_val)) {
        $(this).val(frame_jump_step)
        return false
    }
    frame_jump_step = parseInt(input_val)
    $("#last_step_frame").text(`前(${frame_jump_step})帧`)
    $("#next_step_frame").text(`后(${frame_jump_step})帧`)
})

// 循环
var play_interval = false
function start_play_interval() {
    play_interval = setInterval(() => {
        update_now_info()
    }, video_info.Video.FrameTime);
}

// 帧数跳转
function jump_to_frame(frame) {
    jump_to((frame + 0.1) * video_info.Video.FrameTime)
}
// 跳转到时间
function jump_to(time) {
    video_player.currentTime(time)
    update_now_info()
}

// 更新播放时间显示
function update_now_info() {
    now_frame = Math.round(video_player.currentTime() / video_info.Video.FrameTime)
    now_time = video_player.currentTime()
    console.log(now_frame)
    console.log(now_time)
    $("#now_frame").val(now_frame);
    $("#now_time").val(time_to_string(now_time));
}

// ----------- 视频播放器 - end -----------


// ----------- 时间轴 - start -----------
// KB 键_节拍
var echart_div = echarts.init(document.getElementById('echart_div'))
console.log(echart_div)
// 色彩
var colorList = [
    '#ff8080', '#0080ff', '#8080ff', '#30EE30', '#feb400', '#feb400', '#EEEEEE'
]


var now_key = 0
var now_beat = 0
// 谱面时长
// var map_time = 3 * 60 + 40
var map_time = 60 * 3
var bpm = 340
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
                    return second_to_string(value)
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
            now_time = second_to_string(params.data[0])
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
        endValue: 10
    }]
}

// 使用刚指定的配置项和数据显示图表。
echart_div.setOption(option)

// ---------------- 事件 ----------------
window.onresize = function () {
    echart_div.resize();
}

var hold_start_KB = false
var hold_start_option_for_mouseup = false
// 按下
echart_div.on('mousedown', 'series', function (params) {
    hold_start_KB = get_KB_info({ event_params: params })
    hold_start_option_for_mouseup = $.extend(true, hold_start_option_for_mouseup, option)
})
// 抬起
echart_div.on('mouseup', 'series', function (params) {
    var hold_end_KB = get_KB_info({ event_params: params })
    if (!hold_start_KB) {
        return false
    }
    // 选择范围
    var index_range_list = get_index_range_list(hold_start_KB.index, hold_end_KB.index)
    if (index_range_list.length == 0) {
        echart_div.setOption(hold_start_option_for_mouseup)
    }
    index_range_list.forEach(each_index => {
        hold_start_option_for_mouseup.series[0].data[each_index][2] = !hold_start_KB.holding
    })
    // 选择
    echart_div.setOption(hold_start_option_for_mouseup)

    // 重置
    hold_start_KB = false
    hold_start_option_for_mouseup = false
})
// 悬浮
echart_div.on("mouseover", "series", function (params) {
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
    echart_div.setOption(hold_start_option_for_mouseover)
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

// 秒数格式化
function second_to_string(second_num) {
    var minute = parseInt(second_num / 60)
    var second = parseInt(second_num - minute * 60)
    second = second < 10 ? "0" + second : second
    return minute + ":" + second
}