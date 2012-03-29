//     any.mt.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages

// touchevent documentation from apple
// http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/cl/TouchEvent

// Touch documentation from apple
// http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html#//apple_ref/javascript/cl/Touch

(function($a) {
	var root = this;
	
	var $mt = {};
	
	root.$mt = root._anyMtNoConflict = $mt;
	
	$mt.VERSION = '0.0.1';
	
	$mt.bindHandler = {};
	$mt.registerBindHandler = function(handler, browser, os) {
		if(this.bindHandler[browser] == undefined) this.bindHandler[browser] = {};
		this.bindHandler[browser][os] = handler;
	};
	
	$mt.unregsiterBindHandler = function(browser, os) {
		if(this.bindHandler[browser]) delete this.bindHandler[browser][os];
	}
	
	$mt.bind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		var os = $a.osDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser] && this.bindHandler[browser][os]) {
				this.bindHandler[browser][os].bind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.bind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	$mt.unbind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		var os = $a.osDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser] && this.bindHandler[browser][os]) {
				this.bindHandler[browser][os].unbind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.unbind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	/**
	 * scroll a node subnode
	 * obj {
	 * 	 node - HTMLElement 
   *   wrapper - HTMLElement to scroll in node - optional
	 *   type - horizontal | vertical - default vertical
	 *   onScrollStart
	 *   onScrollMove, 
	 *   onScrollEnd
	 * }
	 */
  $mt.Scroll = function(attrs) {
    this.node = attrs.node;
    this.wrapper = attrs.wrapper || this.node.children[0];
    this.type = attrs.type || 'vertical';
    this.start = attrs.onScrollStart;
    this.move = attrs.onScrollMove;
    this.end = attrs.onScrollEnd;
    
    if( ! this.node) throw 'no node defined';
    if( ! this.wrapper) throw 'no wrapper defined';
    
    this.node.scrollClass = this;

		$mt.bind(this.node, 'touchstart', this.touchstart, true);
		$mt.bind(this.node, 'touchmove', this.touchmove, true);
		$mt.bind(this.node, 'touchend', this.touchend, true);
		$mt.bind(this.node, 'touchcancel', this.touchend, true);
  }
  
  $mt.Scroll.prototype = {
    unbind: function() {
  		$mt.unbind(this.node, 'touchstart', this.touchstart, true);
  		$mt.unbind(this.node, 'touchmove', this.touchmove, true);
  		$mt.unbind(this.node, 'touchend', this.touchend, true);
  		$mt.unbind(this.node, 'touchcancel', this.touchend, true);
    },
    
    touchstart: function(evt) {
  		var self = this.scrollClass;
      if(self.block === true) return;
  		self.positionY = evt.pageY;
  		self.positionX = evt.pageX;
  		self.sid = evt.streamId;
  		if($a.isFunc(self.start)) {
  			self.start.call(this, evt);
  		}
    },
    
    touchmove: function(evt) {
  		var self = this.scrollClass;
      if(self.block === true) return;
  		
  		if(self.sid != evt.streamId) return;
      
  		var ydiff = self.positionY - evt.pageY;
  		var xdiff = self.positionX - evt.pageX;
  		var diff = self.type == 'vertical' ? ydiff : xdiff;
  		if(diff == 0) {
  			return;
  		} else if(self.type == 'vertical' && Math.abs(xdiff) > Math.abs(ydiff)) {
        return;
      } else if(self.type == 'horizontal' && Math.abs(xdiff) < Math.abs(ydiff)) {
        return;
      }
		
  		var margin = parseInt(self.type == 'vertical' ? self.wrapper.style.marginTop : self.wrapper.style.marginLeft) || 0;

  		var contentSize = self.type == 'vertical' ? self.node.clientHeight : self.node.clientWidth;
  		var scrollSize = self.type == 'vertical' ? self.wrapper.clientHeight : self.wrapper.clientWidth;

  		var maxSize = contentSize - scrollSize;
  		var position = margin - diff;
      //console.log(position);
  		position = position < maxSize ? maxSize : position;
  		position = position > 0 ? 0 : position;
  		if(self.type == 'vertical') {
  			self.wrapper.style.marginTop = position + 'px';
  		} else {
  			self.wrapper.style.marginLeft = position + 'px';
  		}
  		self.positionY = evt.pageY;
  		self.positionX = evt.pageX;
		
  		if($a.isFunc(self.move)) {
  			self.move(evt, position);
  		}
    },
    
    touchend: function(evt) {
  		var self = this.scrollClass;
      if(self.block === true) return;
  		delete self.positionY;
  		delete self.positionX;
  		if($a.isFunc(self.end)) {
  			self.end.call(this, evt);
  		}
    }
  };
	$mt.scroll = function(attrs) {
    console.warn('$mt.scroll is deprecated, use new $mt.Scroll()');
    return new $mt.Scroll(attrs);
	};
	
	$mt.unscroll = function(node, type) {
		throw('unscroll is not supported anymore. use unbind on scroll return');
	};
	
	/**
	 * swipe a node
	 * obj {
	 * 	 node - HTMLElement 
	 *   type - horizontal | vertical - default horizontal
	 *   minSpeed - default 1
	 *   startAfter - default 20
	 *   onSwipeStart
	 *   onSwipeMove 
	 *   onSwipeEnd
	 *   callback - called after swipe when conditions match
	 * }
	 */
  $mt.Swipe = function(attrs) {
		this.node = attrs.node;
    this.type = attrs.type || 'horizontal';
    this.minSpeed = attrs.minSpeed || 1;
    this.startAfter = attrs.startAfter || 20;
    this.start = attrs.onSwipeStart;
    this.move = attrs.onSwipeMove;
    this.end = attrs.onSwipeEnd;
    this.callback = attrs.callback;
    
    if( ! this.node instanceof HTMLElement) throw 'no node defined';
    
    this.node.swipeClass = this;

		$mt.bind(this.node, 'touchstart', this.touchstart, true);
		$mt.bind(this.node, 'touchmove', this.touchmove, true);
		$mt.bind(this.node, 'touchend', this.touchend, true);
		$mt.bind(this.node, 'touchcancel', this.touchend, true);
    
  }
  $mt.Swipe.prototype = {
  	touchstart: function(evt) {
  		var self = this.swipeClass;
  		self.tsStart = Date.now();
  		self.startPoint = evt;
  		if($a.isFunc(self.start)) {
  			self.start(evt);
  		}
  	},
	
  	touchmove: function(evt) {
  		var self = this.swipeClass;
      
  		if($a.isFunc(self.move)) {
  			self.move(evt);
  		}
  	},
	
  	touchend: function(evt) {
  		var self = this.swipeClass;
		
  		var xdiff = self.startPoint.pageX - evt.pageX;
  		var ydiff = self.startPoint.pageY - evt.pageY;
  		if((Math.abs(ydiff) > Math.abs(xdiff) && self.type == 'horizontal') || (Math.abs(ydiff) < Math.abs(xdiff) && self.type == 'vertical')) {
  		  self.startPoint = null;
  			return;
  		}
  		if(Math.abs(xdiff) > self.startAfter || Math.abs(ydiff) > self.startAfter) {
  			if(self.type == 'horizontal') {
  			  self.callback(xdiff > 0 ? 1 : -1, evt);
  			} else if(type == 'vertical') {
  			  self.callback(ydiff > 0 ? 1 : -1, evt);
  			}
  		}
  		self.startPoint = null;
		
  		if($a.isFunc(self.end)) {
  			self.end(evt);
  		}
  	},
    
    unbind: function() {
  		$mt.unbind(this.node, 'touchstart', this.touchstart, true);
  		$mt.unbind(this.node, 'touchmove', this.touchmove, true);
  		$mt.unbind(this.node, 'touchend', this.touchend, true);
  		$mt.unbind(this.node, 'touchcancel', this.touchend, true);
      
    }
  };
	$mt.swipe = function(attrs) {
    console.warn('$mt.swipe is deprecated, use new $mt.Swipe()');
		return new $mt.Swipe(attrs);
	};
	
	$mt.unswipe = function(node, type) {
    throw('unscroll is not supported anymore. use unbind on swipe return');
	}
	
	
	
	$mt.draw = {};
	$mt.draw.items = [];
	$mt.draw.called = false;
	$mt.draw.set = function(element) {
		if($mt.draw.items.indexOf(element) === -1) {
			$mt.draw.items.push(element);
		}
		$mt.draw.called = true;
		$a.requestAnimationFrame($mt.draw.run);
	};
	
	$mt.draw.run = function(ts) {
		$mt.draw.items.forEach(function(element, i) {
			var style = $a.transform(element);
			element.style.mozTransform = style;
			element.style.webkitTransform = style;
			element.style.oTransform = style;
			element.style.transform = style;
		});
		$mt.draw.called = false;
	};
	
	$mt.elementCounter = 0;
	
	/**
   * move a node with css transition
   * {
   *   node - element to bind event
   *   mnode - optional element for move else it will use node
   *   onTouchStartPre - callback for touchstart start
   *   onTouchStartPost - callback for touchstart end
   *   onTouchMovePre - callback for touchmove start
   *   onTouchMovePost - callback for touchmove end
   *   onTouchEndPre - callback for touchend start
   *   onTouchEndPost - callback for touchend end
   * }
   */
  $mt.Move = function(attrs) {
    this.node = attrs.node;
    this.mnode = attrs.mnode || this.node;
    this.startPre = attrs.onTouchStartPre;
    this.startPost = attrs.onTouchStartPost;
    this.movePre = attrs.onTouchMovePre;
    this.movePost = attrs.onTouchMovePost;
    this.endPre = attrs.onTouchEndPre;
    this.endPost = attrs.onTouchEndPost;
    
    this.node.moveClass = this;
    
		$mt.bind(this.node, 'touchstart', this.touchstart, true);
		$mt.bind(this.node, 'touchmove', this.touchmove, true);
		$mt.bind(this.node, 'touchend', this.touchend, true);
		$mt.bind(this.node, 'touchcancel', this.touchend, true);
  }
  $mt.Move.prototype = {
  	touchstart: function(evt) {
  		var self = this.moveClass;
  		if($a.isFunc(self.startPre)) {
  			self.startPre(evt);
  		}
		
  		evt.preventDefault();
      
  		self.mnode.style.zIndex = $mt.elementCounter += 1;
  		self.touchX = evt.pageX;
  	  self.touchY = evt.pageY;
  		self.touchSID = evt.streamId;
		
  		if($a.isFunc(self.startPost)) {
  			self.startPost(evt);
  		}
  	},
	
  	touchmove: function(evt) {
  		var self = this.moveClass;
      
  		if(self.gesture || self.touchSID != evt.streamId || (isNaN(self.touchX) || isNaN(self.touchY)) || self.touchX == undefined || self.touchY == undefined) {
  			return;
  		}
      
  		if($a.isFunc(self.movePre)) {
  			self.movePre(evt);
  		}

  		var translate = $a.transform(self.mnode, 'translate');
  		var translateX = translate.x + (evt.pageX - self.touchX);
  		var translateY = translate.y + (evt.pageY - self.touchY);
  		$a.requestAnimationFrame(function() {
  			$a.transform(self.mnode, 'translate', translateX, translateY);
  		});
		
  		self.touchX = evt.pageX;
  		self.touchY = evt.pageY;
		
  		if($a.isFunc(self.movePost)) {
  			self.movePost(evt);
  		}
  	},
	
  	touchend: function(evt) {
  		var self = this.moveClass;
  		if(evt.streamId != self.touchSID) return;
		
  		if($a.isFunc(self.endPre)) {
  			self.endPre(evt);
  		}
		
  		delete self.touchX;
  		delete self.touchY;
  		delete self.touchSID;
		
  		if($a.isFunc(self.endPost)) {
  			self.endPost(evt);
  		}
  	},
    
    unbind: function() {
  		$mt.unbind(this.node, 'touchstart', this.touchstart, true);
  		$mt.unbind(this.node, 'touchmove', this.touchmove, true);
  		$mt.unbind(this.node, 'touchend', this.touchend, true);
  		$mt.unbind(this.node, 'touchcancel', this.touchend, true);
  		
    }

  };
	// handlers: onTouchStartPre, onTouchStartPost, onTouchMovePre, onTouchMovePost, onTouchEndPre, onTouchEndPost
	// $mt.registerMove(element, {onTouchMovePost: function(event) {alert(event.rotation;)}});
	$mt.registerMove = function(element, handlers, move_object) {
    console.warn('$mt.registerMove is deprecated, use new $mt.Move()');
		return new $mt.Move($a.extend(handlers, {node: element, object: move_object}));
	};
	
	$mt.unregisterMove = function(element) {
		throw('unregisterMove is not supported anymore. use unbind on registerMove return');
	};
	
	
	
	// handlers: gestureStartCallbackStart, gestureStartCallbackEnd, gestureMoveCallbackStart, gestureMoveCallbackEnd, gestureEndCallbackStart, gestureEndCallbackEnd
	// $mt.registerGesture(element, {gestureMoveCallbackEnd: function(event) {alert(event.rotation;)}});
  $mt.Gesture = function(attrs) {
    this.node = attrs.node;
    this.mnode = attrs.mnode || this.node;
  }
	$mt.registerGesture = function(element, handlers) {
		if(element._move_handlers != undefined) return;
		element._move_handlers = handlers;
		$mt.bind(element, 'gesturestart', $mt.gestureStart);
		$mt.bind(element, 'gesturechange', $mt.gestureChange);
		$mt.bind(element, 'gestureend', $mt.gesturteEnd);
	};
	
	$mt.unregisterGesture = function(element, rotate, scale, handlers) {
		if(handlers == undefined) handlers = {};
		handlers.rotate = rotate || false;
		handlers.scale = scale || false;
	};
	
	$mt.gestureStart = function(event, data) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackStart)) {
			el._gesture_handlers.gestureStartCallbackStart(event);
		}
		
		el.scale = $a.transform(el, 'scale').x || 1;
		el.rotation = $a.transform(el, 'rotate').x || 0;
		el.gesture = true;
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackEnd)) {
			data.gestureStartCallbackEnd(event);
		}
	};
	
	$mt.gestureChange = function(event) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackStart)) {
			el._gesture_handlers.gestureStartCallbackStart(event);
		}
		
		if(el.running === true) return;
		el.running = true;

		var change = false;
		var rot = 0;
		if(data.rotate && el.rotation !== undefined) {
			rot = (el.rotation + event.rotation) % 360;
			change = true;
			$a.transform(el, 'rotate', rot, undefined, undefined, true);
		}
		var scaleRes = 0;
		if(data.scale && el.scale !== undefined) {
			scaleRes = el.scale * event.scale;
			change = true;
			$a.transform(el, 'scale', scaleRes, undefined, undefined, true);
		}
		
		if(change) {
			$mt.draw.set(el);
		}
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackEnd)) {
			el._gesture_handlers.gestureStartCallbackEnd(event, rot, scaleRes);
		}
		el.running = false;
	};
	
	$mt.gestureEnd = function(event, data) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureEndCallbackStart)) {
			el._gesture_handlers.gestureEndCallbackStart(event);
		}
		
		el.scale = undefined;
		el.rotation = undefined;
		delete el.gesture;
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureEndCallbackEnd)) {
			el._gesture_handlers.gestureEndCallbackEnd(event);
		}
	};
	
	$mt.escapeElement = function(element) {
	  var func = function(evt){evt.preventDefault();return false;};
		element.onclick = func;
		element.onmousedown = func;
		element.onmousemove = func;
		element.onmouseup = func;
		element.onmouseover = func;
		element.onmouseout = func;
		element.onmouseenter = func;
		element.onmouseleave = func;
    /*
    onmousewheel: null
    onpaste: null
    onreset: null
    onscroll: null
    onsearch: null
    onselect: null
    onselectstart: null
    onabort: null
    onbeforecopy: null
    onbeforecut: null
    onbeforepaste: null
    onblur: null
    onchange: null
    onclick: function (evt){evt.preventDefault();return false;}
    oncontextmenu: null
    oncopy: null
    oncut: null
    ondblclick: null
    ondrag: null
    ondragend: null
    ondragenter: null
    ondragleave: null
    ondragover: null
    ondragstart: null
    ondrop: null
    onerror: null
    onfocus: null
    oninput: null
    oninvalid: null
    onkeydown: null
    onkeypress: null
    onkeyup: null
    onload: null
    */
	};
	
	var EmulateTouch = {
		_mapping: {touch: 'click', touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup', doubletouch: 'dblclick'},
		bind: function(node, event, callback, useCapture, data) {
			if(this._mapping[event] !== undefined) {
				return $a.bind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.bind(node, event, callback, useCapture, data);
			}
		},
		
		unbind: function(node, event, callback, useCapture, data) {
			if(this._mapping[event] !== undefined) {
				return $a.unbind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.unbind(node, event, callback, useCapture, data);
			}
		}
	};
	
})(this._anyNoConflict);