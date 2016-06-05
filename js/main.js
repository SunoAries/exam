var $ = function (id) {
        return document.getElementById(id);
}
//兼容的写法。弄完再改吧，兼容性再去了解一下。需要做兼容的。css，dom方法，html还没有。
function getElementsByClassName(root, className) {
  // 特性侦测
  if (root.getElementsByClassName) {
    // 优先使用 W3C 规范接口
    return root.getElementsByClassName(className);
  } else {
    // 获取所有后代节点
    var elements = root.getElementsByTagName('*');
    var result = [];
    var element = null;
    var classNameStr = null;
    var flag = null;

    className = className.split(' ');

    // 选择包含 class 的元素
    for (var i = 0, element; element = elements[i]; i++) {
      classNameStr = ' ' + element.getAttribute('class') + ' ';
      flag = true;
      for (var j = 0, name; name = className[j]; j++) {
        if (classNameStr.indexOf(' ' + name + ' ') === -1) {
          flag = false;
          break;
        }
      }
      if (flag) {
        result.push(element);
      }
    }
    return result;
  }
}
//设置cookie
function setCookie(name,value,expires,path,domain,secure) {
    var cookie = encodeURIComponent(name)+'='+encodeURIComponent(value);
    if (expires) {cookie+='; expires='+expires.toGMTString();}
    if (path) {cookie+='; path='+path;}
    if (domain) {cookie+='; domain='+domain;}
    if (secure) {cookie+='; secure='+secure;}
    document.cookie=cookie;
}
//查询cookie
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') {return cookie;}
    var list = all.split('; ');
    for (var i = 0,len=list.length; i < len; i++) {
        var item = list[i];
        var p=item.indexOf('=');
        var name = item.substring(0,p);
        var value = item.substring(p+1);
        name = decodeURIComponent(name);
        value =decodeURIComponent(value);
        cookie[name]=value;
    }
    return cookie;
}
//删除cookie
function removeCookie(name,path,domain) {

   setCookie(name,'',new Date(0),path,domain);
}
//参数序列化
function serialize (data) { 
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
 //ajax get 
function get(url,options,callback){  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert("request failed : " + xhr.status);
            }
        }
    };
    xhr.open("get",url + "?" + serialize(options),true);
    xhr.send(null);
}
function noteCookie() {
    var noteCookie = getCookie();
        var n = $('clno');
     var m =getElementsByClassName(document,'m-noteInfo')[0]  ;

    if (noteCookie.as) {
    console.log("get in cookie check function");
    console.log(noteCookie.as);
        m.style.display='none';
        return;
    }

    n.addEventListener('click',function() {
        setCookie('as','true');    
        m.style.display='none';
        return;  
    });
}
//点击 关注 按钮的事件，弹出登录框，但是想登录框的处理事件分开。再注册一个登录框事件。
function followed(){
    var fo = $('follow');
    var fd = $('foed');
    var cancel=$('cancel');
    fo.style.display='none';
    fd.style.display='inline';
    cancel.onclick=function(){
    fo.style.display='inline';
    fd.style.display='none'; 
    removeCookie('loginSuc');
    }
}
function login() {
//ajax请求应该分开吗？哪一部分需要分开？虽然这次都是get，参数只需要添加进url就可以。
//dom方面的关闭登录框业应该抽象出来。 先做出来
    var loginForm = document.forms[0];// body...

    var url = 'http://study.163.com/webDev/login.htm';
    var fo = $('follow');
    var login = getElementsByClassName(document,'m-login')[0];
    var closebtn = $('cllg')
    fo.onclick=function() {
        var cookie=getCookie();
        if (cookie.loginSuc) {followed();}else{
            login.style.display = 'block'; 
        }
    }
    closebtn.onclick = function() {
        login.style.display = 'none';
    }
    $('loginBtn').onclick=function() {
        var name = loginForm.username.value;
        var password = loginForm.password.value;
        var name_md5 = md5(name);
        var password_md5 = md5(password);
           get(url,{userName:name_md5,password:password_md5},function(x){
            if (x==1) {
                login.style.display = 'none'; 
                followed();
                setCookie('loginSuc','true');
            }else{
                $('tip').style.display='block'
            }
    }); 
    }
}

