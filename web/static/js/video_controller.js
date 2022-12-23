// ----------- 视频播放器 - start -----------

// 帧跳转步进
var frame_jump_step = 5
// 时间跳转步进
var time_jump_step = 5
// 当前帧
var now_frame = 0
// 当前时间
var now_time = 0

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

// 初始化视频播放器
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
        $("#duration").val(time_to_string(this.duration()))
    })
})

// 加载视频并读取视频信息
var video_info = {}
var video_loaded_flag = false
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
                video_loaded_flag = true
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
// 播放/暂停
function play_or_pause() {
    if (!video_loaded_flag) {
        return false
    }
    if (video_player.paused()) {
        video_player.play()
    } else {
        video_player.pause()
    }
}

// 帧操作
// 前一帧
function last_frame() {
    jump_to_frame(now_frame - 1)
}
// 后一帧
function next_frame() {
    jump_to_frame(now_frame + 1)
}
// 前(步进)帧
function last_step_frame() {
    jump_to_frame(now_frame - frame_jump_step)
}
// 后(步进)帧
function next_step_frame() {
    jump_to_frame(now_frame + frame_jump_step)
}

// 当前帧数跳转
function now_frame_jump() {
    var input_val = $("#now_frame").val()
    if (!is_integer(input_val)) {
        update_now_info()
        return false
    }
    jump_to_frame(parseInt(input_val))
}

// 时间操作
// 前一秒
function last_second() {
    jump_to(now_time - 1)
}
// 后一秒
function next_second() {
    jump_to(now_time + 1)
}
// 前(步进)秒
function last_step_second() {
    jump_to(now_time - time_jump_step)
}
// 后(步进)秒
function next_step_second() {
    jump_to(now_time + time_jump_step)
}

// 当前帧数跳转
function now_second_jump() {
    var input_val = $("#now_time").val()
    if (!is_float(input_val)) {
        update_now_info()
        return false
    }
    jump_to(parseFloat(input_val))
}

// 事件
video_player.on("play", function () {
    // 禁止修改当前帧数与当前时间
    $("#now_frame").attr('disabled', true);
    $("#now_time").attr('disabled', true);
    playing_interval();
})
video_player.on("pause", function () {
    $("#now_frame").attr('disabled', false);
    $("#now_time").attr('disabled', false);
    clearInterval(play_interval)
})

// 帧数步进
function set_frame_jump_step() {
    var input_val = $("#frame_jump_step").val()
    if (!is_integer(input_val)) {
        $("#frame_jump_step").val(frame_jump_step)
        return false
    }
    frame_jump_step = parseInt(input_val)
    $("#last_step_frame").text(`前(${frame_jump_step})帧 S`)
    $("#next_step_frame").text(`后(${frame_jump_step})帧 F`)
}
// 秒数步进
function set_frame_jump_step() {
    var input_val = $("#time_jump_step").val()
    if (!is_float(input_val)) {
        $("#time_jump_step").val(time_jump_step)
        return false
    }
    time_jump_step = parseFloat(input_val)
    $("#last_step_second").text(`前(${time_jump_step})秒 A`)
    $("#next_step_second").text(`后(${time_jump_step})秒 G`)
}

// 循环
var play_interval = false
function playing_interval() {
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