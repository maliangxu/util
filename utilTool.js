/**
 * 通用方法封装  
 */

var utilTool={
	/*
	*version:property//       描述版本信息属性
	
	*getEleStyle:function//   得到DOM对象的样式
	*delPx:function//         去除‘px’
	*number2fixed:function//  将数字保存指定的小数位数
	*mixin:function//         得到一个对象里的方法
	*showTipWin:function//    操作完成后显示提示信息
	*show:function//          显示模块
	*hide:function//          隐藏模块
	*showRecords:function//   将数据显示在表格中
	*insertAfter:function//   inserAfter实现，DOM中未提供
	*bindContext:function//   改变函数的执行环境

	字符串相关方法
	*trim:function//          去除空格
	*ltrim:function//         删除左边的空格
	*rtrim:function//         删除右边的空格

	数组相关方法
	*indexInArr         //    返回元素在数组中位置
	*uniqueArray        //    去除数组中重复的元素
	*isAbosoluteSame    //    判断两个数组是否相同(严格意义的相同:元素、顺序都相同)
	*notAbosoluteSame   //    判断两个数组是否相同(元素相同但顺序可以不同)
	*getMaxInArr        //    找出数组中的数值最大值
	*arrPushToarr       //    把一个数组push到另一个数组
	*copyArray          //    复制数组
	*isElementInarr     //    判断元素是否在数组中
	*isArray            //    判断是否为数组
	*sortByIndex        //    插入排序
	*arrRemoveEle       //    根据元素的值从数组中移除元素
	*setArrNull         //    将数组arr中的所有null都置为空，arr可以为一或多维数组
	*setJsonNull        //    将JSON数组中所有的值为null的全部置为空，msg为JSON数组

	对象相关方法
	*extend             //    扩展对象属性
	*cloneObj           //    对象复制(含数组\JSON数据）/对象深拷贝
	*isEmptyObject      //    对象是否为空
	
	cookie
	*setCookie          //    设置cookie
	*delCookie          //    删除cookie
	*getCookie          //    获取单个cookie的值

	
	*ajax               //    Ajax请求
	*getQueryParam      //    根据url地址解析参数
	*uploadAcesy        //    上传附件
	*download           //    下载附件


	*/




	/*
	*@time 2016-01-20
	*@author jiangting
	*/
	version: 1.0,

	/*
	*@description 得到DOM对象的样式
	*@param {Object} obj DOM对象
	*@param {String} attr 要得到的属性
	*@return {String} style 样式信息
	*/
	getEleStyle: function (obj,attr) {
		var style = obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj,null)[attr];
		return style;
	},
	/*
	*@description 去除‘px’
	*@param {String} value 字符串
	*@return {String} 字符串去除最后两个字符
	*/
	delPx: function (value) {
		if(value=='') return '';
		return value.substr(0,value.length-2);
	},
	/**
	 * 将数字保存指定的小数位数
	 * @param  {[type]} n 数字
	 * @param num 小数点个数
	 */
	number2fixed: function (n,num) { 
		var r = n;
		r = parseFloat(n); 
		if(typeof r=='number'){
			if(isNaN(r)){ return n;}
			r = (num!=undefined) ? r.toFixed(num) : r.toFixed(4);
			return r;
		}else{
			return n;
		}
	},

	/*
	*@description 得到一个对象里的方法
	*@param {Array||Object} dests 需要得到方法的对象或对象数组
	*@param {Object} src 提供方法的对象
	*@param {Array} methods 【可选】 需要得到的方法，默认为全部
	*/
    mixin: function(dests,src,methods) {
        if(!dests instanceof Array)  dests = [dests];
        for (var i = 0; i < dests.length; i++) {
            var dest = dests[i];
            if(methods){
                if( typeof (methods) === 'string' )   methods = [methods] ;
                for (var j = 0; j < methods.length; j++) {
                    var method = methods[j];
                    if(method && !dest[method]){
                        dest[method] = src[method];
                    }
                };
                continue;
            }
            for (var prop in src) {
                if (!dest[prop]) {
                    dest[prop] = src[prop];
                }
            }
        };
    },
	/*
	*@description 获取按键的值
	*@param {Object} evt DOM对象
	*@return {String} keyCode 按键的值
	*/
	getKeyCode: function (evt) {
		var keyCode = evt.keyCode ? evt.keyCode  : evt.which ? evt.which : evt.charCode;
	    return keyCode;
	},
	/*
	*@description 操作完成后显示提示信息
	*@param {String} tipmsg 提示内容
	*@return null
	*/
	showTipWin: function (tipmsg) {
		var tmpdoc=document;
	 	var div=tmpdoc.createElement('div');
	 	div.id="tipWinID";
	 	tmpdoc.body.appendChild(div);
	    $('#tipWinID').html(tipmsg);
	    $('#tipWinID').css({
	      	'position':'none',
	      	'position':'absolute',
	      	'left':'0px',
	      	'top':'-50px',
	      	'right':'0px',
	      	'bottom':'0px',
	      	'margin':'auto auto',
	      	'width':'250px',
	      	'height':'40px',
	      	'border-radius':'20px',
	      	'background-color':'#757575',
	      	'text-align':'center',
	      	'line-height':'40px',
	      	'font-size':'14px',
	      	'font-weight':'normal',
	      	'color':'#fff',
	      	'z-index':'20002'
	    });
	    $('#tipWinID').fadeIn(200).delay(900).fadeOut();
	    setTimeout(function(){
	    	tmpdoc.body.removeChild(div);
	    },1100);  	    
	},

	show: function (modid) {
		var popwins = document.getElementById(modid).parentNode.childNodes;
		for(var i=0,len=popwins.length;i<len;i++){
			if(popwins[i].nodeType==1){
			popwins[i].style.display='none';
			}
		}
		document.getElementById(modid).style.display='block';
		document.getElementById(modid).parentNode.style.display='block';
	},
	hide: function (modid) {  
		document.getElementById(modid).style.display='none';
		document.getElementById(modid).parentNode.style.display='none';
	},
	/*
	*@description 将数据显示在表格中
	*@param {Array} records 数据
	*@param {String} tbodyId tbody的Id	
	*/
	showRecords: function(records,tbodyId) {
		var tbody = document.getElementById(tbodyId);
		var otr = document.createElement('tr');
		var otd = document.createElement('td');
		var ospan = document.createElement('span');
		var ofrag = document.createDocumentFragment();
		while(tbody.firstChild){
			tbody.removeChild(tbody.firstChild);
		}
		for(var i=0,len=records.length;i<len;i++){
			var rec = records[i];
			var tmptr = otr.cloneNode();

			var td1 = otd.cloneNode();
			var td2 = otd.cloneNode();
			var td3 = otd.cloneNode();
			var td4 = otd.cloneNode(); 

			var name = '名字';
			td2.textContent = name;
			td2.setAttribute('size',name.length);
			td2.className = 'nameTd';

			tmptr.appendChild(td1);
			tmptr.appendChild(td2);
			tmptr.appendChild(td3);
			tmptr.appendChild(td4);
			ofrag.appendChild(tmptr);
		}
		tbody.appendChild(ofrag);
	},
	/*
	*@description  inserAfter实现，DOM中未提供
	*@param {Object} newElement 待插入的DOM
	*@param {Object} targetElement 目标DOM	
	*/
	insertAfter: function(newElement,targetElement) {
		var parent = targetElement.parentNode;  
		if(parent.lastChild == targetElement){  
		    parent.appendChild(newElement);  
	  	}else  {  
	  	  	parent.insertBefore(newElement,targetElement.nextSibling);  
	  	} 
	},



    /**
     * description   改变函数的执行环境
     * @param  {[type]} fun    函数
     * @param  {[type]} context 上下文环境
     * @return {[type]}        
     */
    bindContext: function (context,fun,params) {
      	if(typeof fun=='function'){
      	  	fun.call(context,params);
      	}
    },



	/*
	*@description 去除空格
	*@param {String} str 字符串
	*@param {String} is_global 去除字符串中所有空格(包括中间空格) 
	*@return {String} 字符串去除空格
	*/
	trim: function (str,is_global) {
		if(str=='') return '';
		var result = str.replace(/(^\s+)|(\s+$)/g,""); 
		if(is_global){
		  if(is_global.toLowerCase()=="g") 
		  result = result.replace(/\s/g,""); 
		}
		return result; 
	},
	/*
	*@description 删除左边的空格
	*@param {String} str 字符串
	*@return {String} 字符串去除空格
	*/
	ltrim:function (str){ 
	　 return str.replace(/^[\s\xA0]+/g,"");
	},
	/*
	*@description 删除右边的空格
	*@param {String} str 字符串
	*@return {String} 字符串去除空格
	*/
	rtrim:function (str){ 
	　　return str.replace(/[\s\xA0]+$/g,"");
	},



    /**
     * description  返回元素在数组中位置
     * @param  {String} ele  元素
     * @param  {Array} arr  数组
     * @return {Number} i    位置
     */
    indexInArr: function (ele,arr) {    
      	for(var i=0,len=arr.length;i<len;i++){
      	  	if(arr[i]==ele){
      	  	  	return i;
      	  	}
      	}
      	return -1;
    },
    /**
     * description  去除数组中重复的元素
     * @param  {Array} arr  数组
     * @return {Array} arrtmp    
     */
	uniqueArray:function(arr){
		arr = arr || [];
		var a = {};
		for(var i =0, len = arr.length; i < len; i++){
			var key = arr[i];
			if(typeof(a[key]) == 'undefined'){
				a[key] = 1;
			}
		}

		//一下可以分两种一个是直接改变原数组，另一种是不改变原数组
		//改变原数组
		/*arr.length = 0;
		for(var key1 in a){
			arr[arr.length] = key1;
		}
		return arr;*/

		//不改变原数组，返回新数组
		var arrtmp = [];
		var num = 0;
		for(var key1 in a){
			arrtmp[num] = key1;
			num++;
		}

		return arrtmp;
	},
    /**
     * description  判断两个数组是否相同(严格意义的相同:元素、顺序都相同)
     * @param  {Array} arr  数组
     * @param  {Array} arr  数组
     * @return {Boolean} ifsame   
     */
	isAbosoluteSame:function (arr1,arr2){
		var ifsame = true;
		if(arr1.length == arr2.length){
			for(var i =0,len = arr1.length; i < len; i++){
				if(arr1[i] != arr2[i]){
					ifsame = false;
					break;
				}
			}
		}else{
			ifsame = false;
		}
		return ifsame;
	},
	
	isAbosoluteSame2:function (arr1,arr2){
		var ifsame = false;
		if(arr1.toString() == arr2.toString()){
			ifsame = true;
		}
		return ifsame;
	},
	/*
	*不严格的数组相同
	*@param {array} arr1 arr2  比较是否相等的两个数组
	*/
	notAbosoluteSame:function (arr1,arr2){
		var ifsame = false;
		var len1 = arr1.length,len2 = arr2.length;
		if(len1 == len2){
			var tmp = [];
			for(var i = 0; i < len1; i++){
				for(var j = 0; j < len2; j++){
					if(arr1[i] == arr2[j]){
						tmp.push(1);
					}
				}
			}
			if(tmp.length == len1){
				ifsame = true;
			}else{
				ifsame = false;
			}
		}else{
			ifsame = false;
		}
		return ifsame;
	},
    /**
     * description  找出数组中的数值最大值
     * @param  {Array} arr  数组
     * @return {String} i    位置
     */
	getMaxInArr:function (arr){
		return Math.max.apply(null,arr);//apply的精辟利用
	},
    /**
     * description  把一个数组push到另一个数组,可以避免for循环
     * @param  {Array} arr  数组
     * @param  {Array} arr  数组
     * @return {Array} arr  新数组
     */
	arrPushToarr:function (arr1, arr2){
		Array.prototype.push.apply(arr1, arr2);
		return arr1;
	},
    /**
     * description  复制数组
     * @param  {Array} arr  数组
     * @return {Array} arr  新数组
     */	
	copyArray:function (arr){
		return arr.slice(0);
	},
    /**
     * description  判断元素是否在数组中
     * @param  {String} ele  元素
     * @param  {Array} arr  数组
     * @return {Boolean}
     */
	isElementInarr: function (ele,arr){
		for(var i = 0, len = arr.length; i < len; i++){
			if(arr[i] === ele){
				return true;
			}
		}
		return false;
	},	
    /**
     * description  判断是否为数组
     * @param  {Array} arr  数组
     * @return {Boolean}
     */
	isArray:function (arr){
		return Object.prototype.toString.call(arr) === '[object Array]';
	},
    /**
     * description   插入排序
     * @param  {Array} data   待排序数组
     * @param  {String} field 按照该字段排序
     * @return {Array}  由小到大的数组      
     */
	sortByIndex: function (data,field) {
		var arr = data;
		var len = data.length;
		var inner,temp;
		for(var outer=1;outer<len;outer++){
			temp=arr[outer];
			inner=outer;
			var zindex = arr[outer][field];
			while(inner>0 && arr[inner-1][field]>zindex){
				arr[inner]=arr[inner-1];
				inner--;
			}
			arr[inner]=temp;
	    }
		return arr;
	},

	/*
 	* 根据元素的值从数组中移除元素
 	* @returns {boolean}
 	*/
	arrRemoveEle: function (arr,b){	
	  	var loc = arr.indexOf(b);
	 	if (loc >= 0) {
	 	  	arr.splice(loc, 1); 
	 	} 
	 	return arr;
	},
  
	//将数组arr中的所有null都置为空，arr可以为一或多维数组
	setArrNull: function (arr) {
  		for(var i=0,len=arr.length; i<len; i++){
  			if(!this.isArray(arr[i])){
          		if(arr[i] == 'null'){
          		  arr[i] = '';
          		}
  			}
  			else{
          		this.setArrNull(arr[i]);
        	}
  		}
  		return arr;
  	},

  	//将JSON数组中所有的值为null的全部置为空，msg为JSON数组
  	setJsonNull: function (msg) {
  		for(var i=0,len=msg.length; i<len; i++){
  			for(key in msg[i]){
  				if(msg[i][key] == 'null'){
  					msg[i][key] = '';
  				}
  			}
  		}  		
  		return msg;
  	},








   	/*
   	* description  扩展对象属性
    * @param  {String} destination   需要扩展的对象
    * @param  {String} source        
	*/
	extend:function(destination,source){
	    for(var p in source)
	    {
	        if(this.getType(source[p])=="array"||this.getType(source[p])=="object")
	        {
	            destination[p]=gEcnu.Util.getType(source[p])=="array"?[]:{};
	            arguments.callee(destination[p],source[p]);
	        }
	        else
	        {
	            destination[p]=source[p];
	        }
	    }
	},
	getType:function(o){
	    var _t;
	    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
	},



	/**
	 * 对象复制(含数组\JSON数据）/对象深拷贝
	 * @param obj
	 * @returns {{}}
	 */
	cloneObj : function (obj) {
		var newobj, s;
		if (typeof obj !== 'object') {
			return;
		}
		newobj = obj.constructor === Object ? {} : [];
		if (window.JSON) {
			s = JSON.stringify(obj), //序列化对象
			newobj = JSON.parse(s);
			//反序列化（还原）
		} else {
			if (newobj.constructor === Array) {
				newobj.concat(obj);
			} else {
				for (var i in obj) {
					newobj[i] = obj[i];
				}
			}
		}
		return newobj;
	},

	/**
	 * 对象是否为空
	 * @param obj
	 * @returns {{}}
	 */
	isEmptyObject: function(e){
		var t;
		for (t in e)
			return !1;
		return !0
	},












   	/*
   	* description  设置cookie
    * @param  {String} name    cookie的key名
    * @param  {String} value   cookie的值
    * @param  {Number} days    过期时间（天数）  
	*/
   	setCookie:function (name,value,days){
   		this.delCookie(name);
   		days = days || 10;
   		var date = new Date();
   		date.setTime(date.getTime() + days*24*3600*1000);
   		document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString();
   	},
   	/*
   	* description  删除cookie
    * @param  {String} name    cookie的key名
	*/  	
   	delCookie:function (name){
   		//var date = new Date();
   		//date.setTime(date.getTime() - 10);
   		//var val =  this.getCookie(name);
   		//if(val == ""){
   			//return;
   		//}else{	
   			document.cookie = name + "= ;expires=" + new Date(0);
   		//}
   	},
   	/*
   	* description  获取单个cookie的值
    * @param  {String} name    cookie的key名
	*/  	
   	getCookie:function (name){
	   	var tmp = document.cookie.split(";");
	   	for(var i = 0, l = tmp.length; i < l; i++){
	   		var arr = tmp[i].split("=");
	   		if(arr[0] == name){
	   			if(arr.length>1)
	   			return unescape(arr[1]);
	   		}else{
	   			return ""
	   		}
	   	}
	   	return "";
   	},


	/**
	 * description  Ajax请求
	 * @param method
	 * @param url
	 * @param data
	 * @param async
	 * @param callback
	 *otherParams主要为了给callback函数
	 */
	ajax : function (method, url, data, async, callback,timoutFunc,timeout,otherParams) {
		var timer_out;//设置超时id
		var parames_len=arguments.length;
		if(arguments.length==7||arguments.length==8){
			//创建计时器
			timer_out=setTimeout(function(){
				if (xdr){  
	                xdr.abort(); 
	            }else if(xhr){
	            	//alert(typeof xhr);
	            	alert(xhr);
	            	xhr.abort(); 
	            }
				timoutFunc();
			},timeout);  
		}
		var xhr = null;
		var xdr = null;
		if (data instanceof Object) {  
			var str = "";
			for (k in data) { 
				str += k + "=" + encodeURIComponent(data[k]) + "&";
				//str += k + "=" + escape(data[k]) + "&";
			}
			data = str;   
		}
		if (window.XDomainRequest) {
			xdr = new XDomainRequest();
			if (xdr) {
				xdr.onerror = showerr;
				xdr.onload = function () {
					if (timer_out){  
	                   clearTimeout(timer_out);  
	                }
	                if(arguments.length==8){
	                    callback(xdr.responseText,otherParams);
	                }else{
	                	callback(xdr.responseText);
	                }
					
				};
				if ("get" == method.toLowerCase()) {
					if (data == null || data == "") {
						xdr.open("get", url);
					} else {
						xdr.open("get", url + "?" + data);
					}
					xdr.send();
				} else if ("post" == method.toLowerCase()) {
					xdr.open("post", url);
					xdr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
					xdr.send(data);
				}
			}
		} else {
			if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
	
			xhr.onreadystatechange = function (e) {
				if (4 == xhr.readyState) {
					if (200 == xhr.status) { 
						if (callback) {
							if (timer_out){
	                           clearTimeout(timer_out);  
	                        }
	                        if(parames_len==8){
	                            callback(xhr.responseText,otherParams);
	                        }else{
	                        	callback(xhr.responseText);
	                        }
						}
					} else if (404 == xhr.status) {
						if (hander404) {
							hander404();
						}
					} else if (500 == xhr.status) {
						if (hander500) {
							hander500();
						}
					}
				}
			}
	
			if ("get" == method.toLowerCase()) {
				if (data == null || data == "") {
					xhr.open("get", url, async);
				} else {
					xhr.open("get", url + "?" + data, async);
				}
				xhr.send(null);
			} else if ("post" == method.toLowerCase()) {
				xhr.open("post", url, async);
				xhr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
				xhr.send(data);
			}
		}
		function handler404() {
			alert("ReqUrl：not found");
		}
	
		function handler500() {
			alert("服务器错误，请稍后再试");
		}
	
		function showerr(e){
	
		}
	},
	/*
    *根据url地址解析参数
    *name 参数名
    */
    getQueryParam: function(name){
	   	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	   	var url=window.location.search;
	   	var r = url.substr(1).match(reg); 
	   	if (r != null) return unescape(r[2]); return null; 
	},
    //上传附件
    uploadAcesy:function(id,showid){
        var files = $('#'+id).prop('files'); //附件  var files = document.getElementById(filesId).files; 
        var len=files.length;
        if(len > 0){
          var content = '';
          for (var i = 0; i < len; i++) {
              var name = files[i].name.substring(0,20)+'…:';
              content += name;
          };
          $('#'+showid).html(content+'共'+len+'个文件'); 
        }else{
          $('#'+showid).html('已选'+len+'个文件'); 
        }
    },

    // 下载附件
    download: function (path){
        if(!path || path == 'null') return;
        var req = gEcnu.config.geoserver+'acesy/'+path;
        try{
            var filePath = path.split(".");
            var type = filePath[filePath.length-1];
            if ( type == "png" || type == "jpg" || type == "js") {
                window.open(req);
            }else{
                var elemIF = document.createElement("iframe");   
                elemIF.src = req;   
                elemIF.style.display = "none";   
                document.body.appendChild(elemIF); 
            }
        }catch(e){ 
            this.showTipWin('下载附件出错!');
        }
    },







}

