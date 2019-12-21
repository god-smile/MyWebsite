var newsId;

var editor;

var fadeTime = 500;

$(function () {
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
            {title: '新闻类型', field: 'newsType', sortable: true, formatter: typeFormatter},
            {title: '注册日期', field: 'createTime', sortable: true, formatter: commonObj.timeFormatter},
            {title: '修改日期', field: 'modifyTime', sortable: true, formatter: commonObj.timeFormatter},
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
        pageSize:pageSize
    };
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
// 正文初始化
function initEditor(editorId) {
    //清空
    $("#" + editorId).empty();
    var E = window.wangEditor;
    this.editor = new E('#' + editorId);
    // 自定义菜单配置
    this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        // 'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        // 'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
    ];
    // editor.customConfig.uploadImgServer = '/Upload/wang_editor';  // 上传图片到服务器
    //editor.customConfig.uploadImgServer = '/upload';
    this.editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
    // 3M
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    // 限制一次最多上传 3 张图片
    this.editor.customConfig.uploadImgMaxLength = 3;
    // 自定义文件名
    this.editor.customConfig.uploadFileName = 'editor_img';
    // 将 timeout 时间为 3s
    this.editor.customConfig.uploadImgTimeout = 3000;

    this.editor.create();
    this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
            // alert("前奏");
        },
        success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            // var url = result.data.url;
            // alert(JSON.stringify(url));
            // editor.txt.append(url);
            // alert("成功");
        },
        fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            alert("失败");
        },
        error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            // alert("错误");
        },
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.data[0];
            insertImg(url);
            // result 必须是一个 JSON 格式字符串！！！否则报错
        }
    };
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
    initEditor("editor_add");
}
// 新增页面表单验证
function addSaveNews() {
    //点击保存时触发表单验证
    $('#addNewsForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加新闻
    if ($("#addNewsForm").data('bootstrapValidator').isValid()) {
        var jsonNews = commonObj.getJsonObjectByFormWithEditor('addNewsForm', this.editor);

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

    initEditor("editor_edit");
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
                $('#edit_title').val(res.data.title);
                // $('#edit_newsType').val(res.data.newsType);
                $('#editor_edit').append(res.data.content);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveNews() {
    $('#editNewsForm').bootstrapValidator('validate');

    if ($("#editNewsForm").data('bootstrapValidator').isValid()) {
        var jsonNews = commonObj.getJsonObjectByFormWithEditor('editNewsForm', this.editor);

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

    $('#detail_edit').empty();

    var id = userId;
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
                $('#detail_title').val(res.data.title);
                // $('#detail_newsType').val(res.data.newsType);
                $('#detail_edit').append(res.data.content);
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