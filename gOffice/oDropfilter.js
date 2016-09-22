;(function (){
/*	下拉框筛选列表	*/
var Dropfilter = function(containerId,checkedData,filterData){
	this.containerId = containerId;
	this.filterData = filterData;
	this.checkedData = checkedData || {};
	this.sqlfilter = "";
	this.clickEvt = function(){};
}
Dropfilter.prototype = {
	constructor: Dropfilter,

	init: function(func){

	},

	_exec: function(tpl){
		var that = this;
		var tb = juicer(tpl,this.filterData);
		$("#"+this.containerId).html(tb);
		that.checkItems(this.checkedData,this.containerId);
		this._bindEvt();
	},
	
	arrRemoveEle: function (arr,b){
		var a=arr.indexOf(b);
  	 	 	if (a >= 0) {
  	 	 	  	arr.splice(a, 1); 
  	 	 	  	return true; 
  	 	 	} 
  	 	return false;
	},	
	
	checkItems: function(checkedData,containerId){
		for(key in checkedData){
			$('#'+containerId).find('ul').each(function(){
				// var thatul = this;
				var ulval = $(this).attr('ulval');
				if(key == ulval){
					for(var i=0,len=checkedData[key].length; i<len; i++){
						$(this).find('label').each(function(){
							var label = $(this).text();
							if(label == checkedData[key][i]){
								$(this).prev().prop('checked',true);
							}
						})
					}
				}
			})
		}
	},

	getFilter: function(returndata){
        var filter = [];
        for(key in returndata){
            if(returndata[key].length>0){
                var tmp_filter = [];
                for(var i=returndata[key].length-1; i>=0; i--){
                    var f = key+"='"+returndata[key][i]+"'";
                    tmp_filter.push(f);
                }
                filter.push('('+tmp_filter.join(' or ')+')');
            }
        }
        return filter.join(' and ');
    },

	//给【全部】和【选择框】绑定事件
	_bindEvt: function(){
		var that = this;
		$('.dropdown-childList input').bind('change',function(){
			inputChange(this);
		});
		$(".dropdown-filter-checkall").bind('click',function(){
			if($(this).hasClass('checkall-checked')){
				$(this).next().find('input').prop('checked',false);
				$(this).removeClass('checkall-checked');
				checkAll(this,false);
			} else {
				$(this).next().find('input').prop('checked',true);
				$(this).addClass('checkall-checked');
				checkAll(this,true);
			}
		})

		//ifchecked为true表示全选，false时表示全不选
		function checkAll(ele,ifchecked){
			var field = $(ele).next().attr('ulval');
			if(!that.checkedData[field]){
				that.checkedData[field] = new Array();
			}
			that.checkedData[field] = [];
			if(ifchecked){//选中全部
				$(ele).next().find('label').each(function(){
					var val = $(this).text();
					that.checkedData[field].push(val);
				})
			}
			that.sqlfilter = that.getFilter(that.checkedData);
			sessionStorage.setItem('jsfilter',that.sqlfilter);
			sessionStorage.setItem('checkedData',JSON.stringify(that.checkedData));
			that.clickEvt();
			// console.log(that.sqlfilter);
		}

		function inputChange(ele){
			var field = $(ele).parent().parent().attr('ulval');
			var val = $(ele).next().text();
			if($(ele).prop('checked')){
				if(!that.checkedData[field]){
					that.checkedData[field] = new Array();
				}
				that.checkedData[field].push(val);
			} else {
				that.arrRemoveEle(that.checkedData[field],val);
			}
			that.sqlfilter = that.getFilter(that.checkedData);
			sessionStorage.setItem('jsfilter',that.sqlfilter);
			sessionStorage.setItem('checkedData',JSON.stringify(that.checkedData));
			that.clickEvt();
			// console.log(that.sqlfilter);
		}
	},
}
window.oClass.Dropfilter = Dropfilter;
})();
