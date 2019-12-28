var newsId;
var fadeTime = 500;

$(function () {
    constant.initProjectNo();

    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#newsContentTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("news");
    // 生成新闻数据
    loadData();

    // 渲染 datetimer
    datetimerfun.init();
});
/** 加载数据 */
function loadData() {
    //生成新闻数据
    $('#newsContentTable').bootstrapTable('destroy').bootstrapTable({
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
            {title: '新闻标题', field: 'title', sortable: true, formatter: titleFormatter},
            {title: '阅读量', field: 'readNum', sortable: true},
            {title: '新闻类型', field: 'newsType', sortable: true, formatter: typeFormatter},
            {title: '创建时间', field: 'createTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '操作', field: '', align: 'center', formatter: operateFormatter}
        ],
        locale: 'zh-CN',//中文支持,
    });
}
function titleFormatter(value, row, index) {
    var html = "<a href='#' class='edit_news' onclick='showNews(" + row.id + ", \"" + row.newsNo + "\")' >" + row.title + "</a> ";
    return html;
}
function typeFormatter(value, row, index) {
    return newsTypeMap[value];
}
function operateFormatter(value, row, index) {
    var html = "<a href='#' class='edit_news' onclick='editNews(" + row.id + ", \"" + row.newsNo + "\")' id='edit_news' >修改</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    html += "<a href='#' class='delete_news' onclick='deleteNews(" + row.id + ", \"" + row.newsNo + "\")' id='delete_news' >删除</a> ";
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
    req.projectNo = constant.globalProjectNo;

    var newsTableAjax = {
        method: params.type,
        url: dataUrl.util.querySiteNewsInfoForPage(),
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
    getAjax(newsTableAjax);
}
//请求服务数据时所传参数
function queryParams() {
    return {
        title: $('#search_title').val(),
        //phoneNumber: $('#search_phoneNumber').val()
    }
}
//查询按钮事件
function searchNews() {
    $('#newsContentTable').bootstrapTable('refresh');
}

/**
 * 新闻管理增加新闻页面所有事件
 */
// 新增新闻
function addNews() {
    $('#newsContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#newsContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#addNews').css('display', 'block');
    $('#addNews').addClass('animated slideInRight');

    // 加载编辑正文
    EditorObj.initEditor("editor_add");
}
// 新增页面表单验证
function addSaveNews() {
    //点击保存时触发表单验证
    $('#addNewsForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加新闻
    if ($("#addNewsForm").data('bootstrapValidator').isValid()) {
        var jsonNews = commonObj.getJsonObjectByFormWithEditor('addNewsForm', EditorObj.editor, 'newsContent');

        var opt = {
            method: 'post',
            url: dataUrl.util.saveNewsInfo(),
            data: JSON.stringify(jsonNews),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    SuccessAlertManual("新闻添加成功！");
                    $('#addNews').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#addNews').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#newsContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addNewsForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 新增页面的返回按钮
function addCancel() {
    $('#addNews').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addNews').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#newsContent').css('display', 'block').addClass('animated slideInRight');
    $('#addNewsForm').bootstrapValidator('resetForm', true);
}

/*
* 新闻管理修改新闻页面所有事件
*/
// 修改新闻
function editNews(newsId, newsNo) {
    $('#newsContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#newsContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#updateNews').css('display', 'block');
    $('#updateNews').addClass('animated slideInRight');

    EditorObj.initEditor("editor_edit");
    // $('#editor_edit').empty(); // 不知道有没有用
    
    var id = newsId;
    //设置请求参数
    var req = {
        newsNo: newsNo,
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSiteNewsInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#edit_id').val(id);
                $('#edit_newsNo').val(res.data.newsNo);
                $('#edit_title').val(res.data.title);
                $('#edit_description').val(res.data.description);
                $('#edit_newsType').val(res.data.newsType);
                EditorObj.editor.txt.html(res.data.content);

                $('#edit_remark').val(res.data.remark);
                $('#edit_beginTime_value').val(res.data.beginTime);
                $('#edit_endTime_value').val(res.data.endTime);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveNews() {
    $('#editNewsForm').bootstrapValidator('validate');

    if ($("#editNewsForm").data('bootstrapValidator').isValid()) {
        var jsonNews = commonObj.getJsonObjectByFormWithEditor('editNewsForm', EditorObj.editor, 'newsContent');

        var opt = {
            method: 'post',
            url: dataUrl.util.updateSiteNewsInfoById(),
            data: JSON.stringify(jsonNews),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    //回退到 新闻管理主页
                    $('#updateNews').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#updateNews').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#newsContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新新闻管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editNewsForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 修改页面回退按钮事件
function editCancel() {
    $('#updateNews').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#updateNews').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#newsContent').css('display', 'block').addClass('animated slideInRight');
    $('#editNewsForm').bootstrapValidator('resetForm', true);
}

// 删除事件按钮
function deleteNews(newsId, newsNo) {
    $('#delete_msg').text('确定要删除该新闻吗?');
    $('#delete_window').addClass('bbox');

    this.newsId = newsId;
}
// 删除 确定按钮事件
function deleteConfirm() {
    $('#delete_window').removeClass('bbox');

    // 单新闻删除
    var id = this.newsId;
    var ids = [id];

    //设置请求参数
    var req = {
        id: id,
        ids: ids
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.deleteSiteNewsInfo(),
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

// 查看新闻详情
function showNews(newsId, newsNo) {
    $('#newsContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#newsContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#showNews').css('display', 'block');
    $('#showNews').addClass('animated slideInRight');

    $('#editor_detail').empty();

    var id = newsId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSiteNewsInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {

                $('#detail_id').val(id);
                $('#detail_newsNo').val(res.data.newsNo);
                $('#detail_title').val(res.data.title);
                $('#detail_description').val(res.data.description);
                $('#detail_newsType').val(res.data.newsType);
                $('#editor_detail').append(res.data.content);

                $('#detail_remark').val(res.data.remark);
                $('#detail_beginTime').val(res.data.beginTime);
                $('#detail_endTime').val(res.data.endTime);

                $('#detail_readNum').val(res.data.readNum);
            }
        }
    };
    getAjax(opt);
}
// 详情页面回退按钮事件
function showCancel() {
    $('#showNews').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#showNews').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#newsContent').css('display', 'block').addClass('animated slideInRight');
}

function tableHeight() {
    return $(window).height() * 0.83;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#newsContentTable').bootstrapTable('refresh', {url: dataUrl.util.querySiteNewsInfoForPage()});
}