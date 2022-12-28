// 时长转字符串
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

// 按步进填充数组
function step_fill_array(total, start = 0, step = 1) {
    var array = []
    var count = 0
    while (count < total) {
        array.push(start + count * step)
        count++
    }
    return array
}

// 去除字符串中不可用于文件(夹)名的字符
function file_name_reg_repalce(file_name) {
    var file_name_reg = /[\\\/\:\*\?\"\<\>\|]/g
    return file_name.replace(file_name_reg, "")
}

// 更新layui_select数据
// mode
//  add 添加
//  rewrite 覆盖
function update_layui_select(elem, data, mode) {
    var old_data = {}
    if (mode == "add") {
        elem.find("option").each(function () {
            old_data[$(this).val()] = $(this).html()
        })
    }
    var html_real = ""
    Object.keys(old_data).forEach(each => {
        html_real += `<option value="${each}">${old_data[each]}</option>`
    })
    if (data.constructor === Array) {
        data.forEach(each => {
            html_real += `<option value="${each}">${each}</option>`
        })
    } else {
        Object.keys(data).forEach(each => {
            html_real += `<option value="${each}">${data[each]}</option>`
        })
    }
    elem.html(html_real)

    layui.use(['layer', 'form'], function () {
        var form = layui.form
        form.render()
    })
}

// 带加载框的ajax
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