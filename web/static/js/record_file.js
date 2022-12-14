laod_record_list()
load_record_edit_list()

// 按键列表
const key_list = ["l", "k", "j", "i", "u", "o",]

// 加载记录列表
function laod_record_list() {
    ez_ajax({
        url: "/ajax/load_record_list",
        success: function (res) {
            var file_list = {}
            file_list[""] = "选择记录"
            res.forEach(each => {
                file_list[each] = each
            })
            update_layui_select($("#output_input_record_select"), file_list, "rewrite")
        }
    })
}

// 加载记录编辑列表
function load_record_edit_list() {
    ez_ajax({
        url: "/ajax/load_record_edit_list",
        success: function (res) {
            var file_list = {}
            file_list[""] = "选择记录编辑"
            res.forEach(each => {
                file_list[each] = each
            })
            update_layui_select($("#save_load_record_edit_select"), file_list, "rewrite")
        }
    })
}

// 导入记录
function input_record() {

}
// 导出记录
var record_key_press_list = []
var ziped_record = []
function ouput_record(file_name = false) {
    ziped_record = zip_beat_key_time_list()
    var num = -1
    var record_key_list = []
    ziped_record.forEach((each, index) => {
        // 释放按键
        release_key(each[0], index).forEach(each_release => {
            console.log("release", each_release.key)
            record_key_list.push({
                num: num,
                // time: each_release.time + (each_release.key - (key_list.length / 2)) * 0.01,
                // time: each_release.time,
                time: each_release.time - 0.0073 + (each_release.key - (key_list.length / 2)) * 0.001,
                key: key_list[each_release.key],
                press: false,
            })
            num++
        })

        record_key_list.push({
            num: num,
            // time: each[0] + (each[1] - (key_list.length / 2)) * 0.01,
            // time: each[0],
            time: each[0] - 0.0073 + (each[1] - (key_list.length / 2)) * 0.001,
            key: key_list[each[1]],
            press: true,
        })
        num++
    })

    file_name = get_record_file_name(file_name)
    if (!file_name) {
        return false
    }

    ez_ajax({
        url: "/ajax/ouput_record",
        type: "POST",
        dataType: "JSON",
        data: {
            file_name: file_name,
            record_key_list: JSON.stringify(record_key_list),
        },
        success: function (res) {
            if (!is_record_select()) {
                laod_record_list()
            }
            if (res.code == 200) {
                layer.msg(res.msg ? res.msg : "操作成功")
            } else {
                layer.msg(res.msg ? res.msg : "操作失败")
            }
        }
    })
}
// 获取目标记录名
function get_record_file_name(file_name = false) {
    if (file_name !== false) {
        if (file_name != file_name_reg_repalce(file_name)) {
            layer.tips(`文件名中不可包含 \ / : * ? " < > |`, $("#output_input_record_button"))
            return false
        }
        return file_name
    }
    if (is_record_select()) {
        // select
        var file_name = $("#output_input_record_select").val()
        if (!file_name) {
            layer.tips("未选择文件名", "#output_input_record_select_outer")
            return false
        } else {
            return $("#output_input_record_select").val()
        }
    } else {
        // input
        var file_name = $("#output_input_record_input").val()
        if (file_name.trim() == "") {
            layer.tips("未输入文件名", "#output_input_record_input")
            return false
        } else {
            return $("#output_input_record_input").val()
        }
    }
}
// 记录是否是选择模式
function is_record_select() {
    if ($("#output_input_record_input").is(":hidden")) {
        return true
    } else {
        return false
    }
}
// 切换记录选择模式
function change_record_mode() {
    if (is_record_select()) {
        $("#output_input_record_input").show()
        $("#output_input_record_select_outer").hide()
    } else {
        $("#output_input_record_input").hide()
        $("#output_input_record_select_outer").show()
    }
}