//轮播图 
function slides(){
        var imgwrap = $('imgwrap');
        var imgs = imgwrap.children;
        var navswrap = $('navswrap');
        var navs = navswrap.children;
        var SPEED = 500;//图片切换速度
        var STEP = 50;//图片切换步长
        var NUMBER = 3;//图片数量
        var DURATION = 5000;//单张图片停留时间
        var PREV = 0;//上一张图片索引
        var CURRENT = 0;//当前图片索引
        var NEXT = CURRENT + 1;//下一张图片的索引
        var opa = 0.5;
        navs[0].style.background='black';
        function autoSlide() {
             PREV=CURRENT;
             CURRENT=NEXT;
             NEXT=(NEXT+1)%NUMBER;
             imgs[PREV].style.display='none'
             imgs[CURRENT].style.display='block';
             navs[PREV].style.background='white';
             navs[NEXT].style.background='white';
             navs[CURRENT].style.background='black';
            var ival=setInterval(function () {
                imgs[CURRENT].style.opacity=opa;
                opa += 0.05; 
            if (imgs[CURRENT].style.opacity>1) 
                    {
                        clearInterval(ival);
                        opa=0.5;
                    }
            },STEP);
        }
        var ival2=setInterval(autoSlide,DURATION) ;
        navswrap.onclick= (function () {
            var getElement = function (eve, filter) {
                var element = eve.target;
                while (element) {
                    if (filter(element))
                        return element;
                    element = element.parentNode;
                }
            }
            return function (event) {               
                var des = getElement(event, function (ele) {
                    return (ele.className.indexOf('navwrap') !== -1);
                })
                var index = parseInt(des.dataset.index);
                NEXT = index;
                autoSlide();
            }
        })();
        //类似于jQuery中hover事件。
        imgwrap.addEventListener('mouseenter', (function () {
            clearInterval(ival2);
        }));
        imgwrap.addEventListener('mouseleave', (function () {
            ival2=setInterval(autoSlide,DURATION) ;
        }));
}
//视频播放弹窗
function video() {
    var cVideo=$('cVideo'); 
    var clV = $('clv');
    var CV = getElementsByClassName(document,'m-playing')[0];
    cVideo.onclick=function() {
        CV.style.display='block';
    };
    clV.onclick=function() {
        CV.style.display='none';
    };
}
//热门课程排行
function hotRank() {
   get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
    var arr=JSON.parse(data);
    var oListwrap =getElementsByClassName(document,'lRank')[0];
    for (var i = 0; i < 20; i++) {
      var oA =document.createElement('a'); 
       oA.innerHTML= '<div class="rankItem"><img src="' + arr[i].smallPhotoUrl + ' "width="50px" height="50px" ><div class="rankDetail"><div class="detailtt">' + arr[i].name + '</div><span class="rankHot">' + arr[i].learnerCount +'</span></div>';
       oListwrap.appendChild(oA);
    }
 }) 
}
function change(){  //热门列表滚动
  var oListwrap = getElementsByClassName(document,'lRank')[0];
    var oListbox = getElementsByClassName(document,'hotrank')[0];
    var timer;
        function autoplay(){
        timer = setInterval(function(){
            // console.log(window.getComputedStyle(oListwrap).top);
            if( oListwrap.style.top == '-700px'){
                oListwrap.style.top = 0;
            }
            else{
                oListwrap.style.top = parseFloat(window.getComputedStyle(oListwrap).top)- 70 + 'px';
                }
        },5000);
        }
        autoplay();
    oListbox.onmouseover = function(){
        clearInterval( timer );
        };
    oListbox.onmouseout = function(){
        autoplay();
        };
}
//课程列表
function tab() {
    var aTabhd = getElementsByClassName(document,'tab');
    var aTabbtn = getElementsByClassName(document,'btn');
    var aContent = getElementsByClassName(document,'brief');
    var aDesign = getElementsByClassName(document,'design');
    var aLanguage = getElementsByClassName(document,'language'); 
    // 点击触发事件嘛，获得当前页码index，再调用当前函数。问题在于页码不止5个。dom的呈现。干脆不实现多个页码。
    var pager = getElementsByClassName(document,'page')[0];
    // var pc=pager.children;
    var currentPage = 1;
    var currentTab = 10;
    var currentDiv = aDesign[0];

    //获取服务器数据
    function getData(pageIndex,num,element){
       get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pageIndex,psize:20,type:num},function(data){   //设置课程
        var data = JSON.parse(data);
        for( var i=0; i<data.list.length; i++){
            var oTeam = document.createElement('div');
            oTeam.className = 'card' ;
            element.appendChild(oTeam);
            var oImg = document.createElement('img');
            var oH3 = document.createElement('h3');
            var oDiv = document.createElement('div');
            var oSpan = document.createElement('span');
            // var oI=document.createElement('i');
            var oStrong = document.createElement('strong');
            var oA = document.createElement('div');
            oImg.src = data.list[i].middlePhotoUrl;
            oH3.innerHTML = data.list[i].name;
            oDiv.innerHTML = data.list[i].provider;
            // oSpan.appendChild(oI);
            oSpan.innerHTML = '<i></i> '+data.list[i].learnerCount;
            if(!data.list[i].categoryName){
                  data.list[i].categoryName = '无';
            }
            oA.className='cardDetail';
            oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><div class="courseDetail"><h3>' + data.list[i].name + '</h3><span><i></i>' + data.list[i].learnerCount + '人在学</span><p>发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p></div><div class="description">' +  data.list[i].description + '</div>';
            if( data.list[i].price == 0){
                oStrong.innerHTML = '免费';
            }else{
            oStrong.innerHTML = '￥' + data.list[i].price;
            }
            oTeam.appendChild(oImg);
            oTeam.appendChild(oH3);
            oTeam.appendChild(oDiv);
            oTeam.appendChild(oSpan);
            oTeam.appendChild(oStrong);
            oTeam.appendChild(oA);           
        }
    });
    }
    getData(1,10,aDesign[0]);
    getData(1,20,aLanguage[0]);  
    pager.onclick = (function() {

        var getElement = function(eve,filter) {
            var element = eve.target;
            while(element){
                if(filter(element))return element;
                element = element.parentNode;
            }
        };
        return function(event){
            pager.children[currentPage].className='page-'+currentPage;
            var des= getElement(event,function(ele) {
                return (ele.className.indexOf('page')!== -1);
            })
            if (/prev/.test(des.className)) {currentPage = currentPage-1?currentPage-1:1;}
                else if (/next/.test(des.className)) {currentPage+=1;}
                    else{ currentPage=parseInt(des.className);}
                    // alert(currentPage);
                    while (currentDiv.firstChild) {//移除所有card，翻页器跟着小姨子跑了卧槽。还得撑开才行。
                        currentDiv.removeChild(currentDiv.firstChild);
                    }
                    getData(currentPage,currentTab,currentDiv);
                    pager.children[currentPage].className='page-'+currentPage+' active' ;          
    }
    })(); 
    aTabbtn[0].onclick = function(){
        aDesign[0].style.display = 'block';
        this.className = 'btn active';
        aLanguage[0].style.display = 'none';
        aTabbtn[1].className = 'btn'; 
        currentTab = 10;
        currentDiv = aDesign[0];

    };
    aTabbtn[1].onclick = function(){
        aDesign[0].style.display = 'none';
        aTabbtn[0].className = 'btn';
        aLanguage[0].style.display = 'block';
        this.className = 'btn active';
        currentTab = 20;
        currentDiv = aLanguage[0];

    };
}
// 有什么思路，点击触发事件嘛，获得当前页码index，再调用当前函数。问题在于页码不止5个。dom的呈现。干脆不实现多个页码。
    //与DOM相关的操作要在页面加载完全之后执行
window.onload = function () {
        video();
        noteCookie();//通知条显示初始化
        login();
        hotRank();
        change();
        slides();//轮播图实现与事件
        tab();   
}//onload done