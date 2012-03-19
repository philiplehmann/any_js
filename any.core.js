//     any.core.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages

(function() {

  // ## Common variables
  //
  // These are used to simplify working in the anonymous
  // function and provide access to stuff like `window`.

  // Access root object, `window` in the browser or `global` on a server
  var root = this;

  // Points to `window.document` or `root` when on server object.
  var defaultNode = root.document ? root.document : root;

  // Internal save object, so we can asume `$a` is available in
  // our context.
  var $a = {};
	
	// namespace for some intern functions
	var $event_handler = {};

  // Export our methods as `$a` in `root` (i.e. `window`).
  root.$a = root._anyNoConflict = $a;

  // Current version
  $a.VERSION = '0.0.1';

  // ## Utility methods
  //
  // 
  //
	
	$a.CHROME = 'chrome';
	$a.FIREFOX = 'firefox';
	$a.FENNEC = 'fennec';
	$a.SAFARI = 'safari';
	$a.MOBILE_SAFARI = 'mobile_safari';
	$a._BROWSERS = {};
	$a._BROWSERS[$a.CHROME] = /chrome.*safari/gi;
	$a._BROWSERS[$a.FIREFOX] = /Firefox\/4/gi;
	$a._BROWSERS[$a.FENNEC] = /fennec/gi;
	$a._BROWSERS[$a.SAFARI] = /version.*safari/gi;
	$a._BROWSERS[$a.MOBILE_SAFARI] = /version.*mobile.*safari/gi;
	$a.WINDOWS = 'windows';
	$a.MACOSX = 'macosx';
	$a._OS = {};
	$a._OS[$a.MACOSX] = /Mac*/gi
	$a._OS[$a.WINDOWS] = /Win*/gi
  // return the browser type chrome, firefox, fennic, safari or mobile_safari
	$a.browserDetection = function() {
		for(var browser in this._BROWSERS) {
			if(this.isBrowser(browser)) {
				return browser;
			}
		}
		return false;
	};
	
	$a.osDetection = function() {
		for(var os in this._OS) {
			if(this.isOS(os)) {
				return os;
			}
		}
		return false;
	};
	
	// Returns boolen if the given browser is the actual used one
	$a.isBrowser = function(browser) {
		return (navigator.userAgent.match($a._BROWSERS[browser]) !== null);
	};
	
	$a.isOS = function(os) {
		return (navigator.platform.match($a._OS[os]) !== null);
	};

  // Returns `true` if supplied object is a function.
  $a.isFunc = function(func) {
    return (typeof func === 'function')
  };

  // Returns `true` if supplied object is an object.
  $a.isObj = function(obj) {
    return (!Array.isArray(obj) && typeof obj === 'object');
  };
  
  // Returns `true` if supplied object is an array.
  $a.isArr = function(arr) {
    return Array.isArray(arr);
  };

	// Returns `true` if supplied object is a HTMLCollection (FF) or NodeList
	$a.isCol = function(collection) {
		return collection instanceof NodeList || collection instanceof HTMLCollection;
	};
  
  // Returns `true` if supplied object is a string.
  $a.isStr = function(str) {
    return (typeof str === 'string');
  };

	// Returns `true` if supplied object is a number.
  $a.isNum = function(num) {
    return (typeof num === 'number');
  };
  
	// Returns `true` if supplied object is a number.
  $a.isBool = function(bool) {
    return (typeof bool === 'boolean');
  };

  // Extend obj1 with obj2 recursive
  $a.extend = function(obj1, obj2) {
		if(obj1 == undefined) obj1 = {};
    for (var p in obj2) {
      try {
        if ($a.isObj(obj2[p])) {
          obj1[p] = $a.extend(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  };
	
	// helper function for compareObj
	$a._countProps = function(obj) {
	    var count = 0;
	    for (k in obj) {
	        if (obj.hasOwnProperty(k)) {
	            count++;
	        }
	    }
	    return count;
	};

	// compare two objects
	$a.compareObj = function(v1, v2) {
		if (typeof(v1) !== typeof(v2)) {
			return false;
		}

		if (typeof(v1) === "function") {
			return v1.toString() === v2.toString();
		}

		if (v1 instanceof Object && v2 instanceof Object) {
			if ($a._countProps(v1) !== $a._countProps(v2)) {
				return false;
			}
			var r = true;
			for (k in v1) {
				r = $a.compareObj(v1[k], v2[k]);
				if (!r) {
					return false;
				}
			}
			return true;
		} else {
			return v1 === v2;
		}
	}

  // ### $a.json("str"), $a.json(object)
  // Convert an object to a JSON string, or parse a string
  // as JSON.
  //
  //     $a.json("{'a':12,'b':'test'}") // => { a: 12, b: 'test' }
  //     $a.json({ a: 12, b: 'test' })  // => '{"a":12,"b":"test"}'
  //
  $a.json = function(obj_or_str) {
    if (this.isStr(obj_or_str)) return JSON.parse(obj_or_str);
    return JSON.stringify(obj_or_str);
  };

  // ## DOM event handling
  //

  // ### $a.ready(funcRef)
  //
  // Cross-browser method to handle `DOMContentLoaded`, also provides a fallback to
  // `onload` if everything fails :)
  $a.ready = function(loadedCallback) {
    if (defaultNode.addEventListener) defaultNode.addEventListener("DOMContentLoaded", loadedCallback, false);
    else if (defaultNode.readyState && defaultNode.readyState === "complete") loadedCallback();
    else if (defaultNode.readyState && defaultNode.attachEvent) defaultNode.attachEvent('onreadystatechange', function() { if (defaultNode.readyState === "complete") loadedCallback(); });
    else $a.bind(defaultNode, "load", loadedCallback);
  };

  // ### $a.bind(node, "click", funcRef)
  //
  // Add event listener for event to node.
	// node - node or node array
	// event - event name
	// callback - function
	// useCapture - 
	// data - whatever
	$event_handler._get_data_function_id = 0;
	$event_handler._set_data_function = function(node, event, callback, useCapture, data, func) {
		if( ! callback.aid) callback.aid = $event_handler._get_data_function_id++;
		if(node._data_functions == undefined) node._data_functions = {};
		if(node._function_data == undefined) node._function_data = {counter: 0};
		if(node._data_functions[event] == undefined) node._data_functions[event] = {};
		if(node._data_functions[event][callback.aid] == undefined) node._data_functions[event][callback.aid] = {};
		if(node._data_functions[event][callback.aid][useCapture] == undefined) node._data_functions[event][callback.aid][useCapture] = {data: {}};
		node._data_functions[event][callback.aid][useCapture][$event_handler._get_data_id(node._data_functions[event][callback.aid][useCapture], data)] = func;
	};
	$event_handler._get_data_function = function(node, event, callback, useCapture, data) {
		if( ! callback.aid) callback.aid = $event_handler._get_data_function_id++;
		
		var has = $event_handler._has_data_function(node, event, callback, useCapture, data);
		if(has !== false) {
			return has;
		} else {
			var func = function(ev) {return callback(ev, data)};
			$event_handler._set_data_function(node, event, callback, useCapture, data, func);
			return func;
		}
	};
	
	$event_handler._remove_data_function = function(node, event, callback, useCapture, data) {
		if($event_handler._has_data_function(node, event, callback, useCapture, data)) {
			var data_id = $event_handler._get_data_id(node._data_functions[event][callback.aid][useCapture], data);
			delete node._data_functions[event][callback.aid][useCapture][data_id];
		}
	};
	
	$event_handler._has_data_function = function(node, event, callback, useCapture, data) {
		if( ! callback.aid) callback.aid = $event_handler._get_data_function_id++;
		try {
			if(
					node._data_functions != undefined && 
					node._data_functions[event] != undefined &&
					node._data_functions[event][callback.aid][useCapture] != undefined
			) {
				var data_id = $event_handler._get_data_id(node._data_functions[event][callback.aid][useCapture], data);
				if(node._data_functions[event][callback.aid][useCapture][data_id] != undefined) {
					return node._data_functions[event][callback.aid][useCapture][data_id];
				}
			}
		} catch(e) {
			return false;
		}
		return false;
	};
	
	$event_handler._get_data_index = 0;
	$event_handler._get_data_id = function(namespace, data) {
		for(var id in namespace.data) {
			if($a.compareObj(namespace.data[id], data)) {
				return id;
			}
		}
		var id = $event_handler._get_data_index++;
		namespace.data[id] = data;
		return id;
	};
	
  $a.bind = function(node, event, callback, useCapture, data) {
		useCapture = useCapture !== true ? false : true;
		
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.bind(node[i], event, callback, useCapture, data);
			}
			return;
		}
		
		if (this.isFunc(node.addEventListener)) {
			if(data) {
				return node.addEventListener(event, $event_handler._get_data_function(node, event, callback, useCapture, data), useCapture);
			} else {
				return node.addEventListener(event, callback, useCapture);
			}
		} else if (this.isFunc(node.attachEvent)) {
			if(data) {
				return node.attachEvent("on" + event, $event_handler._get_data_function(node, event, callback, useCapture, data));
			} else {
				return node.attachEvent("on" + event, callback);
			}
		}
  };

  // Remove event listener from node.
  $a.unbind = function(node, event, callback, useCapture, data) {
		useCapture = useCapture !== true ? false : true;
		
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.unbind(node[i], event, callback, useCapture, data);
			}
			return;
		}
		
		if (this.isFunc(node.removeEventListener)) {
			if(data) {
				var func = $event_handler._get_data_function(node, event, callback, useCapture, data);
				$event_handler._remove_data_function(node, event, callback, useCapture, data);
				return node.removeEventListener(event, func, useCapture);
			} else {
				return node.removeEventListener(event, callback, useCapture);
			}
    } else if (this.isFunc(node.detachEvent)) {
			if(data) {
				var func = $event_handler._get_data_function(node, event, callback, useCapture, data);
				$event_handler._remove_data_function(node, event, callback, useCapture, data);
				return node.detachEvent("on" + event, func);
			} else {
				return node.detachEvent("on" + event, callback);
			}
		}
	};

  // Returns `true` if element (default `<div/>`) supports the
  // DOM event in question.
  //
  // Basically an internal method, but might be useful.
  $a._supportsEvent = function(event, element) {
    element = element || document.createElement('div');
    event = 'on' + event;
    return (event in element);
  };

  // ## DOM traversal & manipulation

  // ### $a.id("id"), $a.id(node, "id")
  // Shortcut for `document.getElementById`.
  //
  //     $a.id('someId');       // searches in window.document
  //     $a.id(node, 'someId'); // searches in node
  //
  $a.id = function() {
    var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var id = arguments.length > 1 ? arguments[1] : arguments[0];
    return node.getElementById(id);
  };
	
	// shortcut for getElementsByClassName
	$a.elsByClass = function() {
		var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var className = arguments.length > 1 ? arguments[1] : arguments[0];
		return node.getElementsByClassName(className);
	};
	
	// shortcut for getElementsByTagName
	$a.elsByTag = function(node, tagName) {
		var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var tagName = arguments.length > 1 ? arguments[1] : arguments[0];
		return node.getElementsByTagName(tagName);
	};
  
  // ### $a.first("css"), $a.first(node, "css")
  // Find first matching element using a CSS expression.
	// include sizzle js if you want to use this function in any browser (http://sizzlejs.com/)
  $a.first = function() {
    var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var query = arguments.length > 1 ? arguments[1] : arguments[0];
    if(this.isFunc(node.querySelector)) {
			return node.querySelector(query);
		} else if(window.Sizzle && this.isFunc(Sizzle)) {
			var arr = Sizzle(query, node);
			if(arr.length > 0) return arr[0];
			return null;
		}
  };

  // Find all matching elements using a CSS expression.
	// include sizzle js if you want to use this function in any browser (http://sizzlejs.com/)
  $a.all = function() {
    var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var query = arguments.length > 1 ? arguments[1] : arguments[0];
    if(this.isFunc(node.querySelectorAll)) {
			return node.querySelectorAll(query);
		} else if(window.Sizzle && this.isFunc(Sizzle)) {
			return Sizzle(query, node);
		}
	};
  
  // Find parentNode with a css selector
  $a.parent = function() {
    var node = arguments.length > 1 ? arguments[0] : defaultNode;
    var query = arguments.length > 1 ? arguments[1] : arguments[0];
    
    if(query) {
      var all = $a.all(query);
      var obj = node.parentNode;
      while(obj != null) {
        if(Array.prototype.indexOf.call(all, obj) !== -1) {
          return obj;
        }
        obj = obj.parentNode;
      }
    } else {
      return node.parentNode;
    }
    return null;
  }

  // Build nodes from HTML snippet.
  $a.html = function(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.childNodes;
  };

  // Read and write HTML5 data attributes.
  $a.data = function(node, key, value) {
    if(value != undefined) {
      if(node.dataset) {
				node.dataset[key] = value;
			} else {
				node.setAttribute('data-' + key, value);
			}
    } else if(key != undefined) {
			if(node.dataset) {
				return node.dataset[key];
			} else { 
				return node.getAttribute('data-' + key);
			}
    } else {
			if(node.dataset) {
				return node.dataset;
			} else {
				var values = {};
				for(var i=0; i < node.attributes.length; i++) {
					var key = node.attributes[i].nodeName;
					var value = node.attributes[i].nodeValue;
					if(key.match(/^data-.*/g) !== null) {
						key = key.substr(5);
						values[key] = value;
					}
				}
				return values;
			}
		}
  };

  // ## CSS and animations
  
  // Set all supplied CSS properties on `node`, basically a shortcut for
  // multiple `node.style.xyz = ...` calls.
  //
  //     $a.css(node, { marginTop: '12px', opacity: 0.5 });
  //
  $a.css = function(node, object) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.css(node[i], object);
			}
			return;
		}
    for(var key in object) {
      node.style[key] = object[key];
    }
  };

	$a.show = function(node) {
		this.css(node, {display:''});
	};

	$a.hide = function(node) {
		this.css(node, {display:'none'});
	};
	
	$a.toggle = function(node) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.toggle(node[i]);
			}
			return;
		}
		if(node.style.display == 'none') {
			this.show(node);
		} else {
			this.hide(node);
		}
	};

  // Add class to node.
  $a.addClass = function(node, className) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.addClass(node[i], className);
			}
			return;
		}
    if(!node.classList) node.classList = new this._ClassList(node);
    return node.classList.add(className);
  };

  // Remove class from node.
  $a.removeClass = function(node, className) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.removeClass(node[i], className);
			}
			return;
		}
    if( ! node.classList) node.classList = new this._ClassList(node);
    return node.classList.remove(className);
  };

  // Tests wheter node has class or not.
  $a.hasClass = function(node, className) {
    if ( ! node.classList) node.classList = new this._ClassList(node);
    return node.classList.contains(className);
  };

  // Toggle class.
  $a.toggleClass = function(node, className) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.toggleClass(node[i], className);
			}
			return;
		}
    if ( ! node.classList) node.classList = new this._ClassList(node);
    return node.classList.toggle(className);
  };
  
  /**
   * animate node with css transition
   *
   * node - html element
   * animationObj - {property: 'all', duration: '1s', timingFunction: 'ease-in-out', delay: '0s'}
   * cssObj - {with: 200px.....}
   * cleanup - removes transition on transition end (true|false)
   * callback - called on the transition end
   *
   * moz doc http://developer.mozilla.org/en/CSS/CSS_transitions
   */
  $a.animate = function(node, animationObj, cssObj, cleanup, callback) {
		if(this.isArr(node) || this.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.animate(node[i], animationObj, cssObj, cleanup, callback);
			}
			return;
		}
    cleanup = cleanup == undefined ? true : cleanup;

    if(animationObj.property != undefined) {
      node.style.webkitTransitionProperty = animationObj.property;
      node.style.MozTransitionProperty = animationObj.property;
      node.style.oTransitionProperty = animationObj.property;
      node.style.transitionProperty = animationObj.property;
    }
    if(animationObj.duration != undefined) {
      node.style.webkitTransitionDuration = animationObj.duration;
      node.style.MozTransitionDuration = animationObj.duration;
      node.style.oTransitionDuration = animationObj.duration;
      node.style.transitionDuration = animationObj.duration;
    }
    if(animationObj.timingFunction != undefined) {
      node.style.webkitTransitionTimingFunction = animationObj.timingFunction;
      node.style.MozTransitionTimingFunction = animationObj.timingFunction;
      node.style.oTransitionTimingFunction = animationObj.timingFunction;
      node.style.transitionTimingFunction = animationObj.timingFunction;
    }
    if(animationObj.delay != undefined) {
      node.style.webkitTransitionDelay = animationObj.delay;
      node.style.MozTransitionDelay = animationObj.delay;
      node.style.oTransitionDelay = animationObj.delay;
      node.style.transitionDelay = animationObj.delay;
    }
		
		if($a.isFunc(callback)) {
			node._animation_callback = callback;
		}
		
    if(cleanup) {
      this.bind(node, 'webkitTransitionEnd', this._animationCleanup);
      this.bind(node, 'mozTransitionEnd', this._animationCleanup);
      this.bind(node, 'oTransitionEnd', this._animationCleanup);
      this.bind(node, 'transitionend', this._animationCleanup);
    }
    $a.css(node, cssObj);
    
  };

  // Private: reset animation properties after transisition ended.
  $a._animationCleanup = function(event) {
    $a.animate(event.currentTarget, {property: '', duration: '', timingFunction: '', delay: ''}, {}, false);

		$a.unbind(event.currentTarget, 'webkitTransitionEnd', $a._animationCleanup);
    $a.unbind(event.currentTarget, 'mozTransitionEnd', $a._animationCleanup);
    $a.unbind(event.currentTarget, 'oTransitionEnd', $a._animationCleanup);
    $a.unbind(event.currentTarget, 'transitionend', $a._animationCleanup);

		if($a.isFunc(event.currentTarget._animation_callback)) {
			event.currentTarget._animation_callback(event);
			delete event.currentTarget._animation_callback;
		}
  };

	// todo
	$a.transform = function(node, type, setterX, setterY, setterZ, returnValue) {
		if(node == undefined) {
			return;
		}
		if(this.isStr(type) && setterX === undefined) {
			if(node.matrix == undefined) node.matrix = {};
			if(node.matrix.translate == undefined) node.matrix.translate = {x:0, y:0, z:0};
			if(node.matrix.scale == undefined) node.matrix.scale = {x:1, y:0, z:0};
			if(node.matrix.rotate == undefined) node.matrix.rotate = {x:0, y:0, z:0};

			switch(type) {
				case 'translate':
					if(node.matrix.translate == undefined) node.matrix.translate = {x: undefined, y: undefined, z: undefined};
				  return node.matrix.translate;
				break;
				case 'scale':
				  if(node.matrix.scale == undefined) node.matrix.scale = {x: undefined, y: undefined, z: undefined};
				  return node.matrix.scale;
				break;
				case 'rotate':
				  if(node.matrix.rotate == undefined) node.matrix.rotate = {x: undefined, y: undefined, z: undefined};
				  return node.matrix.rotate;
				break;
				default:
					return this._transform(node);
				break;
			}
		} else {
			if ( ! this.isObj(node.matrix)) { node.matrix = {}; }
			if(node.matrix.translate == undefined) node.matrix.translate = {};
			if(node.matrix.scale == undefined) node.matrix.scale = {};
			if(node.matrix.rotate == undefined) node.matrix.rotate = {};

			switch(type) {
				case 'translate':
					if(setterX != undefined) node.matrix.translate.x = setterX;
					if(setterY != undefined) node.matrix.translate.y = setterY;
					if(setterZ != undefined) node.matrix.translate.z = setterZ;
				break;
				case 'scale':
					if(setterX != undefined) node.matrix.scale.x = setterX;
					if(setterY != undefined) node.matrix.scale.y = setterY;
					if(setterZ != undefined) node.matrix.scale.z = setterZ;
				break;
				case 'rotate':
					if(setterX != undefined) node.matrix.rotate.x = setterX;
					if(setterY != undefined) node.matrix.rotate.y = setterY;
					if(setterZ != undefined) node.matrix.rotate.z = setterZ;
				break;
			}
			var style = this._transform(node);
			if(returnValue !== true) {
				node.style.webkitTransform = style;
				node.style.MozTransform = style;
				node.style.oTransform = style;
				node.style.transform = style;
			} else {
				return style
			}
			return;
		}
		return null;
	}
	
	$a._transform = function(node) {
		if(node == undefined || node.matrix == undefined) return '';
		var rotate = node.matrix.rotate.x != undefined ? 'rotate(' + node.matrix.rotate.x + 'deg)' : '';
		var translate = (node.matrix.translate.x != undefined && node.matrix.translate.y != undefined) ? 'translate(' + node.matrix.translate.x + 'px,' + node.matrix.translate.y + 'px)' : '';
		var scale = node.matrix.scale.x != undefined ? 'scale(' + node.matrix.scale.x + ')' : '';
		return translate + ' ' +  rotate + ' ' + scale;
	}
	
	// found on https://gist.github.com/839879
	// chrome shipped without the time arg in m10
	$a._timeundefined = false;
	if (root.webkitRequestAnimationFrame) {
		webkitRequestAnimationFrame(function(time) {
			$a._timeundefined = (time == undefined);
		});
	}

	if($a.isFunc(root.requestAnimationFrame)) $a.requestAnimationFrame = function(callback) {return root.requestAnimationFrame(callback);};
	else if($a.isFunc(root.webkitRequestAnimationFrame) && !$a._timeundefined) $a.requestAnimationFrame = function(callback) {return root.webkitRequestAnimationFrame(callback);};
	else if($a.isFunc(root.mozRequestAnimationFrame)) $a.requestAnimationFrame = function(callback) {return root.mozRequestAnimationFrame(callback);};
	else if($a.isFunc(root.oRequestAnimationFrame)) $a.requestAnimationFrame = function(callback) {return root.oRequestAnimationFrame(callback);};
	else if($a.isFunc(root.msRequestAnimationFrame)) $a.requestAnimationFrame = function(callback) {return root.msRequestAnimationFrame(callback);};
	else $a.requestAnimationFrame = function(callback) {root.setTimeout(callback, 1000 / 60, Date.now());};

  // Private: ClassList implementation for browser
  // which have no support for it.
  $a._ClassList = function(node) {    
    this.node = node;
    if ( ! this.node.className) this.node.className = '';
    this.list = node.className.split(' ');
    this.add = function(className) {
      if(!this.contains(className)) {
        this.list.push(className);
        this.clean();
        this.node.className = this.list.join(' ');
      }
    };
    this.remove = function(className) {
      if(this.contains(className)) {
        this.list.splice(this.list.indexOf(className), 1);
        this.clean();
        this.node.className = this.list.join(' ');
      }
    };
    this.contains = function(className) {
      return (this.list.indexOf(className) !== -1) ? true : false;
    };
    this.toggle = function(className) {
      if(this.contains(className)) {
        this.remove(className);
      } else {
        this.add(className);
      }
    };
    this.clean = function() {
      var arr = [];
      for(var i=0; i < this.list.length; i++) {
        if(this.list[i].length > 0) {
          arr.push(this.list[i]);
        }
      }
      this.list = arr;
    };
    this.clean();
  };

  // ## AJAX

  /**
   * params = {
   *    url
   *    data
   *    onsuccess optional
   *    onerror optional
   *    method GET|POST default GET
   *		async true|false default true
   *    type   JSON
   *
   *    mozilla documentation https://developer.mozilla.org/en/XMLHttpRequest
   * }
   */
  $a.ajax = function(params) {
    if(params.method == undefined) params.method = 'GET';
		if(params.async == undefined) params.async = true;
		
		if(params.method == 'GET' && this.isObj(params.data) && params.data != undefined) {
			var arr = [];
			for(var key in params.data) {
				arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(params.data[key]));
			}
			params.data = arr.join('&');
		}
		if(params.method == 'GET' && params.data != undefined) {
      params.url = params.url + (params.url.indexOf('?') === -1 ? '?' : '&') + params.data;
      params.data = null;
    } else if(params.method == 'POST' && params.data != undefined) {
      if($a.isObj(params.data)) {
        params.data = JSON.stringify(params.data);
      }
    }

    var httpRequest = new XMLHttpRequest();
		if(params.async) {
    	httpRequest.onreadystatechange = function() {
	      if (httpRequest.readyState == 4) {
	        if (httpRequest.status == 200) {
	          if($a.isFunc(params.onsuccess)) {
	            params.onsuccess(httpRequest);
	          }
	        } else {
	          if($a.isFunc(params.onerror)) {
	            params.onerror(httpRequest);
	          }
	        }
	      }
	    };
		}
    httpRequest.open(params.method, params.url, params.async);
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if(params.method == 'POST') httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(params.data);
		if( ! params.async) {
			return httpRequest.responseText;
		} else {
		  return httpRequest;
		}
  };
  
  $a.getValue = function(element) {
    var name = element.nodeName.toLowerCase();
    switch(name) {
      case 'input':
        switch (element.type.toLowerCase()) {
          case 'checkbox':
          case 'radio':
            return element.checked ? element.value : null;
          default:
            return element.value;
        }
      case 'textarea':
        return element.value;
      case 'select':
        if(element.type === 'select-one') {
          var index = element.selectedIndex;
          return index >= 0 ? element.options[index].value : null;
        } else {
          var values = [], length = element.options.length;
          if (!length) return null;
          for (var i = 0; i < length; i++) {
            if (element.options[i].selected) {
              values.push(element.options[i].value);
            }
          }
          return values;
        }
      default:
        return null;
    }
  }
  
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun != "function") {
        throw new TypeError();
      }
      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fun mutates this
          if (fun.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }
      return res;
    };
  }
  
  $a.serialize = function(form, type) {
    type = type || 'url';
    var elements = form.elements, 
        len = elements.length,
        initial;
    var hashRun = function(obj, keys, value, isArr) {
      var key = keys.shift();
      if(keys.length == 0) {
        if(isArr) {
          if(key in obj) {
            obj[key].push(value);
          } else {
            obj[key] = [value];
          }
        } else {
          obj[key] = value;
        }
        return;
      }
      if(!(key in obj)) {
        obj[key] = {};
      }
      hashRun(obj[key], keys, value, isArr);
    }
    for(var i=0; i < len; i++) {
      var el = elements[i];
      if (!el.disabled && el.name) {
        var value = $a.getValue(el);
        if (value != null && el.type != 'file' && el.type != 'submit') {
          if(type === 'json') {
            initial = initial || {};
            var isArr = el.name.match(/(\[\])$/) !== null,
                keys = el.name.split(/(\[|\])/).filter(function(s) { return s != '' && s != '[' && s != ']' });
            hashRun(initial, keys, value, isArr);
          } else {
            initial = initial || '';
            initial += (initial ? '&' : '') + encodeURIComponent(el.name) + '=' + encodeURIComponent(value);
          }
        }
      }
    }
    return initial;
  };
})();