// 读取记录编辑
function load_record_edit(file_name = false) {
    file_name = get_record_edit_file_name(file_name)
    if (!file_name) {
        return false
    }

    ez_ajax({
        url: "/ajax/load_record_edit",
        dataType: "JSON",
        type: "POST",
        data: {
            file_name: file_name,
        },
        success: function (res) {
            start_time = Date.now()
            res.forEach(each => {
                change_time_nearest_beat_key_holding(each[0], each[1], each[2])
            })
        }
    })
}

// 保存记录编辑
function save_record_edit(file_name = false) {
    file_name = get_record_edit_file_name(file_name)
    if (!file_name) {
        return false
    }

    var ziped_record_edit = zip_beat_key_time_list()
    ez_ajax({
        url: "/ajax/save_record_edit",
        type: "POST",
        dataType: "JSON",
        data: {
            file_name: file_name,
            beat_key_time_list: JSON.stringify(ziped_record_edit),
        },
        success: function (res) {
            if (!is_record_edit_select()) {
                load_record_edit_list()
            }
            if (res.code == 200) {
                layer.msg(res.msg ? res.msg : "操作成功")
            } else {
                layer.msg(res.msg ? res.msg : "操作失败")
            }
        }
    })
}
// 获取目标记录编辑名
function get_record_edit_file_name(file_name = false) {
    if (file_name !== false) {
        if (file_name != file_name_reg_repalce(file_name)) {
            layer.tips(`文件名中不可包含 \ / : * ? " < > |`, $("#save_load_record_edit_button"))
            return false
        }
        return file_name
    }
    if (is_record_edit_select()) {
        // select
        var file_name = $("#save_load_record_edit_select").val()
        if (!file_name) {
            layer.tips("未选择文件名", "#save_load_record_edit_select_outer")
            return false
        } else {
            return $("#save_load_record_edit_select").val()
        }
    } else {
        // input
        var file_name = $("#save_load_record_edit_input").val()
        if (file_name.trim() == "") {
            layer.tips("未输入文件名", "#save_load_record_edit_input")
            return false
        } else {
            return $("#save_load_record_edit_input").val()
        }
    }
}
// 记录是否是选择模式
function is_record_edit_select() {
    if ($("#save_load_record_edit_input").is(":hidden")) {
        return true
    } else {
        return false
    }
}
// 切换记录选择模式
function change_record_edit_mode() {
    if (is_record_edit_select()) {
        $("#save_load_record_edit_input").show()
        $("#save_load_record_edit_select_outer").hide()
    } else {
        $("#save_load_record_edit_input").hide()
        $("#save_load_record_edit_select_outer").show()
    }
}

// 工具函数

// 去除文件名中不能存在的字符
$("#save_load_record_edit_input,#output_input_record_input").change(function () {
    var val = $(this).val()

    var new_val = file_name_reg_repalce(val)
    if (val != new_val) {
        layer.tips(`文件名中不可包含 \ / : * ? " < > |`, $(this))
        $(this).val(new_val)
    }
})

var record_key_release_list = []
key_list.forEach((each, index) => {
    record_key_release_list[index] = false
})
// 释放按键
function release_key(time, index) {
    var key = ziped_record[index][1]

    // 是否到达需要释放按键的时间
    var need_release_key_list = []
    record_key_release_list.forEach((release_time, index) => {
        if (release_time && release_time <= time) {
            record_key_release_list[index] = false
            need_release_key_list.push({
                time: release_time,
                key: index
            })
        }
    })

    // 把需要释放的键加入释放列表中
<<<<<<< HEAD
    console.log("####################################")
    console.log("key", key)
    console.log("time", time)
    console.log("index", index)
=======
>>>>>>> fe856e4965e01413eb9473c71600b0397b43ac83
    for (var num = index + 1; num < ziped_record.length; num++) {
        if (key == ziped_record[num][1]) {
            record_key_release_list[key] = ziped_record[num][0] - echarts_option.xAxis[0].interval
            break
        }
    }
    return need_release_key_list
}