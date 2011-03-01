(function() {
  
  // Access root object, `window` in the browser or `global` on a server
  var root = this;
  
  // Points to `window.document` or `root` when on server object.
  var defaultNode = root.document != undefined ? root.document : root;
  
  // Internal save object, so we can asume `$a` is available in
  // our context.
  var $a = {};
  
  // Export our methods as `$a` in `root`.
  root.$a = $a;
  
  // Current version
  $a.VERSION = '0.0.1';

  $a.ready = function(loadedCallback) {
		document.addEventListener("DOMContentLoaded", loadedCallback, false);
  };

  $a.css = function(node, object) {
		for(var key in object) {
			node.style[key] = object[key];
		}
	};

  // Find first matching element using a CSS expression.
  $a.first = function(node, query) {
		node = query ? node : defaultNode;
		query = query || node;

		return node.querySelector(query);
  };
  
  // Find all matching elements using a CSS expression.
  $a.all = function(node, query) {
		node = query ? node : defaultNode;
		query = query || node;

		return node.querySelectorAll(query);
  };
  
  
  // Basically a shortcut for `document.getElementById`.
  $a.id = function(node, id) {
		node = id ? node : defaultNode;
		id = id || node;

		return node.getElementById(id);
  };
  
  // Returns `true` if supplied object is a function.
  $a.isFunc = function(func) { 
    return (typeof func === 'function')
	};

	// Returns `true` if supplied object is an object
  $a.isObj = function(obj) {
		if(!Array.isArray(obj) && typeof obj === 'object') {
			return true;
		}
		return false;
	};
	
	// Returns `true` if supplied object is an array
	$a.isArr = function(arr) {
		return Array.isArray(arr);
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

  $a.bind = function(node, event, callback, useCapture) {
		node.addEventListener(event, callback, useCapture);
  };
  
  $a.unbind = function(node, event, callback, useCapture) {
		node.removeEventListener(event, callback, useCapture);
	};

  // Read and write HTML5 data attributes.
  $a.data = function(node, key, value) {
    if(value != undefined) {
			node.setAttribute('data-' + key, value);
		} else {
			return node.getAttribute('data-' + key);
		}
  };

	/**
	 * params = {
	 * 		url
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
					if($a.isFunc(onsuccess)) {
						onsuccess(httpRequest.responseText);
					}
				} else {
					if($a.isFunc(onerror)) {
						onerror();
					}
				}
			}
		};
		httpRequest.open(params.method, params.url, true);
		httpRequest.send(params.data);
	};
	
	$a.json_encode = function(obj) {
		return JSON.stringify(obj);
	};
	
	$a.json_decode = function(string) {
		return JSON.parse(string);
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

  // Build nodes from HTML snippet.
  $a.html = function(html) {
		var tmp = document.createElement('div');
		tmp.innerHTML = html;
		return tmp.childNodes;
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
  
})();