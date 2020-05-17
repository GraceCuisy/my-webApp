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

  // 暴露出去的实现滑屏的方法
  function slide(swiperWrap,arr){
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

    // 动态生成小圆点结构
    if(pointWrap){
      for(var i=0;i<arr.length;i++){
        if(i==0){
          pointWrap.innerHTML+='<span class="active"></span>'
        }else{
          pointWrap.innerHTML+='<span></span>'
        }
      }
    }

    // 动态指定滑屏区域的高度
    var liNode=document.querySelector('.swiper-wrap .list li');
    setTimeout(() => {
      swiperWrap.style.height=liNode.offsetHeight+'px';
    }, 200);

    // 调用真正滑屏的move方法
    move(swiperWrap,ulNode,arr);
  }

  function move(swiperWrap,ulNode,arr){
    /* 逻辑:
      拿到滑屏元素一开始的位置,拿到手指滑动距离
      将手指滑动距离设置给滑屏元素
     */
    var eleStartX=0;
    var touchStartX=0;
    var slideDisX=0;
    var index=0; //图片的下标
    swiperWrap.addEventListener('touchstart',function(ev){
      ev=ev || event
      ulNode.style.transition='';
      var touchC=ev.changedTouches[0];
      touchStartX=touchC.clientX;//手指一开始的位置
      eleStartX=ulNode.offsetLeft;
    })

    swiperWrap.addEventListener('touchmove',function(ev){
      ev=ev || event
      ulNode.style.transition='';
      var touchC=ev.changedTouches[0];
      var touchNowX=touchC.clientX;
      slideDisX=touchNowX-touchStartX;
      ulNode.style.left=eleStartX+slideDisX+'px';
    })

    swiperWrap.addEventListener('touchend',function(ev){
      ev=ev || event
      // 判断一下是往左滑还是右滑
      if(slideDisX>0){
        // 右滑
        index--;
      }else if(slideDisX<0){
        // 左滑
        index++;
      }

      // 判断图片下标的边界
      if(index<0){
        index=0;
      }else if(index>arr.length-1){
        index=arr.length-1;
      }

      // 同步小圆点
      if(pointWrap){ //如果小圆点的父容器存在才操作小圆点相关逻辑
        var spanList=pointWrap.querySelectorAll('span');
        // 排他思想操作小圆点active类
        for(var i=0;i<spanList.length;i++){
          spanList[i].classList.remove('active');
        }
        spanList[index].classList.add('active');
      }


      ulNode.style.transition='left 0.5s';
      // 把left值设置给ulNode
      ulNode.style.left=-index*document.documentElement.clientWidth+'px';
    })
  }



  // 将方法添加到window上
  window.swiper.init=init;
  window.swiper.slide=slide;

})()