function time_to_string(time, pad_start_flag = true) {
    var h = Math.floor(time / (60 * 60))
    time = time - h * 60 * 60

    var m = Math.floor(time / 60)
    time = time - m * 60

    var s = Math.floor(time)
    time = time - s

    var ms = time

    if (pad_start_flag) {
        var time_string =
            (h ? h.toString().padStart(2, "0") + ":" : "") +
            (m ? m.toString().padStart(2, "0") + ":" : "") +
            (s.toString().padStart(2, "0") + ".") +
            ms.toString().replace("0.", "").substr(0, 3)
    } else {
        var time_string =
            (h ? h.toString() + ":" : "") +
            (m ? m.toString() + ":" : "") +
            (s.toString() + ".") +
            ms.toString().replace("0.", "").substr(0, 3)
    }

    return time_string
}

// 对象是否为整数
function is_integer(obj) {
    return Math.floor(obj) == obj
}

// 对象是否为浮点数
function is_float(obj) {
    return parseFloat(obj) == obj
}

var loading_list = []
var last_loading_index = 0
function ez_ajax(params) {
    var org_params = {
        loading: true,
        success: function (res) {
            if (res.code == 200) {
                layer.msg(res.msg ? res.msg : "操作成功")
            } else {
                layer.msg(res.msg ? res.msg : "操作失败")
            }
        },
        error: function () {
            layer.msg("网络异常")
        }
    }

    var params = { ...org_params, ...params }

    // 弹窗
    if (params.loading) {
        last_loading_index = layer.load(1, { shade: 0.3 })
        loading_list.push(last_loading_index)

        params.complete = function () {
            loading_list.splice(loading_list.indexOf(last_loading_index), 1)
            if (loading_list.length == 0) {
                layer.close(last_loading_index)
            }
        }

        setTimeout(() => {
            $.ajax(params)
        }, 0)
    } else {
        $.ajax(params)
    }
}