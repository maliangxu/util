


//加载子模块：加载相应文件夹下的同名html、css
//传入override//callback
function loadModules(eleId,moduleName,override,callback){
	var htmlPath='modules/'+moduleName+"/"+moduleName+".html";
	var cssPath='modules/'+moduleName+"/"+moduleName+".css";
	//var jsPath='modules/'+moduleName+"/"+moduleName+".js";
	var bCover=arguments.length>2 ? arguments[2] :true;  //默认覆盖html
	// var callOrBool=arguments.length>2 ? arguments[2];
	loadFile(htmlPath,function (data){
		if(bCover){
			$("#"+eleId).html(data);  //覆盖
		}else{
			$("#"+eleId).append(data);  //追加
		}
		if(callback){
			callback();
		}
		
	});
	if(!isExisted('css',cssPath)){
		var link=document.createElement('link');
		link.rel='stylesheet';
		link.href=cssPath;
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	
}

/*  加载css  2015/01/08 hl  */
function loadCss (moduleName,cssName) {
  var cssPath='modules/'+moduleName+"/"+cssName+".css";
  if(!isExisted('css',cssPath)){
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href=cssPath;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
//请求相应的文件
function loadFile(requrl,callback){
	var succ=arguments.length>1 ? arguments[1] :function (){};
	$.ajax({
		type:'POST',
		url:requrl,
		async:true,   //同步加载
		success:function (data){
			succ(data);
		}
	});
}

//判断是否加载过js、css文件
function isExisted(type,src){
	var flag;
	switch(type){
		case "js":
		flag=isExistScript(src); 
		break;
		case "css":
		flag=isExistCss(src); 
		break;
	}
	return flag;
}
function isExistScript(src){ 
	var scripts=document.getElementsByTagName('script');
	if(scripts==undefined){ return false;}
    for(var j=0,len=scripts.length;j<len;j++){ //注：返回的src含有域名  绝对路径
    	var tmpSrc=node.hasAttribute ? // non-IE6/7
      		node.src :node.getAttribute("src", 4); // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
      
    	var flag=matchStr(src,tmpSrc); 
    	if(flag){
    		return true;
    	}

    }
    return false;
}
function isExistCss(url){
	var links=document.getElementsByTagName('link');
	for(var i=0,len=links.length;i<len;i++){
		var source=links[i].href;
		var flag=matchStr(url,source);
		if(flag){
			return true;
		}
	}
	return false;
}
//字符串匹配：targetStr待匹配字符串   
function matchStr(targetStr,totalStr){
	var reg=new RegExp(targetStr,'gi');
      if(reg.test(totalStr)){
        return true;
      }else{
      	return false;
      }
}


