// 帧操作
// 前一帧
$("#last_frame").click(function () {
    last_frame()
})

// 后一帧
$("#next_frame").click(function () {
    next_frame
})

// 前(步进)帧
$("#last_step_frame").click(function () {
    last_step_frame()
})

// 后(步进)帧
$("#next_step_frame").click(function () {
    next_step_frame()
})

// 当前帧数跳转
$("#now_frame").change(function () {
    now_frame_jump()
})

// 时间操作
// 前一秒
$("#last_second").click(function () {
    last_second()
})

// 后一秒
$("#next_second").click(function () {
    next_second()
})

// 前(步进)秒
$("#last_step_second").click(function () {
    last_step_second()
})

// 后(步进)秒
$("#next_step_second").click(function () {
    next_step_second()
})

// 当前时间跳转
$("#now_time").change(function () {
    now_second_jump()
})

// 播放或暂停
$("#play_or_pause").click(function () {
    play_or_pause()
})

// 帧数跳转步进
$("#frame_jump_step").change(function () {
    set_frame_jump_step()
})

// 秒数跳转步进
$("#time_jump_step").change(function () {
    set_frame_jump_step()
})