;(function (){
/*
	对WebSQL接口和WebSQLScript接口二次封装
    依赖于下列js文件：
    > jQuery
    > oClass.js
    > gWebSQL.js
    > gWebSQLScript.js
	edit in 2016.06.01
	edit by hl
*/
var default_option = {
    db: 'slprj'
};

var Db = function(option){
    var _opts = $.extend({}, default_option, option);
    this.db = _opts.db;
};

Db.prototype = {
    constructor: Db,

    /*
     *@describtion 添加记录
     *params: {'Fields':["fldname","fldnum"],'Data':[["name1",1],["name2",2]]}
     */
    itemAdd: function (db,tb,params,succ) {
        var succCallback = arguments.length>3? succ: function(){};
        var sqlservice=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(){
                succCallback();
            },'processFailed':{ }});
        sqlservice.processAscyn('ADD',db,tb,params);
    },

	/*
	 *@describtion 删除表格中的记录
	 *@Params database表示数据库名，tbName表示表格名称，idArr为一维数组，表示要删除行的主键(一般为id号)
     *@Params params = {'Fields':'id','Data':idArr};
	 */
	itemDelete: function (db,tb,params,succCallback,failCallback){
        var succ = arguments.length < 4? function(){}: succCallback;
      	var sqlservice=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(){
          	succ();
	 	  },'processFailed':function(){
        	if(arguments.length >4 ){
        	    failCallback();
        	}	 	   		    
	 	  }
	 	});
	 	sqlservice.processAscyn('DELETE',db,tb,params);
    },

    /*
     *更新记录
     *params: {'Fields':[Array],'Data':[[Array],[Array]]}   Fields中第一个字段为更新标示
     */
    itemUpdate: function (db,tb,params,succ) {
        var succCallback = arguments.length>3? succ: function(){};
        var sqlservice=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(){
                succCallback();
            },'processFailed':{}});
        sqlservice.processAscyn('UPDATE',db,tb,params);
    },

    /*
     *查询记录
     *sql:  {'lyr':'表名','fields':'字段','filter':'条件'}
     */
    itemQuery: function (db,sql,succ) {
        var succCallback = arguments.length>2? succ: function(){};
        var sqlservice=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(data){
              succCallback(data); //回调函数里返回数据
  
            },'processFailed':{}});
        sqlservice.processAscyn('SQLQUERY',db,sql);
    },

    /*
     *执行语句
     */
    itemExec: function(db,sql){
    	var sqlservice=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(){
			 //回调函数里没有返回数据
			
			},'processFailed':failsql});
		sqlservice.processAscyn('SQLEXEC',db,sql);
    },

    /*
     *WebSQLScript脚本执行
     *@Params option 参数配置
     	var option={
            "scriptname":路径,
            ../ 其他参数
        };
     */
    scriptExec: function(option,succ){
    	var succ = arguments.length>1? succ: function(){};
        var sqlScript = new gEcnu.WebsqlScript({'processCompleted':function(msg){
            succ(msg);
        },
        'processFailed':function (){}});
        sqlScript.processAscyn(option);
    },

    /**
     *多任务操作
     *db 数据库名
     *sqlTasksArr为JSON数组,每个数组元素格式为
        ele = {Params: {Fields: [Array], Data: [Array]},type: 'ADD/UPDATE',table: '{table name}'}
     *succ 成功回调
     */
    itemMulti: function(db,sqlTasksArr,callback) {
        var tasksArr = [];
        var succ = arguments.length>2? arguments[2]: function(){};
        for(var i=0,len=sqlTasksArr.length; i<len; i++) {
            var ele = sqlTasksArr[i];
            var sqlTask = new gEcnu.WebSQLServices.SQLTasks(ele.type,ele.table,ele.Params);
            tasksArr.push(sqlTask.sqlTaskParams);
        }
        var sqlServices = new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (msg){ 
               succ();
            },'processFailed':function (){ 
        }});
        sqlServices.processAscyn("SQLTask",db,sqlTasksArr);
    }
}
window.oClass.Db = Db;
})();