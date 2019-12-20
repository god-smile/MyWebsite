var userId;
var userState;

var fadeTime = 500;

$(function () {
    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#userContentTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("sss");
    // 生成用户数据
    loadData();

    // 渲染 datetimer
    datetimerfun.init();

    //删除按钮与修改按钮的出现与消失
    /*$('.bootstrap-table').change(function(){
        var dataArr=$('#userContentTable .selected');
        if(dataArr.length==1){
            $('#btn_edit').css('display','block').removeClass('fadeOutRight').addClass('animated fadeInRight');
        }else{
            $('#btn_edit').addClass('fadeOutRight');
            setTimeout(function(){
                $('#btn_edit').css('display','none');
            },400);
        }
        if(dataArr.length>=1){
            $('#btn_delete').css('display','block').removeClass('fadeOutRight').addClass('animated fadeInRight');
        }else{
            $('#btn_delete').addClass('fadeOutRight');
            setTimeout(function(){
                $('#btn_delete').css('display','none');
            },400);
        }
    });*/
});
/** 加载数据 */
function loadData() {
    //生成用户数据
    $('#userContentTable').bootstrapTable('destroy').bootstrapTable({
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
            {title: '用户名', field: 'userName', sortable: true, formatter: userNameFormatter},
            {title: '姓名', field: 'realName', sortable: true},
            {title: '手机号', field: 'phoneNumber'},
            {title: '注册日期', field: 'createTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '修改日期', field: 'modifyTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '状态', field: 'userState', align: 'center', formatter: stateFormatter},
            {title: '操作', field: 'userState', align: 'center', formatter: operateFormatter}
        ],
        locale: 'zh-CN',//中文支持,
    });
}
function userNameFormatter(value, row, index) {
    var html = "<a href='#' class='edit_user' onclick='showUser(" + row.id + ", \"" + row.userNo + "\")' >" + row.userName + "</a> ";
    return html;
}
function stateFormatter(value, row, index) {
    /*if(value==2){
        return '<i class="fa fa-lock" style="color:red"></i>'
    }else if(value==1){
        return '<i class="fa fa-unlock" style="color:green"></i>'
    }else{
        return '数据错误'
    }*/
    if (value == '1') {
        return "正常";
    } else if (value == '0') {
        return "冻结";
    } else if (value == '3') {
        return "删除";
    } else {
        return "其他";
    }
}
function operateFormatter(value, row, index) {
    var html = "<a href='#' class='edit_user' onclick='editUser(" + row.id + ", \"" + row.userNo + "\")' id='edit_user' >修改</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    var state = "";
    if (value == '1') {
        state = "冻结";
    }else if (value == '0') {
        state = "解冻";
    }
    html += "<a href='#' class='delete_user' onclick='changeUserState(" + row.id + ", \"" + value + "\")' id='changestate_user' >" + state +
        "</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    html += "<a href='#' class='delete_user' onclick='deleteUser(" + row.id + ", \"" + row.userNo + "\")' id='delete_user' >删除</a> ";
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
        pageSize:pageSize
    };
    var userTableAjax = {
        method: params.type,
        url: dataUrl.util.querySysUserInfoForPage(),
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
    getAjax(userTableAjax);
}
//请求服务数据时所传参数
function queryParams() {
    return {
        userName: $('#search_userName').val(),
        phoneNumber: $('#search_phoneNumber').val()
    }
}
//查询按钮事件
function searchUser() {
    $('#userContentTable').bootstrapTable('refresh');
}
/**
* 用户管理增加用户页面所有事件
*/
// 新增用户
function addUser() {
    $('#userContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#userContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#addUser').css('display', 'block');
    $('#addUser').addClass('animated slideInRight');
}
// 新增页面表单验证
function addSaveUser() {
    //点击保存时触发表单验证
    $('#addUserForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加用户
    if ($("#addUserForm").data('bootstrapValidator').isValid()) {
        var jsonUser = commonObj.getJsonObjectByForm('addUserForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.saveSysUserInfo(),
            data: JSON.stringify(jsonUser),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    SuccessAlertManual("用户添加成功！");
                    $('#addUser').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#addUser').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#userContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addUserForm').data('bootstrapValidator').resetForm(true);
                    //隐藏修改与删除按钮
                    // $('#btn_delete').css('display','none');
                    // $('#btn_edit').css('display','none');
                }
            }
        };
        getAjax(opt);
    }
}
// 新增页面的返回按钮
function addCancel() {
    $('#addUser').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addUser').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#userContent').css('display', 'block').addClass('animated slideInRight');
    $('#addUserForm').data('bootstrapValidator').resetForm(true);
}

