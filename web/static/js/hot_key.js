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

    "KeyL": () => { key_down("KeyL") },
    "KeyK": () => { key_down("KeyK") },
    "KeyJ": () => { key_down("KeyJ") },
    "KeyI": () => { key_down("KeyI") },
    "KeyU": () => { key_down("KeyU") },
    "KeyO": () => { key_down("KeyO") },
}

$(document).keydown(function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
    const key_code = e.code
    if (Object.keys(key_to_function).indexOf(key_code) != -1) {
        // console.log(key_code)
        key_to_function[key_code]()
    }
})