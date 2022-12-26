laod_record_list()
load_record_edit_list()

function laod_record_list() {
    $.ajax({
        url: "/ajax/load_record_list",
        success: function (res) {
            console.log(res)
        }
    })
}

function load_record_edit_list() {
    $.ajax({
        url: "/ajax/load_record_edit_list",
        success: function (res) {
            console.log(res)
        }
    })
}