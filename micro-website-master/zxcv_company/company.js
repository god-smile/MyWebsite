var companyId;
var fadeTime = 500;

$(function () {
    constant.initProjectNo();

    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#companyContentTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("company");
    // 生成公司信息数据
    loadData();

    // 渲染 datetimer
    datetimerfun.init();
});
/** 加载数据 */
function loadData() {
    //生成公司信息数据
    $('#companyContentTable').bootstrapTable('destroy').bootstrapTable({
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
            {title: '名称', field: 'name', sortable: false, formatter: nameFormatter},
            {title: '地址', field: 'address', sortable: false, formatter: subAddressFormatter},
            {title: '联系电话', field: 'phone', sortable: false},
            {title: '排序优先级', field: 'orderLevel', sortable: false},
            {title: '创建时间', field: 'createTime', sortable: false, formatter: commonObj.timeFormatter},
            {title: '操作', field: '', align: 'center', formatter: operateFormatter}
        ],
        locale: 'zh-CN',//中文支持,
    });
}
function nameFormatter(value, row, index) {
    var html = "<a href='#' class='edit_company' onclick='showCompany(" + row.id + ")' >" + row.name.substring(0, 10) + "</a> ";
    return html;
}
function subAddressFormatter(value, row, index) {
    return value.substring(0, 20);
}

function operateFormatter(value, row, index) {
    var html = "<a href='#' class='edit_company' onclick='editCompany(" + row.id + ")' id='edit_company' >修改</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    html += "<a href='#' class='delete_company' onclick='deleteCompany(" + row.id + ")' id='delete_company' >删除</a> ";
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

    var companyTableAjax = {
        method: params.type,
        url: dataUrl.util.querySysCompanyInfoForPage(),
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
    getAjax(companyTableAjax);
}
//请求服务数据时所传参数
function queryParams() {
    return {
        name: $('#search_name').val(),
    }
}
//查询按钮事件
function searchCompany() {
    $('#companyContentTable').bootstrapTable('refresh');
}

/**
 * 公司信息管理增加公司信息页面所有事件
 */
// 新增公司信息
function addCompany() {
    $('#companyContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#companyContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#addcompany').css('display', 'block');
    $('#addcompany').addClass('animated slideInRight');
}
// 新增页面表单验证
function addSaveCompany() {
    //点击保存时触发表单验证
    $('#addCompanyForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加公司信息
    if ($("#addCompanyForm").data('bootstrapValidator').isValid()) {
        var jsonCompany = commonObj.getJsonObjectByForm('addCompanyForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.saveCompanyInfo(),
            data: JSON.stringify(jsonCompany),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    SuccessAlertManual("公司信息添加成功！");
                    $('#addCompany').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#addCompany').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#companyContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addCompanyForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 新增页面的返回按钮
function addCancel() {
    $('#addCompany').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addCompany').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#companyContent').css('display', 'block').addClass('animated slideInRight');
    $('#addCompanyForm').bootstrapValidator('resetForm', true);
}

/*
* 公司信息管理修改公司信息页面所有事件
*/
// 修改公司信息
function editCompany(companyId) {
    $('#companyContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#companyContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#updateCompany').css('display', 'block');
    $('#updateCompany').addClass('animated slideInRight');

    var id = companyId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysCompanyInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#edit_id').val(id);
                $('#edit_name').val(res.data.name);
                $('#edit_address').val(res.data.address);
                $('#edit_phone').val(res.data.phone);
                $('#edit_fax').val(res.data.fax);
                $('#edit_email').val(res.data.email);
                $('#edit_postcode').val(res.data.postcode);
                $('#edit_orderLevel').val(res.data.orderLevel);

                $('#edit_remark').val(res.data.remark);
                $('#edit_beginTime_value').val(res.data.beginTime);
                $('#edit_endTime_value').val(res.data.endTime);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveCompany() {
    $('#editCompanyForm').bootstrapValidator('validate');

    if ($("#editCompanyForm").data('bootstrapValidator').isValid()) {
        var jsonCompany = commonObj.getJsonObjectByForm('editCompanyForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.updateSysCompanyInfoById(),
            data: JSON.stringify(jsonCompany),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    //回退到 公司信息管理主页
                    $('#updateCompany').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#updateCompany').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#companyContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新公司信息管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editCompanyForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 修改页面回退按钮事件
function editCancel() {
    $('#updateCompany').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#updateCompany').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#companyContent').css('display', 'block').addClass('animated slideInRight');
    $('#editCompanyForm').bootstrapValidator('resetForm', true);
}

// 删除事件按钮
function deleteCompany(companyId) {
    this.companyId = companyId;

    ConfirmAndCallback('确定要删除该公司信息吗?', '确定', '取消', function () {
        // 单公司信息删除
        var id = this.companyId;
        var ids = [id];

        //设置请求参数
        var req = {
            id: id,
            ids: ids
        };
        var opt = {
            method: 'post',
            url: dataUrl.util.deleteSysCompanyInfo(),
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

    //$('#delete_msg').text('确定要删除该公司信息吗?');
    //$('#delete_window').addClass('bbox');
}
// 删除 确定按钮事件
/*function deleteConfirm() {
    //$('#delete_window').removeClass('bbox');

    // 单公司信息删除
    var id = this.companyId;
    var ids = [id];

    //设置请求参数
    var req = {
        id: id,
        ids: ids
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.deleteSitecompanyInfo(),
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

// 查看公司信息详情
function showCompany(companyId) {
    $('#companyContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#companyContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#showCompany').css('display', 'block');
    $('#showCompany').addClass('animated slideInRight');

    var id = companyId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysCompanyInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {

                $('#detail_id').val(id);
                $('#detail_name').val(res.data.name);
                $('#detail_address').val(res.data.address);
                $('#detail_phone').val(res.data.phone);
                $('#detail_fax').val(res.data.fax);
                $('#detail_email').val(res.data.email);
                $('#detail_postcode').val(res.data.postcode);
                $('#detail_orderLevel').val(res.data.orderLevel);

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
    $('#showCompany').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#showCompany').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#companyContent').css('display', 'block').addClass('animated slideInRight');
}

function tableHeight() {
    return $(window).height() * 0.83;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#companyContentTable').bootstrapTable('refresh', {url: dataUrl.util.querySysCompanyInfoForPage()});
}