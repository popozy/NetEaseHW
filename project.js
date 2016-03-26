/* 
@Copyright 2015 Jiapeng Liu. All right reserved
Date: 2015/12/1
*/
// global parameters
var demo = document.getElementById('pic');
var cir = document.getElementsByClassName('circle');
var top_cor = 0;
var intervalID;
var bannerOrder = 0;

//轮播动画
var process = function(count){
  var step = function(){
  if(!count){
    cir[0].style.backgroundColor = '#fff';
    cir[1].style.backgroundColor = '#000';
    cir[2].style.backgroundColor = '#fff';
    count++;
    animition(demo, count);
  }
  else if(count == 1){
    cir[0].style.backgroundColor = '#fff';
    cir[1].style.backgroundColor = '#fff';
    cir[2].style.backgroundColor = '#000';
    count++;
    animition(demo,count);
  }
  else if(count == 2){
    cir[2].style.backgroundColor = '#fff';
    cir[1].style.backgroundColor = '#fff';
    cir[0].style.backgroundColor = '#000';
    count = 0;
    animition(demo, count);
    clearInterval(intervalID); 
    process(count);
  }
}

  intervalID = setInterval(step, 5000);
}

// function to impelement fadein and fadeout
var animition = function(ele, count){
  var duration = 5;
  var incre_time = 500/duration;
  var incre_step = 1/incre_time;
  var op = 0; //opacity
  var has_set = 0;
  var step = function(){
    if(!has_set){
      if(count == 1){
        //console.log('in animition count = 1');
        ele.style.backgroundImage = 'url(pic/body/banner2.jpg)';
      }
      else if(count == 2){
        ele.style.backgroundImage = 'url(pic/body/banner3.jpg)';
      }
      else if(count == 0){
        ele.style.backgroundImage = 'url(pic/body/banner1.jpg)';
      }
      has_set = 1;
    }
    if(op <= 1){
      ele.style.opacity = op;
      op += incre_step;
    }
    else{
      ele.style.opacity = 1;
      clearInterval(intervalID);
      return;
    }
  }
  var intervalID = setInterval(step, duration);
}

// show course info.
function show(x){
  var content = JSON.parse(x);
  var res = document.getElementById("content");
  //initialization
  var child = res.childNodes;
  for(var i = child.length-1; i >=0 ; i--)
    res.removeChild(child[i]);
    //fulfill the content
    for(var i = 0; i <= content.list.length-1; i++){
      var price = (content.list[i].price==0)?"免费":('￥'+content.list[i].price);
      var cateoryName = (content.list[i].cateoryName==null)?"无":content.list[i].cateoryName;
      res.innerHTML += '<div class = "unit">'+ 
                        '<img src ="'+content.list[i].middlePhotoUrl+'" class = "contentPic"">' +
                        '<p class = "name">'+content.list[i].name+'</p>'+
                        '<div class = "provider">'+content.list[i].provider+'</div>'+
                        '<div class = "learnerCount">'+content.list[i].learnerCount +'</div>'+
                        '<div class = "price">'+price+'</div>'+
                        '<a>'+
                          '<img src ="'+content.list[i].middlePhotoUrl+' "class = "contentPic-1"">' +
                          '<p class = "name-1">'+content.list[i].name+'</p>'+
                          '<div class = "learnerCount-1">'+content.list[i].learnerCount +"在学"+'</div>'+
                          '<div class = "provider-1">'+"发布者 ："+content.list[i].provider+'</div>'+
                          '<div class = "cateoryName">'+"分类 : " + cateoryName+'</div>'+
                          '<p class = "descri">'+content.list[i].description+'</p>'+
                        '</a>'+
                        '</div>';

    }
}

// show hot course in ranklist
function showrank(x){
  var content = JSON.parse(x);
  var res = document.getElementById("rank");
  //initialization
  var child = res.childNodes;
  for(var i = child.length-1; i >=0 ; i--)
    res.removeChild(child[i]);
    //fulfill the ranklist
    for(var i = 0; i <= content.length-1;i++){
      res.innerHTML += '<a>' +
                        '<div>' +
                            '<img src="'+content[i].smallPhotoUrl+'">' +
                        '</div>' +
                        '<p>'+content[i].name+'</p>' +
                        '<span>'+content[i].learnerCount+'</span>' +
                    '</a>';
    }
}

//课程显示
  var course = {pageNo:1, psize:20, type:10};
  get("http://study.163.com/webDev/couresByCategory.htm", course, show);  
  get("http://study.163.com/webDev/hotcouresByCategory.htm", null, showrank);

//参数序列化
function serialize(data){
  if(!data){
    return '';
  }
  var pairs = [];
  for(var name in data){
    if(!data.hasOwnProperty(name)){
      continue;
    }
    if(typeof data[name] ==="function"){
      continue;
    }
    var value = data[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name+'='+value);
  }
  return pairs.join('&');
}

// get data
function get(url,options,callback){
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  if (options!=null)
    url+="?"+serialize(options);
  xhr.open("GET",url,true);
  xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
          if((xhr.status >=200 && xhr.status <300) || xhr.status ==304){
            callback(xhr.responseText);
          }else{
            alert("请求错误："+xhr.status+" "+xhr.statusText);
          }
      }
  }
  xhr.send(null);
}

