;(function (){
    /*
     *时间下拉框筛选
     *依赖于下列js类库：
     > jQuery.js
     > oClass.js
     > moment.js
     > juicer.js
     edit by hl 2016.06.20
     */

var default_option = {
    containerId: 'tfilterId', 
    ftype: 'week', 
    prefix: 'tfilter',
    tpl: '',
    evtfunc: function(){}
};

/*
    var option = {
        ftype: 'week', 
        prefix: 'tfilter',
        tpl: tpl, //加载渲染时间选择器的模板
        vari: this, //赋值一个运行环境
        evtfunc: function(){}
    }
*/
var Timefilter = function(option){
    var _opts = $.extend({}, default_option, option);
    this.containerId = _opts.containerId;   //时间选择器的父容器id
    this.ftype = _opts.ftype;  //选择器类型
    this.prefix = _opts.prefix;  //每个元素的id和class命名时的前缀
    this.evtfunc = _opts.evtfunc;
    this.vari = _opts.vari; //存储evtfunc函数运行的环境变量
    this.tpl = _opts.tpl;
    this.filter = '';      //过滤条件（sql语句）
    this.selectedWeek = '';
    var friday = this.getFriday();
    this.init(friday);
}
Timefilter.prototype = {
    constructor: Timefilter,

    init: function(sDate){
        var param = {prefix: this.prefix};
        var html = juicer(this.tpl,param);
        $('#'+this.containerId).html(html);
        var date;
        if(!sDate){
            date = moment().format('YYYY-MM-DD');
        } else {
            date = sDate;
        }
        this.friday = date;
        this.initYear(date);
        this.initSeason(date);
        this.initMonth(date);
        this.initWeek(date);
        var warn = this.initDatewarn();
        $('#'+this.prefix+'-dateWarn').html(warn);
        this._bindEvts();
    },
    

    /*  初始化年份选择框  */
    initYear: function (sDate){
        var prefix = this.prefix;
        $('#'+prefix+'-year').children('option').remove();
        var t = this.getTime(sDate),
            year = t.year,
            arr = [];
        for(var i=-2;i<5; i++){
            arr.push(year+i);
        }
        this.initOption(prefix+'-year',arr,3);
    },

    /*  初始化季度选择框  */
    initSeason:function (sDate){
        var prefix = this.prefix;
        $('#'+prefix+'-season').children('option').not('.'+prefix+'-firopt').remove();
        var arr=[1,2,3,4];
        var t = this.getTime(sDate),
            index = t.season;
        this.initOption(prefix+'-season',arr,index);
    },

    /*  初始化月份选择框  */
    initMonth:function (sDate){
        var prefix = this.prefix;
        $('#'+prefix+'-month').children('option').not('.'+prefix+'-firopt').remove();
        var t = this.getTime(sDate),
            season = t.season,
            month = t.month,
            week = t.week;
            index = month-3*(season-1),
            arr = [];
        for(var i=2; i>-1; i--){
            arr.push(season*3-i);
        }
        this.initOption(prefix+'-month',arr,index);
    },

    /*  初始化周选择框  */
    initWeek:function (sDate){
        var prefix = this.prefix;
        $('#'+prefix+'-week').children('option').not('.'+prefix+'-firopt').remove();
        var t = this.getTime(sDate),
            year = t.year,
            month = t.month,
            week = t.week,
            arr = [1,2,3,4];
        var ifFifthWeek = this.ifExistFifthWeek(year,month);
        if(ifFifthWeek){
            arr.push(5);
        }
        this.initOption(prefix+'-week',arr,week);
    },

    /*  初始化某个select框选项,(可选)选中第index项,index从0开始计数  */
    initOption:function (selectId,arr,index){
        for(var i=0,len=arr.length; i<len; i++){
            var opt = $('<option></option>').append(arr[i]);
            $('#'+selectId).append(opt);
            if(index && index==i+1){
                opt.prop('selected',true);
            }
        }
    },

    // 重新修正时间选择器后面的提示文字
    initDatewarn: function(){
        var that = this,
            prefix = this.prefix;
        $('#'+that.prefix+'-dateWarn-se').empty();
        var y = $('#'+prefix+'-year').val(),
            s = $('#'+prefix+'-season').val(),
            m = $('#'+prefix+'-month').val(),
            w = $('#'+prefix+'-week').val(),
            warn = '';
        switch(that.ftype){
            case 'year':
                warn = y+'年';
            break;
            case 'season':
                warn = y+'年'+s+'季度';
            break;
            case 'month':
                warn = y+'年'+m+'月';
            break;
            case 'week':
                warn = y+'年'+m+'月 第'+w+'周';
                var fri = that.calcDate(y,m,w);
                this.selectedWeek = fri;
                var datearr = that.calcStartAndEnd(fri);
                var se = '('+datearr.join('-')+')';
                $('#'+prefix+'-dateWarn-se').html(se);
            break;
        }
        return warn;
    },

    _bindEvts: function(){
        var that = this,
            prefix = this.prefix;
        $('.'+this.prefix+'-select').on('change',function(){
            var litype = $(this).attr('litype'),
                pretype = $(this).attr('pretype'),
                val = $(this).val();
            switch(litype){
                case 'year':
                    that.ftype = litype;
                    $('#'+prefix+'-season').val('0');
                    $('#'+prefix+'-month').children('option').not('.'+prefix+'-firopt').remove();
                    $('#'+prefix+'-week').children('option').not('.'+prefix+'-firopt').remove();
                break;
                case 'season':
                    var val = $(this).val();
                    $('#'+prefix+'-week').children('option').not('.'+prefix+'-firopt').remove();
                    $('#'+prefix+'-month').children('option').not('.'+prefix+'-firopt').remove();
                    if(!parseInt(val)){
                        that.ftype = pretype;
                    } else {
                        that.ftype = litype;
                        var arr = [];
                        for(var i=2; i>-1; i--){
                            arr.push(val*3-i);
                        }
                        that.initOption(prefix+'-month',arr);
                    }
                break;
                case 'month':
                    $('#'+prefix+'-week').children('option').not('.'+prefix+'-firopt').remove();
                    if(!parseInt(val)){
                        that.ftype = pretype;
                    } else {
                        that.ftype = litype;
                        var arr = [1,2,3,4];
                        var y = $('#'+prefix+'-year').val();
                        if(that.ifExistFifthWeek(y,val)){
                            arr.push(5);
                        }
                        that.initOption(prefix+'-week',arr);
                    }
                break;
                case 'week':
                    if(!parseInt(val)){
                        that.ftype = pretype;
                    } else {
                        that.ftype = litype;
                    }
                break;
            }
            var warn = that.initDatewarn();
            $('#'+prefix+'-dateWarn').html(warn);
            that.evtfunc.call(that.vari);
        })
        $('#'+prefix+'-thisWeek').click(function(){
            that.ftype = 'week';
            that.init(that.friday);
            that.evtfunc.call(that.vari);
        })
    },

    /*  得到sDate对应的年、季度、月和周，以键值对形式返回  */
    getTime:function (sDate){
        var that = this;
        var t = {
            year:  moment(sDate).get('year'),
            season:moment(sDate).quarter(),
            month: moment(sDate).get('month')+1,
            week:  that.getWeek(sDate)
        }
        return t;
    },

    /*  返回sDate所在周的周五是当月第几个周五  */
    getWeek:function (sDate) {
        var today=moment(sDate);
        var d=today.date();
        var w=today.day();
        return Math.ceil( (d + 5 - w) / 7 ); 
    },

    /*  根据日期，计算当周周五的日期  */
    getFriday: function(sDate){
        var date;
          if(!sDate){
          date = moment().format('YYYY-MM-DD');
        } else {
          date = sDate;
        }
        var week = moment(date).day();
        var friday = moment(date).add(5-parseInt(week),'days').format('YYYY-MM-DD');
        return friday;
    },

    /*  根据年、月确定当月是否存在五个周五  */
    ifExistFifthWeek: function (y,m) {
        m = parseInt(m)<10? '0'+m: m;
        var day = moment(y+'-'+m+'-02').day();
        var fifthFriday = moment(y+'-'+m+'-'+(35-parseInt(day)));
        var flag = moment(fifthFriday).isValid();
        return flag;
    },

    //根据年、月、周计算当月第w个周五的日期
    calcDate: function (y,m,w) {
        m = parseInt(m)<10 ? '0' + parseInt(m): m;
        var friday='';
        switch(parseInt(w)){
            case 5:
                var date = moment(y+'-'+m+'-29');
                var week = date.day();
                friday = moment(y+'-'+m+'-'+(34-parseInt(week))).format('YYYY-MM-DD');
            break;
            default:
                var r = 7*w-5;
                r = parseInt(r)<10? '0'+r: r;
                var date = moment(y+'-'+m+'-'+r);
                var week = date.day();
                var tmpw = 7*w-parseInt(week);
                tmpw = tmpw<10? '0'+tmpw: tmpw;
                friday = moment(y+'-'+m+'-'+tmpw).format('YYYY-MM-DD');
            break;
        }
        return friday;
    },

    //计算每周的起始和截止日期
    calcStartAndEnd: function (friday) {
        var arr = []; 
        arr.push(moment(friday).subtract(5,'days').format('YYYY.MM.DD'));
        arr.push(moment(friday).add(1,'days').format('YYYY.MM.DD'));
        return arr;
    },

    // 得到时间选择器选中的值
    getSelectVal: function(){
        var y = $('#'+this.prefix+'-year').val(),
            s = $('#'+this.prefix+'-season').val(),
            m = $('#'+this.prefix+'-month').val(),
            w = $('#'+this.prefix+'-week').val();
        m = parseInt(m)<10? '0'+m: m;
        return [y,s,m,w];
    },

    
    // 根据所选择的值返回id
    getIdstr: function() {
        var val = this.getSelectVal(),
            str = '';
        switch(this.ftype){
            case 'year':
                str += val[0];
            break;
            case 'season':
                str += val[0]+val[1];
            break;
            case 'month':
                str += val[0]+val[2];
            break;
            case 'week':
                str += val[0]+val[2]+val[3];
            break;
        }
        return str;
    },

    // 得到一周的每一天的日期，以数组形式返回
    getWeekTimes: function(sDate) {
        var date;
          if(!sDate){
          date = this.selectedWeek;
        } else {
          date = sDate;
        }
        var week = moment(date).day();
        var friday = moment(date).add(5-parseInt(week),'days').format('YYYY-MM-DD');
        var arr = [];
        for(var i=-5; i<2; i++) {
            arr.push(moment(friday).add(i,'days').format('YYYY-MM-DD'));
        }
        return arr;
    }
}
window.oClass.Timefilter = Timefilter;
})();
