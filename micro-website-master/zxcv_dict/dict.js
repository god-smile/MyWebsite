var dictId;
var fadeTime = 500;

$(function () {
    constant.initProjectNo();

    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#dictContentTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("dict");
    // 生成字典数据
    loadData();

    // 渲染 datetimer
    datetimerfun.init();
});
/** 加载数据 */
function loadData() {
    //生成字典数据
    $('#dictContentTable').bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        height: tableHeight(),//高度调整
        width: tableWidth(),//宽度调整
        striped: true, //是否显示行间隔色
        rownumbers: true,
        // dataField: "res",
        pageNumber: 1, //初始化加载第一页，默认第一页
        pagination: true,//是否分页
        paginationPreText: '上一页',
        paginationNextText: '下一页',
        queryParamsType: 'limit',
        sidePagination: 'server',
        pageSize: 10,//单页记录数
        pageList: [5, 10, 20, 30],//分页步进值
        showRefresh: false,//刷新按钮
        showColumns: false,
        clickToSelect: false,//是否启用点击选中行
        toolbarAlign: 'right',
        buttonsAlign: 'right',//按钮对齐方式
        toolbar: '#toolbar',//指定工作栏
        ajax: tableLoadRequest,//自定义ajax加载数据
        columns: [
            /*{title: '全选', field: 'select', checkbox: true, width: 25, align: 'center', valign: 'middle'},*/
            {title: 'id', field: 'id', visible: false},
            {title: '类型', field: 'type', sortable: false, formatter: typeFormatter},
            {title: '名称', field: 'name', sortable: false, formatter: nameFormatter},
            {title: '取值', field: 'value', sortable: false, formatter: subValueFormatter},
            {title: '创建时间', field: 'createTime', sortable: false, formatter: commonObj.timeFormatter},
            {title: '操作', field: '', align: 'center', formatter: operateFormatter}
        ],
        locale: 'zh-CN',//中文支持,
    });
}
function typeFormatter(value, row, index) {
    return dictTypeMap[value];
}
function nameFormatter(value, row, index) {
    var html = "<a href='#' class='edit_dict' onclick='showDict(" + row.id + ")' >" + row.value.substring(0, 10) + "</a> ";
    return html;
}
function subValueFormatter(value, row, index) {
    return value.substring(0, 20);
}

function operateFormatter(value, row, index) {
    var html = "<a href='#' class='edit_dict' onclick='editDict(" + row.id + ")' id='edit_dict' >修改</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    html += "<a href='#' class='delete_dict' onclick='deleteDict(" + row.id + ")' id='delete_dict' >删除</a> ";
    return html;
}
//默认加载
function tableLoadRequest(params) {
    var req = queryParams();
    var data = JSON.parse(params.data);
    //设置请求参数
    var pageNum = data.pageNumber;
    var pageSize = data.limit;

    //条件查询
    req.pageReq = {
        pageNum: pageNum,
        pageSize: pageSize
    };
    req.projectNo = commonFun.getProjectNo();

    var dictTableAjax = {
        method: params.type,
        url: dataUrl.util.querySysDictInfoForPage(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            console.log(res);
            if (res.code = "8888") {
                params.success(res.data);
            } else {
                ErrorAlertManual("其他错误！");
            }
        }
    };
    getAjax(dictTableAjax);
}
//请求服务数据时所传参数
function queryParams() {
    return {
        type: $('#search_type').val(),
    }
}
//查询按钮事件
function searchDict() {
    $('#dictContentTable').bootstrapTable('refresh');
}

/**
 * 字典管理增加字典页面所有事件
 */
