var datetimerfun = {
    init:function () {
        $('.form_datetime').datetimepicker({
            language:  'zh-CN',
            format: 'yyyy-mm-dd hh:ii',
            startDate: '1901-01-01',   //开始时间
            // endDate: '2017-09-09', //结束时间
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            minView: 0,  //0表示可以选择小时、分钟   1只可以选择小时
            minuteStep: 5//分钟间隔1分钟
        });
        $('.form_date').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        });
        $('.form_time').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        });
    },

};