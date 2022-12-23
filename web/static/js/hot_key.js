var key_to_function = {
    "KeyQ": last_frame
}

$(document).keydown(function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
    console.log(e.code)
    const key_code = e.code
    if (Object.keys(key_to_function).indexOf(key_code) != -1) {
        console.log(key_code)
        key_to_function[key_code]()
    }
})