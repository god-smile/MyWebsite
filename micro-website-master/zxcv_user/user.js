var userId;
var userNo;
var size = 10;
var offset = 0;
var index = 1;
$(function () {
    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#userTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("sss");
    // 生成用户数据
    loadData();

    // 渲染复选框
    renderCheckBox();

    /**
     * 请求后台数据获取角色列表
     * 渲染复选框
     */
    function renderCheckBox() {
        var user = [];
        //条件查询
        var req = {
            baseRequest: {
                pageNum: 1,
                pageSize: 999
            }
        };

        var userTableAjax = {
            method: 'POST',
            url: dataUrl.util.querySysUserInfoForPage(),
            data: JSON.stringify(req),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                console.log("res:" + res);
                console.log("code:" + res.code);
                console.log("data:" + res.data);
                if (res.code == "8888") {
                    for (var i = 0; i < res.data.rows.length; i++) {
                        var obj = new Object();
                        obj.userId = res.data.rows[i].userId;
                        obj.userName = res.data.rows[i].userName;
                        user[i] = obj;
                    }
                    //生成增加与修改页面的角色复选框
                    var _roleHtml = '';
                    for (var i = 0; i < user.length; i++) {
                        _roleHtml += '<label><input type="checkbox" name="userId[]"   value="' + user[i].userId + '"/> ' + user[i].userName + ' </label>';
                    }
                    $('.role').html(_roleHtml);
                    $('.role input').eq(0).attr('checked', 'true');
                    //请求成功后生成增加用户页面表单内容
                    $('#addUserForm').bootstrapValidator({
                        feedbackIcons: {
                            valid: 'glyphicon glyphicon-ok',
                            invalid: 'glyphicon glyphicon-remove',
                            validating: 'glyphicon glyphicon-refresh'
                        },
                        fields: {
                            'userId[]': {
                                validators: {
                                    notEmpty: {
                                        message: '至少选择一条记录'
                                    }
                                }
                            },
                            userName: {
                                validators: {
                                    notEmpty: {
                                        message: '登录名不能为空'
                                    },
                                    stringLength: {
                                        min: 5,
                                        max: 15,
                                        message: '姓名为5-10位'
                                    }
                                }
                            },
                            realName: {
                                validators: {
                                    notEmpty: {
                                        message: '姓名不能为空'
                                    },
                                    stringLength: {
                                        min: 2,
                                        max: 10,
                                        message: '姓名为2-10位'
                                    }
                                }
                            },
                            userPassword: {
                                validators: {
                                    notEmpty: {
                                        message: '密码不能为空'
                                    },
                                    stringLength: {
                                        min: 6,
                                        max: 128,
                                        message: '密码为6-128位'
                                    }
                                }

                            },
                            /*Tel: {
                                validators: {
                                    notEmpty: {
                                        message: '手机号不能为空'
                                    },
                                    stringLength: {
                                        min: 11,
                                        max: 11,
                                        message: '手机号必须为11位'
                                    },
                                    regexp: {
                                        regexp: /^1(3|4|5|7|8)\d{9}$/,
                                        message: '请填写正确的手机号'
                                    }
                                }
                            },*/
                            userEmail: {
                                validators: {
                                    notEmpty: {
                                        message: '邮箱不能为空'
                                    },
                                    regexp: {
                                        regexp: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                                        message: '无效的邮箱'
                                    }
                                }
                            },
                            userState: {
                                validators: {
                                    notEmpty: {
                                        message: '状态不能为空'
                                    }
                                }
                            }
                        }
                    });
                    $('#editUserForm').bootstrapValidator({
                        feedbackIcons: {
                            valid: 'glyphicon glyphicon-ok',
                            invalid: 'glyphicon glyphicon-remove',
                            validating: 'glyphicon glyphicon-refresh'
                        },
                        fields: {
                            'userId[]': {
                                validators: {
                                    notEmpty: {
                                        message: '至少选择一条记录'
                                    }
                                }
                            },
                            userId: {
                                validators: {
                                    notEmpty: {
                                        message: 'id不能为空'
                                    }
                                }
                            },
                            realName: {
                                validators: {
                                    notEmpty: {
                                        message: '登录名不能为空'
                                    }/*,
		                       stringLength:{
		               			min:5,
		               			max:15,
		               			message:'登录名为5-10位'
		               		}*/
                                }
                            },
                            Name: {
                                validators: {
                                    notEmpty: {
                                        message: '姓名不能为空'
                                    },
                                    stringLength: {
                                        min: 2,
                                        max: 10,
                                        message: '姓名为2-10位'
                                    }
                                }
                            },
                            /*Tel: {
                                validators: {
                                    notEmpty: {
                                        message: '手机号不能为空'
                                    },
                                    stringLength: {
                                        min: 11,
                                        max: 11,
                                        message: '手机号必须为11位'
                                    },
                                    regexp: {
                                        regexp: /^1(3|4|5|7|8)\d{9}$/,
                                        message: '请填写正确的手机号'
                                    }
                                }
                            },*/
                            userEmail: {
                                validators: {
                                    notEmpty: {
                                        message: '邮箱不能为空'
                                    },
                                    regexp: {
                                        regexp: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                                        message: '无效的邮箱'
                                    }
                                }
                            },
                            userState: {
                                validators: {
                                    notEmpty: {
                                        message: '状态不能为空'
                                    }
                                }
                            }
                        }
                    });
                } else {
                    console.log('后台角色列表获取失败！');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (textStatus == "timeout") {
                    //alert('请求超时，请重试');
                } else {
                    //alert("请求报错")
                    console.log(errorThrown);
                }
            }
        };
        getAjax(userTableAjax);
    }

    //删除按钮与修改按钮的出现与消失
    /*$('.bootstrap-table').change(function(){
        var dataArr=$('#userTable .selected');
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
    $('#userTable').bootstrapTable({
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
        toolbarAlign: 'left',
        buttonsAlign: 'left',//按钮对齐方式
        toolbar: '#toolbar',//指定工作栏
        ajax: tableLoadRequest,//自定义ajax加载数据
        columns: [
            {title: '全选', field: 'select', checkbox: true, width: 25, align: 'center', valign: 'middle'},
            {title: 'id', field: 'id', visible: false},
            {title: '用户名', field: 'userName', sortable: true, formatter: userNameFormatter},
            {title: '姓名', field: 'realName', sortable: true},
            {title: '邮箱', field: 'email'},
            {title: '注册日期', field: 'createTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '修改日期', field: 'modifyTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '状态', field: 'dataState', align: 'center', formatter: stateFormatter},
            {title: '操作', field: '', align: 'center', formatter: operateFormatter}
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
    } else if (value == '2') {
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
    html += "<a href='#' class='delete_user' onclick='deleteUser(" + row.id + ", \"" + row.userNo + "\")' id='delete_user' >删除</a> ";
    return html;
}
//默认加载
function tableLoadRequest(params) {
    this.size = params.data.limit;
    this.offset = params.data.offset;
    this.index = params.data.pageNumber;
    var ps = queryParams(params.data.limit, params.data.pageNumber);
    //设置请求参数
    var pageNum = (params.data.offset / params.data.limit) + 1;
    ps['pageNum'] = pageNum;
    ps['pageSize'] = params.data.limit;
    //条件查询
    var req = {
        baseRequest: ps
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
function queryParams(limit, pageNumber) {
    return {
        pageSize: limit,
        pageIndex: pageNumber,
        userName: $('#search_userName').val(),
        phoneNumber: $('#search_phoneNumber').val()
    }
}
//查询按钮事件
function searchUser() {
    refreshOptionsTable();
}
/*
* 用户管理增加用户页面所有事件
*/

// 新增用户
function addUser() {
    $('#userContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#userContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, 500);
    $('#addUser').css('display', 'block');
    $('#addUser').addClass('animated slideInRight');
}

// 新增页面表单验证
function addSaveUser() {
    //点击保存时触发表单验证
    $('#addUserForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加用户
    if ($("#addUserForm").data('bootstrapValidator').isValid()) {
        var user = $('#addUserForm').serialize();
        var jsonUser = JSON.parse(commonObj.formToJson(user));
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
                    }, 500);
                    $('#userContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addUserForm').data('bootstrapValidator').resetForm(true);
                    //隐藏修改与删除按钮
                    // $('#btn_delete').css('display','none');
                    // $('#btn_edit').css('display','none');
                }
            },
            error: function (msg) {
                console("后端异常：" + msg);
            }
        };
        getAjax(opt);
        /*$.post(
            "../index.php/admin/index/insertUser",
            $('#addUserForm').serialize(),
            function(data){
                //后台返回添加成功
                if(data.suc==true){

                }
                //否则
                else{
                }
            }
        )*/
    }
}

