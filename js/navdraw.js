function NavDrawJS(options){
if (typeof options === 'undefined') {
    options = {};
  }
  
  function isDefined(flag,el,typ,defId,defClass){
    function setEl(){
      el = document.createElement(typ);
      if (defId != '' && typeof defId !== 'undefined') { el.id = defId; }
      if (defClass != '' && typeof defClass !== 'undefined') { el.className = defClass; }
    }
    if (typeof el === 'undefined' || flag === true) {
      setEl();
      return el;
    } else {
      el = document.getElementById(el);
      if (el != null) { return el; }
      else if (el == null) { setEl(); return el;}
    }
  }
  
  
  
  
  options.header = isDefined(false,options.header,'div','header');
  options.head_container = isDefined(false,options.head_container,'div','head_container')
  options.nav_draw = isDefined(false,options.nav_draw,'div','nav_draw','closed');
  options.nav_touch_bar = isDefined(false,options.nav_touch_bar,'div','nav_touch_bar');
  options.hamburger = isDefined(true,options.hamburger,'div','hamburger');
  options.first_hamb_layer = isDefined(true,options.first_hamb_layer,'span','first_hamb_layer','hamb_layer');
  options.middle_hamb_layer = isDefined(true,options.middle_hamb_layer,'span','middle_hamb_layer','hamb_layer');
  options.last_hamb_layer = isDefined(true,options.last_hamb_layer,'span','last_hamb_layer','hamb_layer');
  
  
  options.hamburger.appendChild(options.first_hamb_layer);
  options.hamburger.appendChild(options.middle_hamb_layer);
  options.hamburger.appendChild(options.last_hamb_layer);
  options.head_container.appendChild(options.hamburger);
  options.head_container.appendChild(options.nav_draw);
  options.head_container.appendChild(options.nav_touch_bar);
  options.header.appendChild(options.head_container);
  if (options.header.parentNode == null) document.body.insertBefore(options.header,document.body.firstChild);

  var hamb = options.hamburger,
      first_hamb_layer = options.first_hamb_layer,
      middle_hamb_layer = options.middle_hamb_layer,
      last_hamb_layer = options.last_hamb_layer,
      
      nav_touch_bar = options.nav_touch_bar,
      nav_draw = options.nav_draw,
      
      hamb_style = 
        " width: 50px;\
          cursor: pointer;\
        ",
      layer_style = 
        " border-radius: 12px; \
          display: block; \
          width: 25px;\
          height: 4px;\
          margin: 5px 12px;\
          margin-top: 0;\
          background-color: #fff;\
        ",
      
      
      pageX_temp,
      touched = false,
      shiftX,
      
      mobility = options.mobility,
      close_timeout,
      log_steps = 11;
      
      console.log('[1/'+log_steps+'] NavDraw: Elements Successfully Initialized');
      
      
      
  function initDOM(param){
    if (param == 'all'){
      options.header =  document.createElement('div');
      options.head_container = document.createElement('div');
      options.nav_draw = document.createElement('div');
      options.nav_touch_bar = document.createElement('div');
      options.hamburger = document.createElement('div');
      initHamb();
    }
  }
  function initHamb(){
    options.first_hamb_layer = document.createElement('span');
    options.middle_hamb_layer = document.createElement('span');
    options.last_hamb_layer = document.createElement('span');
  }
  function initStyles(){
    args.DOM.hamburger.style = "";
    args.DOM.first_hamb_layer.style = layer_style;
    args.DOM.middle_hamb_layer.style = layer_style;
    args.DOM.last_hamb_layer.style = layer_style;
  }
  
  function addListener(el, type, handler, flag){
    if (el.addEventListener){ el.addEventListener(type, handler, flag) }
    else { el.attachEvent("on"+type, handler) }
  }
  
  console.log('[2/'+log_steps+'] NavDraw:  addListener() Initialized');
  
  function getCoords(elem) {
    var box = elem.getBoundingClientRect(),
        body = document.body,
        docEl = document.documentElement,
        
        scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
        
        clientTop = docEl.clientTop || body.clientTop || 0,
        clientLeft = docEl.clientLeft || body.clientLeft || 0,
        
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;

    return {
      top: top,
      left: left
    };
  }
  console.log('[3/'+log_steps+'] NavDraw:  getCoords() Initialized');
  
  function setTransition(trans){
    nav_draw.style.transition = 'left '+trans;
    hamb.style.transition = 'transform '+trans;
    first_hamb_layer.style.transition = 'width '+trans+', margin '+trans+', transform '+trans;
    middle_hamb_layer.style.transition = '';
    last_hamb_layer.style.transition = 'width '+trans+', margin '+trans+', transform '+trans;
  }
  console.log('[4/'+log_steps+'] NavDraw:  setTransition() Initialized');
  
  function placeDrawerLeft(rotate_temp){
    timeout = setTimeout(function(){
      if (nav_draw.className == 'closed') { hamb.style.transition = ''; hamb.style.transform = 'rotate(0deg)';} clearTimeout(timeout);
    },400);
    nav_draw.className = 'closed';
    nav_draw.style.left = -270;
    setTransition('.3s');
    
    first_hamb_layer.style.width = '25px';
    middle_hamb_layer.style.width = '25px';
    last_hamb_layer.style.width = '25px';
    
    first_hamb_layer.style.marginLeft = '12px';
    last_hamb_layer.style.marginLeft = '12px';
    
    hamb.style.transform = 'rotate('+((rotate_temp)?rotate_temp : 360) +'deg)';
    first_hamb_layer.style.transform = '';
    last_hamb_layer.style.transform = '';
  }
  console.log('[5/'+log_steps+'] NavDraw:  placeDrawerLeft() Initialized');
  
  function placeDrawerRight(){
    nav_draw.className = 'opened';
    nav_draw.style.left = 0;
    setTransition('.3s');
    
    first_hamb_layer.style.width = '17px';
    middle_hamb_layer.style.width = '';
    last_hamb_layer.style.width = '17px';
    
    first_hamb_layer.style.marginLeft = '22px';
    last_hamb_layer.style.marginLeft = '22px';
    
    hamb.style.transform = 'rotate(180deg)';
    first_hamb_layer.style.transform = 'rotate(45deg) translateX(3px) translateY(2px)';
    last_hamb_layer.style.transform = 'rotate(-45deg) translateX(3px) translateY(-2px)';
  }
  console.log('[6/'+log_steps+'] NavDraw:  placeDrawerRight() Initialized');
  
  function hamurgerClick(){
    if (nav_draw.className == 'opened'){ placeDrawerLeft(); }
    else if (nav_draw.className == 'closed'){ placeDrawerRight(); }
  }
  console.log('[7/'+log_steps+'] NavDraw:  hamburgerClick() Initialized');
  
  
  nav_draw.onmousedown = function () {return false};
  
  window.onmousedown = function (ev){
      shiftX = ev.pageX - getCoords(nav_draw).left;
      pageX_temp = ev.pageX;
    if (ev.target == nav_touch_bar || ev.target == nav_draw || ev.target.parentNode == nav_draw) { touched = true; }
    else { touched = false; }
  };
  console.log('[8/'+log_steps+'] NavDraw:  onMouseDown() Initialized');
  
  
  window.onmousemove = function(ev){
    var pageX = (mobility) ? ev.touches[0].pageX : ev.pageX,
        xPage = (ev.pageX - shiftX - getCoords(document.body).left) * 100/270,
        arr_width = 17-(xPage * 8/100),
        arr_width_middle = 25+(xPage * 25/100),
        margin_left = 22+(xPage * 22/100),
        
        hamb_rotate = xPage * 180/100,
        layer_rotate = 45+(xPage * 45/100),
        layer_transX = 3+(xPage * 3/100),
        layer_transY = 2+(xPage * 2/100),
        
        nav_draw_newLeft = (xPage * 270/100),
        rightEdge = 0;
        
        
    setTransition('');
    if (nav_draw_newLeft > rightEdge) nav_draw_newLeft = rightEdge;
    else if (nav_draw_newLeft<-270) nav_draw_newLeft = -270;
    
    if (margin_left<12) margin_left = 12+'px';
    
    
    
    if (touched){
      if (ev.taget == document.html){
        if (nav_draw_newLeft != -270 && nav_draw_newLeft != 0){
          if (nav_draw.className == 'closed'){
            nav_draw.className == 'opened'
            hamb.style.transform = 'rotate('+(180+hamb_rotate)+'deg)';
          } else if (nav_draw.className == 'opened'){
            nav_draw.className == 'closed'
            hamb.style.transform = 'rotate('+(180-hamb_rotate)+'deg)';
          }
          nav_draw.style.left = nav_draw_newLeft+'px'; 
          first_hamb_layer.style.width = arr_width;
          //middle_hamb_layer.style.width = arr_width_middle + 'px';
          last_hamb_layer.style.width = arr_width;
          
          first_hamb_layer.style.marginLeft = margin_left;
          last_hamb_layer.style.marginLeft = margin_left;
          
          first_hamb_layer.style.transform = 'rotate(' + layer_rotate + 'deg) translateX('+layer_transX+'px) translateY('+layer_transY+'px)';
          last_hamb_layer.style.transform = 'rotate(-' + layer_rotate + 'deg) translateX('+layer_transX+'px) translateY(-'+layer_transY+'px)';
        } 
      }
    }
  };
  console.log('[9/'+log_steps+'] NavDraw:  onDrawerMove() Initialized');
  
  window.onmouseup = function(ev){
    var nav_bar_offsetLeft = getCoords(nav_draw).left;
    
    if (touched == true){
      touched = false;
      setTransition('.2s');
      if (pageX_temp != ev.pageX){
        if (nav_bar_offsetLeft < -135){ 
          if (nav_draw.className == 'opened') placeDrawerLeft('360');
          else placeDrawerLeft('0');
        }
        else if (nav_bar_offsetLeft > -135 || nav_bar_offsetLeft == -135) { placeDrawerRight(); } 
      }
    }
  };
  console.log('[10/'+log_steps+'] NavDraw:  onMouseUp() Initialized');
  
  
  addListener(hamb, 'click', hamurgerClick, false);
  
  console.log('[11/'+log_steps+'] NavDraw:  Events Attached');
  console.log('NavDraw:  NavDraw is finaly initialized and ready to work :)');
  console.info('#### Powered by [C-h-R-o-N-o-T-o-N-i-U-m] 2016 ####');
  }