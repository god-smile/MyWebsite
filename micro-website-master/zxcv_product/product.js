//需要用到的数据
var state = {
    //当前页数
    currentPage: 1,
    //总的数据个数
    total: 0,
    //每页个数
    pageSize: 8,
    //总页数
    totalPage: 0,
    //表格数据
    tableData: [],
    //表格总数据
    tableTotalData: [],
    //所有的新闻类型信息
    category: [],
    //当前操作类型：新增或修改
    option: '发布',
    //当前点击的对象的id
    currentId: '',
    //当前info-action中select选中的栏目id
    currentCId: '',
    // 当前修改的对象
    currentObj: {},
};
//追加模态框处所属栏目的option节点
function addOptionDOM() {
    var optionStr = `<option value="">请选择</option>`;
    state.category.forEach(function(item) {
        optionStr += `<option value="` + item.id + `">` + item.name + `</option>`;
    });
    $('#category').html(optionStr);
}
//新增事件绑定
$('.add-btn').click(function(event) {
    //设置模态框标题
    $('.modal-title').text('发布资讯');
    //选中select
    $('#category').selectpicker();
    $('#category').selectpicker('val','1');
    //addOptionDOM();
    // 清空表单数据，显示模态框
    $('.modal [type=text]').val('');
    $('input[type=radio]:checked').prop('checked', false);
    //模态框中的select的值为.myselect的值
    $('#category').val($('.myselect').val());
    //加载编辑正文
    fun.addTextFun();
    $('#add-update-modal').modal('show');
});
//修改事件绑定
$('tbody').on('click', '[title=编辑]', function() {
    //设置模态框标题
    $('.modal-title').text( '编辑资讯');
    addOptionDOM();
    //获取当前点击的元素的id
    var id = $(this).attr('data_id');
    //遍历数据，如果当前id与遍历的id同，取出需要的属性值
    var article = state.tableData.filter(function(item) {
        return item.id == id;
    })[0];
    state.currentObj = article;
    // 设置值
    $('#title').val(article.title);
    //模态框中的select的值为.myselect的值
    $('#category').val($('.myselect').val());
    $('input[value=' + article.liststyle + ']').prop('checked', true);
    $('#content').val(article.content);
    $('#add-update-modal').modal('show');
});

//获取所有新闻类型，追加节点到select中
function addCategory() {
    getAjax('/newsInfo/querySiteNewsInfoForPage', 'post', null, function(res) {
        state.category = res.data;
        var option = '';
        state.category.forEach(function(item) {
            option += `<option value="` + item.id + `">` + item.name + `</option>`;
        });
        $('.myselect').html(option);
        state.currentCId = res.data[0].id;
        //加载当前select中对应的资讯信息,也是第一个
        findArticle(state.currentCId);
    }, function(error) {
        console.log(error);
    });
}

var fun = {
    init:function(){
        fun.loadData();
    },
    //获取查询参数
    getQueryParam:function(){
        var req = {};
        var title = $("#title").val();
        req ={
            title:title,
        };
        return req;
    },
    /** 加载数据 */
    loadData:function () {
        //生成新闻资讯
        $('#infoTable').bootstrapTable({
            method: 'post',
            // contentType: "application/x-www-form-urlencoded",
            // contentType: "application/json; charset=utf-8",
            // url:"/user/queryUserInfoForPage",
            height:tableHeight(),//高度调整
            striped: true, //是否显示行间隔色
            rownumbers:true,
            // dataField: "res",
            pageNumber: 1, //初始化加载第一页，默认第一页
            pagination:true,//是否分页
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            queryParamsType:'limit',
            // queryParams:queryParams,
            sidePagination:'server',
            pageSize:10,//单页记录数
            pageList:[5,10,20,30],//分页步进值
            showRefresh:true,//刷新按钮
            showColumns:true,
            clickToSelect: true,//是否启用点击选中行
            toolbarAlign:'right',
            buttonsAlign:'right',//按钮对齐方式
            toolbar:'#toolbar',//指定工作栏
            ajax: tableLoadRequest,//自定义ajax加载数据
            columns:[
                {title:'id',field:'id',visible:true},
                {title:'标题',field:'title',sortable:true},
                {title:'创建人',field:'createEmpName',sortable:true},
                {title:'创建日期',field:'createTime',sortable:true},
                {title:'修改日期',field:'modifyTime',sortable:true},
                {title:'操作',field:'',align:'center',formatter:fun.operateFormatter}
            ],
            locale:'zh-CN',//中文支持,
        });
    },
    operateFormatter:function(value, row, index){
        var html = "<span class='detail_news ' data-id='" + row.id + "' data-no='" + row.newsNo + "'  >查看</span> ";
            html += "<span class='delete_news' data-id='" + row.id + "'data-no='" + row.newsNo + "' >删除</span> ";

       return html;
    },
    //添加正文初始化
    addTextFun: function () {
        //清空
        $("#editor_add").empty();
        var E = window.wangEditor;
        var editor = new E('#editor_add');
        // 自定义菜单配置
        editor.customConfig.menus = [
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
        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // 3M
        editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
        // 限制一次最多上传 3 张图片
        editor.customConfig.uploadImgMaxLength = 3;
        // 自定义文件名
        editor.customConfig.uploadFileName = 'editor_img';
        // 将 timeout 时间为 3s
        editor.customConfig.uploadImgTimeout = 3000;

        editor.create();
        editor.customConfig.uploadImgHooks = {
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
        }


        //获取文本输入的内容
        document.getElementById('save_news_submit').addEventListener('click', function () {
            var content = editor.txt.html();
            var title = $('#insert_title').val();

            var req = {
                title: title,
                newsType: 1,
                beginTime:new Date(),
                endTime:new Date("2099-01-01 00:00:00"),
                projectNo:"PJ1001",
                createEmpId:"1001",
                createEmpName:"admin",
                newsContent: content,

            };
            //条件查询

            var opt = {
                method: 'post',
                url: dataUrl.util.saveNewsInfo(),
                data: JSON.stringify(req),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '8888') {
                        $("#infoTable").bootstrapTable('refresh');
                        $('#add-update-modal').modal('hide');
                    }
                },
                error: function (msg) {
                    console("后端异常：" + msg);
                }
            };
            getAjax(opt);


        }, false)

    },
}



fun.init();


function tableHeight() {
    return $(window).height() - 140;
}

/**
 * 自定义table AJAX请求
 * @param {Object} params
 */
function tableLoadRequest(params) {
    var req = fun.getQueryParam();
    var data = JSON.parse(params.data);
    //设置请求参数
    var pageNum = data.pageNumber;
    var pageSize = data.limit;

    //条件查询
    req.pageReq = {
        pageNum: pageNum,
        pageSize:pageSize
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.queryUserRechargeRefundForPage(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                params.success(res.data);
            }
        }
    };
    getAjax(opt);
}
//查询按钮
$('#search_btn').click(function(event) {
    fun.loadData();
});

//查看
documentBindFunc.on('click', '.detail_news', function () {
    debugger;
// $('.detail_news').click(function(event) {
    $(".modal-title").text("资讯详情");
    $('#detail_content').empty();

    var id = $(this).data('id');
    var newsNo = $(this).data('no');
    //设置请求参数
    var req = {
        newsNo: newsNo,
        id: id
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectNewsInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                $('#detail_content').append(res.data.content);
                $('#detail_modal').modal('show');
            }
        }
    };
    getAjax(opt);
});