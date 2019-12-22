
// 公共刷新时间


//公共方法 table部分
var commonObj={
    refreshDataTime :60000,
    // 数据为null转为 "-"串处理
    replaceNull:function (value, row, index) {
        if(value===null||value===undefined||value===''){
            value = '-'
        }
        return value;
    },
    // 数据为null转为 空字符串处理
    isNull:function (value, row, index) {
        if(value===null||value===undefined||value===''){
            value = '-'
        }
        return value;
    },
    /*
     @切割字符串
     @str原字符串
     @num字符位数
     */
    cutString: function (str, num) {
        var _str = "";
        if(str == null){
            return "";
        }
        if (str.length >= num) {
            var strN = str.substring(0, num);
            strN += "...";
            _str = strN;
        } else {
            _str = str;
        }
        return _str;
    },
    // 金钱格式处理
    moneyFormatter: function (value) {
        if (value == '0' || value == undefined || value == null||value==='') {
            return '0.00';
        } else {
            return (value / 100).toFixed(2);
        }
    },
    // 格式处理
    moneydetailFormatter: function (value) {
        if (value == undefined || value == null||value==='') {
            return '-';
        } else {
            return (value / 100).toFixed(2);
        }
    },
    //数量处理
    numberFormatter: function (value) {
        if (value == 0 || value == undefined || value == null||value==='') {
            return 0;
        } else {
            return value;
        }
    },
    //table 不换行
    formatTableUnit:function(value,row,index){
        return {
            css: {
                "white-space":"nowrap"
            }
        }
    },
    //性别处理
    sexFormatter:function (value,row,index) {
        if(1==value){
            return "男";
        }else if(2==value){
            return "女";
        }else{
            return "保密";
        }
    },
    /**
    * 将制定格式的时间字符串转换成long
    * <li>0-yyyyMMdd</li>
    * <li>1-yyyy-MM-dd</li>
    * <li>2-HHmmss</li>
    * <li>3-HH:mm:ss</li>
    * <li>4-HHmmssSSS</li>
    * <li>5-HH:mm:ss.SSS</li>
    * <li>6-yyyyMMddHHmmss</li>
    * <li>7-yyyy-MM-dd HH:mm:ss</li>
    * <li>8-yyyyMMddHHmmssSSS</li>
    * <li>9-yyyy-MM-dd HH:mm:ss.SSS</li>
    * <li>10-yyyy/MM/dd HH:mm</li>
    * <li>11-yyyy/MM/dd HH:mm:ss</li>
    */
    // 日期格式处理 精确到时分秒  如：2018-10-24 08:41:33
    timeFormatter:function (value, row, index) {
        if (value==null||value==undefined||value=='') {
            return "-";
        } else {
            return DateUtils.long2String(value, 7);
        }
    },
    // 日期格式处理 精确到年月日  如：2018-10-24
    timeOneFormatter:function (value, row, index) {
        if (value==null||value==undefined||value=='') {
            return "-";
        } else {
            return DateUtils.long2String(value, 1);
        }
    },
    // 日期格式处理 精确到年月  如：2018-10
    yearMonthFormatter:function (value, row, index) {
        if (value==null||value==undefined||value=='') {
            return "-";
        } else {
             var str = DateUtils.long2String(value, 1);
             return str.substr(0,7);
        }
    },

    // 字符串转数字处理


    /**
     * form 转 json
     * //将从form中通过$('#form').serialize()获取的值转成json
     */
    formToJson: function (data) {
        data=data.replace(/&/g,"\",\"");
        data=data.replace(/=/g,"\":\"");
        data="{\""+data+"\"}";
        return data;
    },


    /**
     * 根据 form id 获取一个json 对象， 附加中文编码
     */
    getJsonObjectByForm: function (formId) {
        var obj = $('#' + formId).serialize();
        obj = decodeURIComponent(obj,true);
        var jsonobj = JSON.parse(commonObj.formToJson(obj));
        return jsonobj;
    },

    /**
     * 根据 form id 获取一个json 对象， 有 富文本， 附加中文编码
     */
    getJsonObjectByFormWithEditor: function (formId, editor) {
        var obj = $('#' + formId).serialize();
        obj = decodeURIComponent(obj,true);
        var jsonobj = JSON.parse(commonObj.formToJson(obj));
        jsonobj.newsContent = editor.txt.html();
        return jsonobj;
    }
};










