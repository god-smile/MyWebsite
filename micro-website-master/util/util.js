
// 公共刷新时间


//公共方法 table部分
var commonObj={
    refreshDataTime :60000,
    // 数据为null转为 "-"串处理
    replacenull:function (value, row, index) {
        if(value===null||value===undefined||value===''){
            value = '-'
        }
        return value
    },
    // 数据为null转为 空字符串处理
    isnull:function (value, row, index) {
        if(value===null||value===undefined||value===''){
            value = '-'
        }
        return value
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
    //状态处理 10：在场 20：离场
    inOutStateFormatter: function (value, row, index) {
        if (value == 10) {
            return "<span class='ITD-status-on'>在场</span>";
        } else if(value == 20){
            return "<span class='ITD-status-off'>离场</span>";
        }else{
            return "未知";
        }
    },
    //支付方式处理
    discPayTypeFormatter:function(value){
        if (value==null||value==undefined||value=='') {
            return "-";
        }
        else if(value == -1){
            return "不限";
        }
        else if(value == 1){
            return "支付宝";
        }
        else if (value == 2){
            return "微信";
        }
        else if(value == 3){
            return "银联";
        }
        else if(value == 4){
            return "微信公众号";
        }
        else if(value == 6){
            return "现金";
        }
        else{
            return "未知";
        }
    },
    //车型号处理
    disCarTypeFormatter:function(value){
        if (value==null||value==undefined||value=='') {
            return "-";
        }
        else if(value == 1){
            return "大型车";
        }
        else if (value == 2){
            return "小型车";
        }
        else if(value == 3){
            return "新能源车";
        }
        else{
            return "未知";
        }
    },
    //收费方式格式处理  免费0  收费1
    psPayTypeFormatter:function(value){
        if(value==null||value==undefined||value==''){
            return "-";
        }
        else if(value == "0"){
            return "免费";
        }
        else if(value == "1"){
            return "收费";
        }
        else{
            return "未知";
        }
    },
    //车位来源格式处理 私有车位1 公共停车位2 写字楼3 商业园区4
    psSourceTypeFormatter:function(value){
        if(value==null||value==undefined||value==''){
            return "-";
        }
        else if(value == "1"){
            return "私有车位";
        }
        else if(value == "2"){
            return "公共停车位";
        }
        else if(value == "3"){
            return "写字楼";
        }
        else if(value == "4"){
            return "商业园区";
        }
        else{
            return "未知";
        }
    },
    //车位状态格式处理 未租用0   租用 无车1   租用 有车2    异常3
    psIsOccupyFormatter:function(value){
        if(value==null||value==undefined||value==''){
            return "-";
        }
        else if(value == "0"){
            return "未租用";
        }
        else if(value == "1"){
            return "租用 无车";
        }
        else if(value == "2"){
            return "租用 有车";
        }
        else if(value == "3"){
            return "异常";
        }
        else{
            return "未知";
        }
    },
    //审核状态格式处理  待审核0  审批中1  通过2  驳回3
    psExamineStateFormatter:function(value){
        if(value==null||value==undefined||value==''){
            return "-";
        }
        else if(value == "0"){
            return "待审核";
        }
        else if(value == "1"){
            return "审批中";
        }
        else if(value == "2"){
            return "通过";
        }
        else if(value == "3"){
            return "驳回";
        }
        else{
            return "未知";
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
    }
};










