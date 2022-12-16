function time_to_string(time) {
    var h = Math.floor(time / (60 * 60))
    time = time - h * 60 * 60

    var m = Math.floor(time / 60)
    time = time - m * 60

    var s = Math.floor(time)
    time = time - s

    var ms = time

    var time_string =
        (h ? h.toString().padStart(2, "0") + ":" : "") +
        (m ? m.toString().padStart(2, "0") + ":" : "") +
        (s.toString().padStart(2, "0") + ".") +
        ms.toString().replace("0.", "").substr(0, 3)

    return time_string
}

// 对象是否为整数
function is_integer(obj) {
    return Math.floor(obj) == obj
}