// 新增字典
function addDict() {
    $('#dictContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#dictContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#addDict').css('display', 'block');
    $('#addDict').addClass('animated slideInRight');
}
// 新增页面表单验证
function addSaveDict() {
    //点击保存时触发表单验证
    $('#addDictForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加字典
    if ($("#addDictForm").data('bootstrapValidator').isValid()) {
        var jsonDict = commonObj.getJsonObjectByForm('addDictForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.saveDictInfo(),
            data: JSON.stringify(jsonDict),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    SuccessAlertManual("字典添加成功！");
                    $('#addDict').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#addDict').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#dictContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addDictForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 新增页面的返回按钮
function addCancel() {
    $('#addDict').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addDict').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#dictContent').css('display', 'block').addClass('animated slideInRight');
    $('#addDictForm').bootstrapValidator('resetForm', true);
}

/*
* 字典管理修改字典页面所有事件
*/
// 修改字典
function editDict(dictId) {
    $('#dictContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#dictContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#updateDict').css('display', 'block');
    $('#updateDict').addClass('animated slideInRight');

    var id = dictId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysDictInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#edit_id').val(id);
                $('#edit_type').val(res.data.type);
                $('#edit_name').val(res.data.name);
                $('#edit_vaule').val(res.data.value);

                $('#edit_remark').val(res.data.remark);
                $('#edit_beginTime_value').val(res.data.beginTime);
                $('#edit_endTime_value').val(res.data.endTime);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveDict() {
    $('#editDictForm').bootstrapValidator('validate');

    if ($("#editDictForm").data('bootstrapValidator').isValid()) {
        var jsonDict = commonObj.getJsonObjectByForm('editDictForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.updateSysDictInfoById(),
            data: JSON.stringify(jsonDict),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    //回退到 字典管理主页
                    $('#updateDict').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#updateDict').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#dictContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新字典管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editDictForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 修改页面回退按钮事件
function editCancel() {
    $('#updateDict').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#updateDict').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#dictContent').css('display', 'block').addClass('animated slideInRight');
    $('#editDictForm').bootstrapValidator('resetForm', true);
}

// 删除事件按钮
function deleteDict(dictId) {
    this.dictId = dictId;

    ConfirmAndCallback('确定要删除该字典吗?', '确定', '取消', function () {
        // 单字典删除
        var id = this.dictId;
        var ids = [id];

        //设置请求参数
        var req = {
            id: id,
            ids: ids
        };
        var opt = {
            method: 'post',
            url: dataUrl.util.deleteSysDictInfo(),
            data: JSON.stringify(req),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    // alert 删除成功，刷新界面
                    refreshTable();
                }
            }
        };
        getAjax(opt);
    });

    //$('#delete_msg').text('确定要删除该字典吗?');
    //$('#delete_window').addClass('bbox');
}
// 删除 确定按钮事件
/*function deleteConfirm() {
    //$('#delete_window').removeClass('bbox');

    // 单字典删除
    var id = this.dictId;
    var ids = [id];

    //设置请求参数
    var req = {
        id: id,
        ids: ids
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.deleteSitedictInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                // alert 删除成功，刷新界面
                refreshTable();
            }
        }
    };
    getAjax(opt);
}*/
// 删除 取消按钮事件
/*function deleteCancel() {
    $('#delete_window').removeClass('bbox');
}*/

// 查看字典详情
function showDict(dictId) {
    $('#dictContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#dictContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#showDict').css('display', 'block');
    $('#showDict').addClass('animated slideInRight');

    var id = dictId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysDictInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {

                $('#detail_id').val(id);
                $('#detail_type').val(res.data.type);
                $('#detail_name').val(res.data.name);
                $('#detail_value').val(res.data.value);

                $('#detail_remark').val(res.data.remark);
                $('#detail_beginTime').val(res.data.beginTime);
                $('#detail_endTime').val(res.data.endTime);
            }
        }
    };
    getAjax(opt);
}
// 详情页面回退按钮事件
function showCancel() {
    $('#showDict').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#showDict').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#dictContent').css('display', 'block').addClass('animated slideInRight');
}

function tableHeight() {
    return $(window).height() * 0.83;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#dictContentTable').bootstrapTable('refresh', {url: dataUrl.util.querySysDictInfoForPage()});
}