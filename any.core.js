//     any.js @VERSION@
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

  // Export our methods as `$a` in `root` (i.e. `window`).
  root.$a = root._anyNoConflict = $a;

  // Current version
  $a.VERSION = '0.0.1';

  // ## Utility methods
  //
  // 

  $a.ready = function(loadedCallback) {
		this.bind("DOMContentLoaded", loadedCallback, false);
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
  
  // Returns `true` if supplied object is a string.
  $a.isStr = function(str) {
    return (typeof str === 'string');
  };
  
  // Extend obj1 with obj2 recursive
  $a.extend = function(obj1, obj2) {
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

  // Add event listener for event to node.
  $a.bind = function(node, event, callback, useCapture) {
    if (node.addEventListener) node.addEventListener(event, callback, useCapture);
		else if (node.attachEvent) node.attachEvent("on" + event, callback);
  };

  // Remove event listener from node.
  $a.unbind = function(node, event, callback, useCapture) {
    if (node.removeEventListener) node.removeEventListener(event, callback, useCapture);
    else if (node.detachEvent) node.detachEvent("on" + event, callback);
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
    node = arguments.length > 1 ? arguments[0] : defaultNode;
    id = arguments.length > 1 ? arguments[1] : arguments[0];
    return node.getElementById(id);
  };  
  
  // ### $a.first("css"), $a.first(node, "css")
  // Find first matching element using a CSS expression.
  $a.first = function() {
    node = arguments.length > 1 ? arguments[0] : defaultNode;
    query = arguments.length > 1 ? arguments[1] : arguments[0];
    return node.querySelector(query);
  };

  // Find all matching elements using a CSS expression.
  $a.all = function() {
    node = arguments.length > 1 ? arguments[0] : defaultNode;
    query = arguments.length > 1 ? arguments[1] : arguments[0];
    return node.querySelectorAll(query);
  };

  // Build nodes from HTML snippet.
  $a.html = function(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.childNodes;
  };

  // Read and write HTML5 data attributes.
  $a.data = function(node, key, value) {
    if(value != undefined) {
      node.setAttribute('data-' + key, value);
    } else {
      return node.getAttribute('data-' + key);
    }
  };

  // ## CSS and animations
  
  // Set all supplied CSS properties on `node`, basically a shortcut for
  // multiple `node.style.xyz = ...` calls.
  //
  //     $a.css(node, { marginTop: '12px', opacity: 0.5 });
  //
  $a.css = function(node, object) {
    for(var key in object) {
      node.style[key] = object[key];
    }
  };

  // Add class to node.
  $a.addClass = function(node, className) {
    if(!node.classList) node.classList = new this._ClassList(node);
    return node.classList.add(className);
  };

  // Remove class from node.
  $a.removeClass = function(node, className) {
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
    cleanup = cleanup == undefined ? true : cleanup;

    if(animationObj.property != undefined) {
      node.style.webkitTransitionProperty = animationObj.property;
      node.style.mozTransitionProperty = animationObj.property;
    }
    if(animationObj.duration != undefined) {
      node.style.webkitTransitionDuration = animationObj.duration;
      node.style.mozTransitionDuration = animationObj.duration;
    }
    if(animationObj.timingFunction != undefined) {
      node.style.webkitTransitionTimingFunction = animationObj.timingFunction;
      node.style.mozTransitionTimingFunction = animationObj.timingFunction;
    }
    if(animationObj.delay != undefined) {
      node.style.webkitTransitionDelay = animationObj.delay;
      node.style.mozTransitionDelay = animationObj.delay;
    }
    if(cleanup) {
      this.bind(node, 'webkitTransitionEnd', this._animationCleanup);
      this.bind(node, 'mozTransitionEnd', this._animationCleanup);
    }
    if($a.isFunc(callback)) {
      this.bind(node, 'webkitTransitionEnd', callback);
      this.bind(node, 'mozTransitionEnd', callback);
    }
    this.css(node, cssObj);
  };

  // Private: reset animation properties after transisition ended.
  $a._animationCleanup = function(event) {
    $a.animate(event.currentTarget, {property: null, duration: null, timingFunction: null, delay: null}, {}, false);
  };

	// todo
	$a.transform = function(node, type, setterX, setterY, setterZ) {
		if(node == undefined) {
			return;
		}
		if(this.isStr(type) && setterX === undefined) {
			if(node.matrix == undefined) node.matrix = {};

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
				 return null;
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
			var rotate = node.matrix.rotate.x != undefined ? 'rotate(' + node.matrix.rotate.x + 'deg)' : '';
			var translate = (node.matrix.translate.x != undefined && node.matrix.translate.y != undefined) ? 'translate(' + node.matrix.translate.x + 'px,' + node.matrix.translate.y + 'px)' : '';
			var scale = node.matrix.scale.x != undefined ? 'scale(' + node.matrix.scale.x + ')' : '';
			var style =  translate + ' ' +  rotate + ' ' + scale;
			node.style.webkitTransform = style;
			node.style.MozTransform = style;
		}
		return null;
	}

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
   * }
   */
  $a.ajax = function(params) {
    if(params.method == undefined) params.method = 'GET';

    if(params.method == 'GET') {
      params.url = params.url + '?' + params.data;
      params.data = null;
    }

    var httpRequest = new XMLHttpRequest();
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
    httpRequest.open(params.method, params.url, true);
    httpRequest.send(params.data);
  };
})();
