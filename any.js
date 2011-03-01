window.$a = {
	ready: function(loadedCallback) {
		document.addEventListener("DOMContentLoaded", loadedCallback, false);
	  return this;
	},
	
	css: function(node, object) {
		for(var key in object) {
			node.style[key] = object[key];
		}
	},
	
	query: function(node, query) {
		node = query ? node : document;
		query = query || node;
		
		return node.querySelector(query);
	},
	
	queryAll: function(node, query) {
		node = query ? node : document;
		query = query || node;
		
		return node.querySelectorAll(query);
	},
	
	id: function(node, id) {
		node = id ? node : document;
		id = id || node;
		
		return node.getElementById(id);
	},
	
	isFunc: function(func) {
		
	},
	
	isObj: function(obj) {
		
	},
	
	isArr: function(arr) {
		
	},
	
	isStr: function(str) {
		
	},
	
	isInt: function(int) {
		
	},
	
	extend: function(obj1, obj2) {
		
	},
	
	bind: function(node, event, callback, useCapture) {
		node.addEventListener(event, callback, useCapture)
	},
	
	unbind: function(node, event, callback, useCapture) {
		
	},
	
	browserdetection: function() {
		
	},
	
	data: function(node, key, value) {
		if(value != undefined) {
			node.setAttribute('data-' + key, value);
		} else {
			return node.getAttribute('data-' + key);
		}
	}, 
	
	animate: function(node, animationObj, cssObj, cleanup) {
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
			this.bind(node, 'webkitTransitionEnd', this.animationCleanup);
			this.bind(node, 'mozTransitionEnd', this.animationCleanup);
		}
		this.css(node, cssObj);
	},
	
	animationCleanup: function(event) {
		$a.animate(event.currentTarget, {property: null, duration: null, timingFunction: null, delay: null}, {}, false);
	},
	
	elementsByHTML: function (html) {
		var tmp = document.createElement('div');
		tmp.innerHTML = html;
		return tmp.childNodes;
	},
	
	addClass: function(node, className) {
		if(!node.classList) {
			node.classList = new this.ClassList(node);
		}
		return node.classList.add(className);
	},
	
	removeClass: function(node, className) {
		if(!node.classList) {
			node.classList = new this.ClassList(node);
		}
		return node.classList.remove(className);
	},
	
	hasClass: function(node, className) {
		if(!node.classList) {
			node.classList = new this.ClassList(node);
		}
		return node.classList.contains(className);
	},
	
	toggleClass: function(node, className) {
		if(!node.classList) {
			node.classList = new this.ClassList(node);
		}
		return node.classList.toggle(className);
	},
	
	ClassList: function(node) {
		this.node = node;
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
	}
};
Array.prototype.map = function(func) {
	if(!$a.isFunc(func)) return;

	var arr = [];
	for(var i=0; i < this.length; i++) {
		arr.push(func(this[i], i));
	}
	return arr;
}

/**
 * func
 */
Array.prototype.each = function(func) {
	if(!$a.isFunc(func)) return;
	
	for(var i=0; i < this.length; i++) {
		if(func(this[i], i) === false) {
			break;
		}
	}
}