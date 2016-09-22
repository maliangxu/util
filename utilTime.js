
/*
	关于时间和日期操作的一些函数
    依赖于下列js文件：
    > moment.min.js
*/


/*	时间操作的基本函数	*/
var utilTime = {	

    /**
    * 得到本年
    * getYear
    * 得到本季度
    * getSeason
    * 得到本月
    * getMonth
    * 得到本日
    * getDate
    * 得到星期几
    * getDay
    * 得到小时
    * getHour
    * 得到分钟
    * getMinute
    * 得到秒
    * getSecond
    * 获取当前的日期时间
    * returnDate
    * 获取当前的日期时间
    * returnTime
    * 得到日期时间戳
    * getMsUnix
    * 将input赋为当前日期
    * valueAsDate
    * 获取当前的日期和时间
    * returnDateAndTime
    * 本周几是当月的第几周
    * whichWeek
    * 计算天数差的函数
    * DateDiff
    * 根据年、月确定当月是否存在五个周五
    * ifExistFifthWeek
    * 根据年、月、周计算当周周五的日期
    * calDate
    * 根据给定的日期得到对应周的周五属于哪一年、哪个月、哪一周
    * getymw
    * 根据日期，计算当周周五的日期
    * getFriday





*/



    date : new Date(),

	/*	得到本年  */
    getYear: function () {
        return this.date.getFullYear();
    },

    /*	得到本季度  */
    getSeason: function () {
        return Math.ceil(this.getMonth()/3);
    },

    /*	得到本月  */
    getMonth: function () {
        return this.date.getMonth()+1;
    },

    /*	得到本日  */
    getDate: function () {
        return this.date.getDate(); 
    },

    /*	得到星期几  */
    getDay: function(){
    	return this.date.getDay();
    },

    /*	得到小时  */
    getHour: function() {
    	return this.date.getHours();
    },

    /*	得到分钟  */
    getMinute: function() {
    	return this.date.getMinutes();
    },

    /*	得到秒  */
    getSecond: function() {
    	return this.date.getSeconds();
    },

	/*  获取当前的日期时间 格式“yyyy-MM-dd”  */
	returnDate: function(){
		var y = this.getYear();    //获取完整的年份(4位,1970-????)
		var m = this.getMonth();       //获取当前月份(0-11,0代表1月)
		var d = this.getDate();        //获取当前日(1-31)
		m = this.formatTime(m);
		d = this.formatTime(d);
        var date = y+'-'+m+'-'+d;
		return date;
	},
    //获取当前日期，并以特定格式输出（2015-11-16）
    getTime2Day: function () {
        var addDate = moment().format('YYYY-MM-DD');
        return addDate;
    },
    //得到日期时间戳
    getMsUnix: function (tStr) {
        return moment(tStr).format('x');
    },
    //将input赋为当前日期
    valueAsDate: function (inputId) {
        document.getElementById(inputId).valueAsDate = new Date();
    },
	/*  获取当前的日期时间 格式“HH:MM:SS”  */
	returnTime: function() {
	    var hour = this.getHour();
	    var minute = this.getMinute();
	    var second = this.getSecond();
	    hour = this.formatTime(hour);
	    minute = this.formatTime(minute);
	    second = this.formatTime(second);
	    var currentdate = hour + ':' + minute + ':' + second;
	    return currentdate;
	},
  
	/*  获取当前的日期和时间 格式“yyyy-MM-dd HH:MM:SS”  */
	returnDateAndTime: function (){
		return this.returnDate()+" "+this.returnTime();
	},

	formatTime: function(num){
		if(typeof(num) !== 'number'){
			num = parseInt(num);
		}
		if (num >= 1 && num <= 9) {
	        num = "0" + num;
	    }
	    return num;
	},

    /*
    *本周几是当月的第几周
    *day表示周几，如计算周五，day=5
    */
    whichWeek: function (day) { 
        var d = this.getDate(); 
        var w = this.getDay();
        return Math.ceil( (d + day - w) / 7 ); 
    },

    /*  计算天数差的函数    */
    DateDiff: function (sDate1,sDate2) {   //sDate1和sDate2是2006-12-18格式  
        var  aDate,oDate1,oDate2,iDays;
        aDate = sDate1.split("-");
        oDate1 = new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);   //转换为12-18-2006格式  
        aDate = sDate2.split("-");
        oDate2 = new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1  -  oDate2)/1000/60/60/24);    //把相差的毫秒数转换为天数  
        return  iDays;
    },
    
    /*  根据年、月确定当月是否存在五个周五  */
    ifExistFifthWeek: function (y,m) {
        m = parseInt(m)<10? '0'+m: m;
        var day = moment(y+'-'+m+'-02').day();
        var fifthFriday = moment(y+'-'+m+'-'+(35-parseInt(day)));
        var flag = moment(fifthFriday).isValid();
        return flag;
    },



    //根据年、月、周计算当周周五的日期
    calDate: function (y,m,w) {
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

    /*  
     *根据给定的日期得到对应周的周五属于哪一年、哪个月、哪一周
     *返回值为数组
     */
    getymw: function (sDate){
        if(parseInt(moment(sDate).day()) != 5){
            sDate = this.getFriday(sDate);
        }
        var time = moment(sDate);
        var y = time.year(),
            m = time.month()+1,
            d = time.date();
        var w = Math.ceil(d/7);
        m = parseInt(m)<10? '0'+m:m;
        return [y,m,w];
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













};

