var productId;

var editor;

var fadeTime = 500;

$(function () {
    constant.initProjectNo();

    $("#search_beginTime").val(moment().subtract('days', 30).format('YYYY-MM-DD'));
    $("#search_beginTime").datetimepicker({
        endDate: moment().subtract('days', 0).format('YYYY-MM-DD'),
        format: 'yyyy-mm-dd',
        autoclose: true,
        // startView: 3,
        // //maxDate:moment().subtract('months', 3),
        minView: 2,
        forceParse: false,
        locale: "zh-CN",
        language: 'zh-CN',
        pickerPosition: "bottom-left"
    });
    $("#search_endTime").val(moment().subtract('days', 0).format('YYYY-MM-DD'));
    $("#search_endTime").datetimepicker({
        endDate: moment().subtract('days', 0).format('YYYY-MM-DD'),
        format: 'yyyy-mm-dd',
        autoclose: true,
        // startView: 3,
        // //maxDate:moment().subtract('months', 3),
        minView: 2,
        forceParse: false,
        locale: "zh-CN",
        language: 'zh-CN',
        pickerPosition: "bottom-left"
    });
    //根据窗口调整表格高度
    $(window).resize(function () {
        $('#productContentTable').bootstrapTable('resetView', {
            height: tableHeight(),
            width: tableWidth()
        })
    });
    console.log("product");
    // 生成产品数据
    loadData();
});


// function beforeUploadFun(opt){
//     opt.otherData =[{"name":"name","value":"zxm"}];
// }
// function onUploadFun(opt,data){
//     alert(data);
//     uploadTools.uploadError(opt);//显示上传错误
//     uploadTools.uploadSuccess(opt);//显示上传成功
// }



/**
 * 上传文件
 */
function uploadFileFun(){
    var opt = uploadTools.getOpt("fileUploadContent");
    uploadTools.flushOpt(opt);
    if(opt.beforeUpload!=null&&(typeof opt.beforeUpload === "function")) {
        opt.beforeUpload(opt);
    }
    var uploadUrl = opt.uploadUrl;
    var fileList = uploadFileList.getFileList(opt);

    var formData = new FormData();
    var fileNumber = uploadTools.getFileNumber(opt);
    if(fileNumber<=0){
        debugger;
        ErrorAlertManual("没有文件，不支持上传");
        return false;
    }

    for(var i=0;i<fileList.length;i++){
        if(fileList[i]!=null){
            formData.append("pictureFile",fileList[i]);
        }
    }
    if(opt.otherData!=null&&opt.otherData!=""){
        for(var j=0;j<opt.otherData.length;j++){
            formData.append(opt.otherData[j].name,opt.otherData[j].value);
        }
    }

    formData.append("filelSavePath",opt.filelSavePath);
    if(uploadUrl!="#"&&uploadUrl!=""){
        uploadTools.disableFileUpload(opt);//禁用文件上传
        uploadTools.disableCleanFile(opt);//禁用清除文件

        $.ajax({
            type:"post",
            url:uploadUrl,
            data:formData,
            processData : false,
            contentType : false,
            success:function(data){
                uploadTools.initWithCleanFile(opt);
                setTimeout(function(){opt.onUpload(opt,data)},500);
                if(opt.isAutoClean){
                    setTimeout(function () {uploadEvent.cleanFileEvent(opt);},2000) ;
                }
                if (data.code == '8888' && data.data != null && data.data != '') {
                    $("#addPictureHide").val(data.data);
                }else{
                    ErrorAlertManual('图片上传错误！');
                }
            },
            error:function(e){
                ErrorAlertManual('系统错误，请联系管理员！');
            }
        });

    }else{
        uploadTools.disableFileUpload(opt);//禁用文件上传
        uploadTools.disableCleanFile(opt);//禁用清除文件
    }
    if(opt.uploadUrl=="#"||opt.uploadUrl=="") {
        uploadTools.getFileUploadPregressMsg(opt);
    }

}

/** 加载数据 */
function loadData() {
    //生成产品数据
    $('#productContentTable').bootstrapTable('destroy').bootstrapTable({
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
            // {title: 'id', field: 'id', visible: false},
            {title: '产品名称', field: 'title', sortable: false, formatter: titleFormatter},
            {title: '产品描述', field: 'description', sortable: false,
                formatter: function (value,row,index) {
                    return commonObj.cutString(value,10);
                }},
            {title: '创建时间', field: 'createTime', sortable: false, formatter: commonObj.timeFormatter},
            {title: '修改时间', field: 'modifyTime', sortable: false, formatter: commonObj.timeFormatter},
            {title: '操作', field: '', align: 'center', formatter: operateFormatter}
        ],
        locale: 'zh-CN',//中文支持,
    });
}
function titleFormatter(value, row, index) {
    var html = "<a href='#' class='edit_product' onclick='showProduct(" + row.id + ", \"" + row.productNo + "\")' >" + row.title + "</a> ";
    return html;
}