/*
* 用户管理修改用户页面所有事件
*/
// 修改用户
function editUser(userId, userNo) {
    $('#userContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#userContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#updateUser').css('display', 'block');
    $('#updateUser').addClass('animated slideInRight');

    var id = userId;
    //设置请求参数
    var req = {
        userNo: userNo,
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysUserInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#edit_id').val(id);
                $('#edit_userNo').val(res.data.userNo);
                $('#edit_userName').val(res.data.userName);
                $('#edit_realName').val(res.data.realName);

                switch (res.data.sex) {
                    case 1:
                        var ss = $('input[type="radio"][name="sex"]:eq(0)');
                        ss.prop("checked", true);
                        break;
                    case 2:
                        var ss = $('input[type="radio"][name="sex"]:eq(1)');
                        ss.prop("checked", true);
                        break;
                    case 3:
                        var ss = $('input[type="radio"][name="sex"]:eq(2)');
                        ss.prop("checked", true);
                        break;
                }

                $('#edit_password').val(res.data.password);
                $('#edit_phoneNumber').val(res.data.phoneNumber);
                $('#edit_cardNo').val(res.data.cardNo);
                $('#edit_wechatNumber').val(res.data.wechatNumber);
                $('#edit_email').val(res.data.email);
                $('#edit_address').val(res.data.address);
                $('#edit_remark').val(res.data.remark);
                $('#edit_beginTime_value').val(res.data.beginTime);
                $('#edit_endTime_value').val(res.data.endTime);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveUser() {
    $('#editUserForm').bootstrapValidator('validate');

    if ($("#editUserForm").data('bootstrapValidator').isValid()) {
        var jsonUser = commonObj.getJsonObjectByForm('editUserForm');

        var opt = {
            method: 'post',
            url: dataUrl.util.updateSysUserInfoById(),
            data: JSON.stringify(jsonUser),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    //隐藏修改与删除按钮
                    // $('#btn_delete').css('display','none');
                    // $('#btn_edit').css('display','none');
                    //回退到人员管理主页
                    $('#updateUser').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#updateUser').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#userContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新人员管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editUserForm').data('bootstrapValidator').resetForm(true);
                }
            }
        };
        getAjax(opt);
    }
}
// 修改页面回退按钮事件
function editCancel() {
    $('#updateUser').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#updateUser').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#userContent').css('display', 'block').addClass('animated slideInRight');
    $('#editUserForm').data('bootstrapValidator').resetForm(true);
}
// 修改状态
function changeUserState(userId, userState) {
    var state = "";
    if (userState == '1') {
        state = "冻结";
    }else if (userState == '0') {
        state = "解冻";
    }

    $('#changestate_msg').text('确定要' + state + '该用户吗?');
    $('#changestate_window').addClass('bbox');

    var newState = -1;
    if (userState == '1') {
        newState = 0;
    } else if (userState == '0') {
        newState = 1;
    }

    this.userId = userId;
    this.userState = newState;
}
// 修改状态 确定按钮事件
function changestateConfirm() {
    $('#changestate_window').removeClass('bbox');

    // 单用户删除
    var id = this.userId;
    var state = this.userState;

    //设置请求参数
    var req = {
        id: id,
        userState: state
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.updateSysUserInfoById(),
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
}
// 修改状态 取消按钮事件
function changestateCancel() {
    $('#changestate_window').removeClass('bbox');
}

// 删除事件按钮
function deleteUser(userId, userNo) {
    $('#delete_msg').text('确定要删除该用户吗?');
    $('#delete_window').addClass('bbox');

    this.userId = userId;

    // 多用户删除
    /*var dataArr=$('#userContentTable').bootstrapTable('getSelections');
    $('.popup_de .show_msg').text('确定要删除该用户吗?');
    $('.popup_de').addClass('bbox');
    $('.popup_de .btn_submit').one('click',function(){
        var id=[];
        for(var i=0;i<dataArr.length;i++){
            id[i]=dataArr[i].id;
        }
        $.post("../index.php/admin/index/deleteUserById",
            {id:id},
            function(data){
                if(data.suc==true){
                    $('.popup_de .show_msg').text('删除成功！');
                    $('.popup_de .btn_cancel').css('display','none');
                    $('.popup_de').addClass('bbox');
                    $('.popup_de .btn_submit').one('click',function(){
                        $('.popup_de').removeClass('bbox');
                    })
                    $('#userContentTable').bootstrapTable('refresh', {url: '../index.php/admin/index/userManagement'});
                }else{
                }
            });
    });*/
}

// 删除 确定按钮事件
function deleteConfirm() {
    $('#delete_window').removeClass('bbox');

    // 单用户删除
    var id = this.userId;
    var ids = [id];

    //设置请求参数
    var req = {
        id: id,
        ids: ids
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.deleteSysUserInfo(),
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
}
// 删除 取消按钮事件
function deleteCancel() {
    $('#delete_window').removeClass('bbox');
}

// 查看用户详情
function showUser(userId, userNo) {
    $('#userContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#userContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#showUser').css('display', 'block');
    $('#showUser').addClass('animated slideInRight');

    var id = userId;
    //设置请求参数
    var req = {
        userNo: userNo,
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSysUserInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#detail_id').val(id);
                $('#detail_userNo').val(res.data.userNo);
                $('#detail_userName').val(res.data.userName);
                $('#detail_realName').val(res.data.realName);
                $('#detail_sex').val(userSexMap[res.data.sex]);
                $('#detail_password').val(res.data.password);
                $('#detail_phoneNumber').val(res.data.phoneNumber);
                $('#detail_cardNo').val(res.data.cardNo);
                $('#detail_wechatNumber').val(res.data.wechatNumber);
                $('#detail_email').val(res.data.email);
                $('#detail_address').val(res.data.address);
                $('#detail_level').val(userLevelMap[res.data.level]);
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
    $('#showUser').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#showUser').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#userContent').css('display', 'block').addClass('animated slideInRight');
}

function tableHeight() {
    return $(window).height() * 0.83;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#userContentTable').bootstrapTable('refresh', {url: dataUrl.util.querySysUserInfoForPage()});
}