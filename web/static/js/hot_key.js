var key_to_function = {
    "KeyQ": last_second,
    "KeyW": last_frame,
    "KeyE": play_or_pause,
    "KeyR": next_frame,
    "KeyT": next_second,

    "KeyA": last_step_second,
    "KeyS": last_step_frame,
    "KeyF": next_step_frame,
    "KeyG": next_step_second,
}

$(document).keydown(function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
    const key_code = e.code
    if (Object.keys(key_to_function).indexOf(key_code) != -1) {
        log(key_code)
        key_to_function[key_code]()
    }
})