function operateFormatter(value, row, index) {
    var html = "<a href='#' class='edit_product' onclick='editProduct(" + row.id + ", \"" + row.productNo + "\")' id='edit_product' >修改</a> ";
    html += "&nbsp;&nbsp;&nbsp;";
    html += "<a href='#' class='delete_product' onclick='deleteProduct(" + row.id + ", \"" + row.productNo + "\")' id='delete_product' >删除</a> ";
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

    req.projectNo = sessionStorage.getItem("projectNo");

    var productTableAjax = {
        method: params.type,
        url: dataUrl.util.querySiteProductInfoForPage(),
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
    getAjax(productTableAjax);
}
//请求服务数据时所传参数
function queryParams() {
    return {
        title: $('#search_title').val(),
        beginTime: new Date($('#search_beginTime').val() + " 00:00:00"),
        endTime: new Date($('#search_endTime').val() + " 23:59:59"),
    }
}
//查询按钮事件
function searchProduct() {
    $('#productContentTable').bootstrapTable('refresh');
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
 * 产品管理增加产品页面所有事件
 */
// 新增产品
function addProduct() {
    $('#productContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#productContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#addProduct').css('display', 'block');
    $('#addProduct').addClass('animated slideInRight');

    // 初始化 上传文件组件
    $("#fileUploadContent").empty();
    $("#fileUploadContent").initUpload({
        "uploadUrl":dataUrl.util.uploadPicture(),//上传文件信息地址
        //"size":350,//文件大小限制，单位kb,默认不限制
        "maxFileNumber":1,//文件个数限制，为整数
        //"filelSavePath":"",//文件上传地址，后台设置的根目录
        // "beforeUpload":beforeUploadFun,//在上传前执行的函数
        //"onUpload":onUploadFun，//在上传后执行的函数
        //autoCommit:true,//文件是否自动上传
        isHiddenUploadBt:true,
        "fileType":['png','jpg']//文件类型限制，默认不限制，注意写的是文件后缀
    });


    // 加载编辑正文
    initEditor("editor_add");
}
// 新增页面表单验证
function addSaveProduct() {
    //点击保存时触发表单验证
    $('#addProductForm').bootstrapValidator('validate');
    //如果表单验证正确，则请求后台添加产品
    if ($("#addProductForm").data('bootstrapValidator').isValid()) {
        var jsonProduct = commonObj.getJsonObjectByFormWithEditor('addProductForm', this.editor,"content");

        var opt = {
            method: 'post',
            url: dataUrl.util.saveSiteProductInfo(),
            data: JSON.stringify(jsonProduct),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    SuccessAlertManual("产品添加成功！");
                    $('#addProduct').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#addProduct').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#productContent').css('display', 'block').addClass('animated slideInRight');
                    refreshTable();
                    $('#addProductForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 新增页面的返回按钮
function addCancel() {
    $('#addProduct').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#addProduct').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#productContent').css('display', 'block').addClass('animated slideInRight');
    $('#addProductForm').bootstrapValidator('resetForm', true);
}

/*
* 产品管理修改产品页面所有事件
*/
// 修改产品
function editProduct(productId, productNo) {
    $('#productContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#productContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#updateProduct').css('display', 'block');
    $('#updateProduct').addClass('animated slideInRight');

    initEditor("editor_edit");
    // $('#editor_edit').empty(); // 不知道有没有用

    var id = productId;
    //设置请求参数
    var req = {
        productNo: productNo,
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSiteProductInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#edit_id').val(id);
                $('#edit_title').val(res.data.title);
                $('#edit_description').val(res.data.description);
                // $('#editor_edit').append(res.data.content);
                editor.txt.html(res.data.content);
            }
        }
    };
    getAjax(opt);
}
//修改页面保存按钮事件
function editSaveProduct() {
    $('#editProductForm').bootstrapValidator('validate');

    if ($("#editProductForm").data('bootstrapValidator').isValid()) {
        var jsonProduct = commonObj.getJsonObjectByFormWithEditor('editProductForm', this.editor);

        var opt = {
            method: 'post',
            url: dataUrl.util.updateSiteProductInfoById(),
            data: JSON.stringify(jsonProduct),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    //回退到 产品管理主页
                    $('#updateProduct').addClass('animated slideOutLeft');
                    setTimeout(function () {
                        $('#updateProduct').removeClass('animated slideOutLeft').css('display', 'none');
                    }, fadeTime);
                    $('#productContent').css('display', 'block').addClass('animated slideInRight');
                    //刷新产品管理主页
                    refreshTable();
                    //修改页面表单重置
                    $('#editProductForm').bootstrapValidator('resetForm', true);
                }
            }
        };
        getAjax(opt);
    }
}
// 修改页面回退按钮事件
function editCancel() {
    $('#updateProduct').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#updateProduct').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#productContent').css('display', 'block').addClass('animated slideInRight');
    $('#editProductForm').bootstrapValidator('resetForm', true);
}

// 删除事件按钮
function deleteProduct(productId, productNo) {
    $('#delete_msg').text('确定要删除该产品吗?');
    $('#delete_window').addClass('bbox');

    this.productId = productId;
}
// 删除 确定按钮事件
function deleteConfirm() {
    $('#delete_window').removeClass('bbox');

    // 单产品删除
    var id = this.productId;
    var ids = [id];

    //设置请求参数
    var req = {
        id: id,
        ids: ids
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.deleteSiteProductInfo(),
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

// 查看产品详情
function showProduct(productId, productNo) {
    $('#productContent').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#productContent').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#showProduct').css('display', 'block');
    $('#showProduct').addClass('animated slideInRight');

    $('#editor_detail').empty();

    var id = productId;
    //设置请求参数
    var req = {
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectSiteProductInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {

                $('#detail_id').val(id);
                $('#detail_title').val(res.data.title);
                // $('#detail_productType').val(res.data.productType);
                $('#editor_detail').append(res.data.content);
            }
        }
    };
    getAjax(opt);
}
// 详情页面回退按钮事件
function showCancel() {
    $('#showProduct').addClass('animated slideOutLeft');
    setTimeout(function () {
        $('#showProduct').removeClass('animated slideOutLeft').css('display', 'none');
    }, fadeTime);
    $('#productContent').css('display', 'block').addClass('animated slideInRight');
}

function tableHeight() {
    return $(window).height() * 0.83;
}

function tableWidth() {
    return $(window).width() - 140;
}

function refreshTable() {
    $('#productContentTable').bootstrapTable('refresh', {url: dataUrl.util.querySiteProductInfoForPage()});
}