laod_record_list()
load_record_edit_list()

// 加载记录列表
function laod_record_list() {
    ez_ajax({
        url: "/ajax/load_record_list",
        success: function (res) {
            console.log(res)
        }
    })
}

// 加载记录编辑列表
function load_record_edit_list() {
    ez_ajax({
        url: "/ajax/load_record_edit_list",
        success: function (res) {
            console.log(res)
        }
    })
}

// 导入记录
function input_record() {

}
// 导出记录
function ouput_record() {
}
// 获取目标记录名
function get_record_file_name() {
    if (is_record_select()) {
        return "false"
    } else {
        return $("#output_input_record_input").val()
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
function load_record_edit() {
    var record_edit_file_name = get_record_edit_file_name()
    if (!record_edit_file_name) {
        return false
    }
    layer.tips(record_edit_file_name, '#load_record_edit_button')
}

// 保存记录编辑
function save_record_edit() {
    var record_edit_file_name = get_record_edit_file_name()
    if (!record_edit_file_name) {
        return false
    }
    layer.tips(record_edit_file_name, '#save_record_edit_button')

    var ziped_record_edit = zip_beat_key_time_list()
    ez_ajax({
        url: "/ajax/save_record_edit",
        type: "POST",
        dataType: "JSON",
        data: {
            file_name: record_edit_file_name,
            beat_key_time_list: ziped_record_edit,
        },
    })
}
// 获取目标记录编辑名
function get_record_edit_file_name(elem_id = "#save_load_record_edit_input") {
    if (is_record_edit_select()) {
        return "false"
    } else {
        var file_name = $("#save_load_record_edit_input").val()
        if (file_name.trim() == "") {
            layer.tips("未输入文件名", elem_id)
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

$("#save_load_record_edit_input,#output_input_record_input").change(function () {
    var val = $(this).val()
    val = $(this).val()

    var file_name_reg = /[\\\/\:\*\?\"\<\>\|]/g
    if (val.search(file_name_reg) >= 0) {
        layer.tips(`文件名中不可包含 \ / : * ? " < > |`, $(this))
        val = $(this).val().replace(file_name_reg, "")
    }

    $(this).val(val)
})

function zip_beat_key_time_list() {
    var temp_beat_key_time_list
    beat_key_time_list.forEach(each_part => {
        each_part.forEach(each_key_time => {
            if (each_key_time[2]) {
                temp_beat_key_time_list.push(each_key_time)
            }
        })
    })
    return temp_beat_key_time_list
}