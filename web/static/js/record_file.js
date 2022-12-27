laod_record_list()
load_record_edit_list()

// 加载记录列表
function laod_record_list() {
    $.ajax({
        url: "/ajax/load_record_list",
        success: function (res) {
            console.log(res)
        }
    })
}

// 加载记录编辑列表
function load_record_edit_list() {
    $.ajax({
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
function get_record_name() {
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
    console.log(get_record_edit_name())
}

// 保存记录编辑
function save_record_edit() {
    console.log(get_record_edit_name())
}
// 获取目标记录编辑名
function get_record_edit_name() {
    if (is_record_edit_select()) {
        return "false"
    } else {
        return $("#save_load_record_edit_input").val()
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