//rank轮播
var changSlide = function(){
  top_cor -= 70;
  document.getElementById("rank").style.top = String(top_cor)+'px';
  if(top_cor == -700) top_cor = 70;
}


//页面加载完成之后执行dom操作
window.onload = function(){
     document.getElementById("pic").addEventListener("click", function(event){
     	event = event || window.event;
     	var id = event.srcElement;
     	var name = id.style.backgroundImage;
     	console.log(name);
     	if(name == 'url("pic/body/banner1.jpg")'){
     		window.open("http://open.163.com/");
     	}
     	else if(name == 'url("pic/body/banner2.jpg")')
     		window.open("http://study.163.com/");
     	else if(name == 'url("pic/body/banner3.jpg")')
     		window.open("http://www.icourse163.org/");
     });

    // stop when hang on banner***
    document.getElementById("pic").addEventListener("mouseover",function(event){
        clearInterval(intervalID);
        event = event || window.event;
        var name = event.target;
        name.style.cursor = "pointer";
        if(name == 'url("pic/body/banner1.jpg")')
          bannerOrder = 1;
        else if(name == 'url("pic/body/banner2.jpg")')
          bannerOrder = 2;
        else if(name == 'url("pic/body/banner3.jpg")')
          bannerOrder = 0;
    });
    document.getElementById("pic").addEventListener("mouseout",function(event){
        process(bannerOrder);
    });
    // 选择不同导航
    document.getElementById("produ_desi").addEventListener("click", function(event){
      event = event || window.event;
      var tar = event.target;
      tar.style.backgroundColor = "#39a030";
      tar.style.color = "#fff";
      tar = document.getElementById("progra_lang");
      tar.style.backgroundColor = "#fff";
      tar.style.color = "#000";
      course.type = 10;
      get("http://study.163.com/webDev/couresByCategory.htm", course, show);
    });

    document.getElementById("progra_lang").addEventListener("click", function(event){
      event = event || window.event;
      var tar = event.target;
      tar.style.backgroundColor = "#39a030";
      tar.style.color = "#fff";
      tar = document.getElementById("produ_desi");
      tar.style.backgroundColor = "#fff";
      tar.style.color = "#000";
      course.type = 20;
      get("http://study.163.com/webDev/couresByCategory.htm", course, show);
    });

    //课程导航栏
    document.getElementById("produ_desi").addEventListener("mouseover", function(event){
        event = event ||window.event;
        var tar = event.target;
        tar.style.cursor = "pointer";
        tar.style.backgroundColor = "#39a030";
        tar.style.color = "#d6e8d5";
        tar = document.getElementById("progra_lang");
        tar.style.backgroundColor = "#ffffff";
        tar.style.color = "#000";
    });
     document.getElementById("progra_lang").addEventListener("mouseover", function(event){
        event = event ||window.event;
        var tar = event.target;
        tar.style.cursor = "pointer";
        tar.style.backgroundColor = "#39a030";
        tar.style.color = "#d6e8d5";
        tar = document.getElementById("produ_desi");
        tar.style.backgroundColor = "#ffffff";
        tar.style.color = "#000";
    });
    //  document.getElementById("progra_lang").addEventListener("mouseout", function(event){
    //     event = event ||window.event;
    //     var tar = event.target;
    //     tar.style.backgroundColor = "#ffffff";
    //     tar.style.color = "#000";
    //     // tar = document.getElementById("produ_desi");
    //     // tar.style.backgroundColor = "#39a030";
    //     // tar.style.color = "#d6e8d5";
      
    // });
    //  document.getElementById("progra_lang").addEventListener("mouseout", function(event){
    //     event = event ||window.event;
    //     var tar = event.target;
    //     tar.style.backgroundColor = "#ffffff";
    //     tar.style.color = "#000";
    //     // tar = document.getElementById("produ_desi");
    //     // tar.style.backgroundColor = "#39a030";
    //     // tar.style.color = "#d6e8d5";

    // });
    
    //弹窗关闭监视器 
     document.getElementById("close").addEventListener("click", function(event){
     	event = event || window.event;
     	var id = event.srcElement;
     	var par = id.parentNode;
     	par.style.display = 'none';
     });
     document.getElementById("closelog").addEventListener("click", function(event){
     	event = event || window.event;
     	var id = event.srcElement;
     	var par = id.parentNode.parentNode;
     	par.style.display = "none";
     });
     document.getElementById("close_video").addEventListener("click", function(event){
      event = event || window.event;
      var id = event.srcElement;
      var par = id.parentNode.parentNode;
      par.style.display = 'none';
     });

     document.getElementById("payatten").addEventListener("click",function(event){
     	event = event || window.event;
     	var login = document.getElementById("login");
     	login.style.display = "block";
     	console.log(login.style.display);
     });

     document.getElementById("video_trigger").addEventListener("click", function(event){
        document.getElementById("video_contai").style.display = "block";
     });

     process(bannerOrder);

     setInterval(changSlide, 5000);
     
}