// 新增页面的返回按钮
function addCancel() {
    $('#addUser').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addUser').removeClass('animated slideOutLeft').css('display', 'none');
    }, 500);
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
    }, 500);
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
                $('#edit_userName').val(res.data.userName);
                $('#edit_realName').val(res.data.realName);
                $('#edit_phoneNumber').val(res.data.phoneNumber);
                $('#edit_email').val(res.data.email);
            }
        }
    };
    getAjax(opt);
}

//修改页面保存按钮事件
function editSaveUser() {
    $('#editUserForm').bootstrapValidator('validate');

    if ($("#editUserForm").data('bootstrapValidator').isValid()) {
        var user = $('#editUserForm').serialize();
        var jsonUser = JSON.parse(commonObj.formToJson(user));

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
                    }, 500);
                    $('#userContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新人员管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editUserForm').data('bootstrapValidator').resetForm(true);
                }
            },
            error: function (msg) {
                console("后端异常：" + msg);
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
    }, 500);
    $('#userContent').css('display', 'block').addClass('animated slideInRight');
    $('#editUserForm').data('bootstrapValidator').resetForm(true);
}

// 删除事件按钮
function deleteUser(userId, userNo) {
    $('#delete_msg').text('确定要删除该用户吗?');
    $('#delete_window').addClass('bbox');

    this.userId = userId;
    this.userNo = userNo;

    // 多用户删除
    /*var dataArr=$('#userTable').bootstrapTable('getSelections');
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
                    $('#userTable').bootstrapTable('refresh', {url: '../index.php/admin/index/userManagement'});
                }else{
                }
            });
    });*/
}

//弹出框取消按钮事件
function deleteConfirm() {
    $('#delete_window').removeClass('bbox');

    // 单用户删除
    var id = this.userId;
    //设置请求参数
    var req = {
        userNo: this.userNo,
        id: id
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
//弹出框关闭按钮事件
function deleteCancel() {
    $('#delete_window').removeClass('bbox');
}

function tableHeight() {
    return $(window).height() - 140;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#userTable').bootstrapTable('refresh', {url: dataUrl.util.querySysUserInfoForPage()});
}
function refreshOptionsTable() {
    var ps = queryParams(this.size, this.index);
    //设置请求参数
    var pageNum = (this.offset / this.size) + 1;
    ps['pageNum'] = pageNum;
    ps['pageSize'] = this.size;
    //条件查询
    var req = {
        baseRequest: ps
    };
    $('#userTable').bootstrapTable('refreshOptions', {url: dataUrl.util.querySysUserInfoForPage(), data: JSON.stringify(req)});
}