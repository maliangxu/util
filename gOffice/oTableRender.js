;(function (){
/*
	利用dataTables对表格进行渲染
	依赖于下列js文件：
    > jQuery
    > datatables.js
    > oClass.js
	edit in 2016.06.13
	edit by hl
*/
var TableRender = function(tab,tableId){
	/*  代表表格的变量  */
	this.tab = tab;
	/*  表格的id号  */
	this.tableId = tableId;
	/*  是否需要导出功能  */
	this.ifExport = true;	 //默认有导出功能
	/*  表格数据信息  */
	this.tableData = {
        legend: [],          //表头,一维数组
        tbData: [],          //数据,二维数组
        tbHeight: null,      //表格高度,需要动态计算,number类型
        fixedColumns: 0,  //表格左边需要固定的列数,number类型
    };
	/*  表格渲染的配置信息  */
	this.tabInfo = {
        "bPaginate": false, //翻页功能
        "bLengthChange": false, //改变每页显示数据数量
        "bFilter": true, //过滤功能
        "bSort": true, //排序功能
        "bInfo": true,//页脚信息
        "bAutoWidth": false,//自动宽度,false后就可以根据具体的列设定宽度
        'bDestory':true,
        'data':[],
        // 'aoColumns':undefined,
        "sPaginationType": "full_numbers",//显示所有的翻页信息
        'oTableTools': {
            "sSwfPath": "/slprj_v2/common/csslib/copy_csv_xls.swf",
            "aButtons": [],
        },
        "sDom": 'if<"clear">Ttlrp',
        // "scrollX": false, 
        "oLanguage": {
          "sLengthMenu": "每页显示 _MENU_条记录",
          "sZeroRecords": "没有找到符合条件的数据",
          //"sProcessing": "加载中…",
          "sProcessing": "&lt;img src='./loading.gif' /&gt;",
          "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
          "sInfoEmpty": "没有记录",
          "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
          "sSearch": "搜索：",
          "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "前一页",
            "sNext": "后一页",
            "sLast": "尾页"
          },
        },
         "fixedColumns": {
            leftColumns: 0,
        },

        "scrollX":true,
        "scrollY": 0,
        "scrollCollapse": true,
        "paging": false,
        "bStateSave": true,
        "fnDrawCallback": function(oSettings){},
        // function(oSettings) {
        //    comFunc.tableData.fnDrawCallback();
        // }
    };
    this.callback = null;
};

TableRender.prototype = {
    constructor: TableRender,

    //将一维数组转换为dataTables的表头
  	arrTocolumns: function (arr){
      	var columns=[];
      	for (var i = 0,len = arr.length; i < len; i++){
      	  var field = new _FieldsObj(arr[i]);
      	  columns.push(field);
      	}

      	function _FieldsObj(field){
    	  	this.title=field;
    	}
      	return columns;
    },

    refresh: function (){
      	if(typeof this.tab != "undefined"){
      	    this.tab.fnClearTable(false);
      	    this.tab.fnDestroy();
      	    $('#'+this.tableId).children('thead').empty();
      	}
        $('#'+this.tableId).empty();
        if(this.ifExport==true){
          this.tabInfo.oTableTools.aButtons=[
                {
                  "sExtends":    "csv",
                  "sButtonText": "导出数据",
                  "sCharSet": "utf8",
                  "bBomInc": true,
                }
            ];
        }
        this.tabInfo.data = this.tableData.tbData;
        if(this.tableData.legend != undefined){
            this.tabInfo.aoColumns = this.arrTocolumns(this.tableData.legend);
        }       
        if (this.tableData.tbHeight != undefined) {
            this.tabInfo.scrollY = this.tableData.tbHeight;          
        } else {
            this.tabInfo.scrollY = null;
        }
        if (this.tableData.fixedColumns != undefined) {
            this.tabInfo.fixedColumns.leftColumns = this.tableData.fixedColumns;          
        };
        if (this.callback) {
        	var that = this;
      	    this.tabInfo.fnDrawCallback = function(oSettings){
            that.callback();
          }          
        };
      	return $('#'+this.tableId).dataTable(this.tabInfo);
    },
}

window.oClass.TableRender = TableRender;
})();