(function(w){
  function css(node,type,val){
    if(arguments.length>=3){
      // 写操作
      if(!node.transform){
        node.transform={};
      }
      node.transform[type]=val;
      
      var text='';
      
      for(let key in node.transform){
        switch (key) {
          case 'translateX':
          case 'translateY':
          case 'translateZ':
            // "translateX(100px)"
            text+=key+"("+node.transform[type]+"px)"
            break;
            
          case "rotate":
          case "rotateX":
          case "rotateY":
          case "rotateZ":
            text+= key + "("+(node.transform[key])+"deg)";
            break;

          case "scale":
          case "scaleX":
          case "scaleY":
            text+= key + "("+(node.transform[key])+")";
            break;
        }
      }
      node.style.transform=text;
    }else if(arguments.length===2){
      // 读操作
      // 之前设置过transform值才允许读,否则返回undefined
      val=node.transform && node.transform[type];
      // 如果之前没有设置过属性值,设置一些读取类型的默认值
      if(val ===undefined){
        if(type === 'translateX' || type ==='translateZ' ||type === 'translateY' ||type === 'translate'){
          val=0;
        }else if(type === 'scale' ||type === 'scaleX' || type ==='scaleY'){
          val=1;
        }else if(type === 'rotateX' ||type === 'rotateY' ||type === 'rotate' || type ==='rotateZ'){
          val=0;
        }
      }
      return val;
    }else{
      throw new Error('css方法必须传递2个以上参数')
    }

  }
  
  w.css=css;
})(window)



        