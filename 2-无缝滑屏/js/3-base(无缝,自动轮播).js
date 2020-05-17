var ulNode=document.createElement('ul');
var styleNode=document.createElement('style');
var pointWrap=document.querySelector('.swiper-wrap >.point-wrap');

(function(){
  window.swiper={};

  // 移动端页面初始化的方法
  function init(wrapNode){
    // 使用rem+百分比布局
    var w=document.documentElement.clientWidth/16;
    var styleNode=document.createElement('style');
    styleNode.innerHTML='html{font-size:'+w+'px!important}';
    document.head.appendChild(styleNode);
    // 禁止移动端的默认行为
    wrapNode.addEventListener('touchstart',function(event){
      event=event || window.event;
      event.preventDefault;
    })
  }

  //实现滑屏的UI结构的方法
  function slide(swiperWrap,arr){
     
    // 动态生成小圆点结构 此时的arr只有一组图片,没有经过无缝拼接
     if(pointWrap){
      pointWrap.size=arr.length; //size 5
      for(var i=0;i<arr.length;i++){
        if(i==0){
          pointWrap.innerHTML+='<span class="active"></span>'
        }else{
          pointWrap.innerHTML+='<span></span>'
        }
      }
    }

    // 是否需要无缝
    var needWF=swiperWrap.getAttribute('needWF');
    if(needWF !==null){
      // 说明需要无缝, 复制一组图片
      arr=arr.concat(arr);
    }


    // 根据传入的数组动态生成li的结构
    ulNode.classList.add('list');
    for(var i=0;i<arr.length;i++){
      ulNode.innerHTML+="<li><img src="+(arr[i])+"></li>";
    }
    swiperWrap.appendChild(ulNode);

    // 动态指定ulNode和li的宽度
    styleNode.innerHTML+=".swiper-wrap .list{width:"+arr.length+"00%}"
    styleNode.innerHTML+=".swiper-wrap .list li{width:"+(1/arr.length)*100+"%}"
    styleNode.innerHTML+=".swiper-wrap .list li img{width:100%}"
    document.head.appendChild(styleNode);

    // 动态指定滑屏区域的高度
    var liNode=document.querySelector('.swiper-wrap .list li');
    setTimeout(() => {
      swiperWrap.style.height=liNode.offsetHeight+'px';
    }, 200);

    // 调用真正实现滑屏逻辑的move方法
    move(swiperWrap,ulNode,arr,needWF);
    autoMove(ulNode,pointWrap);
  }

  function move(swiperWrap,ulNode,arr,needWF){
    /* 逻辑:
      拿到滑屏元素一开始的位置,拿到手指滑动距离
      将手指滑动距离设置给滑屏元素
     */
    var eleStartX=0;
    var touchStartX=0;
    var slideDisX=0;
    // 实现1/2跳转
    // index代表滑屏元素的实时位置与视口的比例
    var index=0; 
    // var translateX=0; //专门记录ulNode的位移的位置
    swiperWrap.addEventListener('touchstart',function(ev){
      ev=ev || event
      ulNode.style.transition='';
      var touchC=ev.changedTouches[0];
      touchStartX=touchC.clientX;//手指一开始的位置
     
      if(needWF !==null){
        // 需要无缝
        // 当点到第一组的第一张时,立刻跳到第二组的第一张
        // 当点到第二组的最后一张时,立刻跳到第一组的最后一张
        var whichPic=css(ulNode,'translateX')/document.documentElement.clientWidth;
        if(whichPic===0){
          // 点第一张
          whichPic=-pointWrap.size;
        }else if(whichPic===1-arr.length){
          whichPic=1-pointWrap.size
        }
        css(ulNode,'translateX',whichPic*document.documentElement.clientWidth);
      }

       // 元素一开始的位置必须经过是否无缝的判断,再确定拖动时才不会产生问题
      eleStartX=css(ulNode,"translateX");//滑屏元素一开始的位置 ulNode使用了定位
    })

    swiperWrap.addEventListener('touchmove',function(ev){
      ev=ev || event
      ulNode.style.transition='';
      var touchC=ev.changedTouches[0];
      var touchNowX=touchC.clientX;
      slideDisX=touchNowX-touchStartX;
      // translateX=eleStartX+slideDisX
      // ulNode.style.transform="translateX("+translateX+"px)";
      css(ulNode,"translateX",eleStartX+slideDisX);
    })

    swiperWrap.addEventListener('touchend',function(ev){
      ev=ev || event
      // 当手指提起时,得到滑屏元素的实时位置
      // 用Math的四舍五入方法实现1/2跳转
      // index=Math.round(translateX/document.documentElement.clientWidth)
      index=Math.round(css(ulNode,"translateX")/document.documentElement.clientWidth)

      // 判断index的边界
      if(index>0){
        index=0;
      }else if(index<1-arr.length){
        index=1-arr.length;
      }

      // 同步小圆点
      if(pointWrap){ //如果小圆点的父容器存在才操作小圆点相关逻辑
        var spanList=pointWrap.querySelectorAll('span');
        // 排他思想操作小圆点active类
        for(var i=0;i<spanList.length;i++){
          spanList[i].classList.remove('active');
        }
        spanList[-index % pointWrap.size].classList.add('active');
      }


      ulNode.style.transition='transform 0.5s';
      // 设置ulNode的位置
      // translateX=index*document.documentElement.clientWidth
      // ulNode.style.transform="translateX("+translateX+"px)";
      css(ulNode,"translateX",index*document.documentElement.clientWidth);
    })
  }

  // 自动轮播
  function autoMove(ulNode,pointWrap){
    clearInterval(ulNode.timer);
    autoFlag=0;
    ulNode.timer=setInterval(() => {
      autoFlag--;
      ulNode.style.transition='transform 0.5s'
      css(ulNode,'translateX',autoFlag*document.documentElement.clientWidth);

      // 同步小圆点
      if(pointWrap){ //如果小圆点的父容器存在才操作小圆点相关逻辑
        var spanList=pointWrap.querySelectorAll('span');
        // 排他思想操作小圆点active类
        for(var i=0;i<spanList.length;i++){
          spanList[i].classList.remove('active');
        }
        spanList[-autoFlag % pointWrap.size].classList.add('active');
      }
    }, 2000);

    ulNode.addEventListener('transitionend',function(){
      // 无缝
      if(autoFlag===1-pointWrap.size*2){
        // 当图片是最后一张时,让图片到第一组最后一张
        autoFlag=1-pointWrap.size;
        ulNode.style.transition=''
        css(ulNode,'translateX',autoFlag*document.documentElement.clientWidth);
      }
    })

  }



  // 将方法添加到window上
  window.swiper.init=init;
  window.swiper.slide=slide;

})()