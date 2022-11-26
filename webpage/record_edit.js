layui.use(['form', 'layedit', 'laydate'], function() {
    var form = layui.form
    form.on('submit()', function(data) {
        return false;
    });
})