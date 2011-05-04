//     any.ui.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.ui.js is freely distributable under the MIT license.
//     Portions of any.ui.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages


(function($a, $mt) {
	var root = this;
	
	var $ui = {};
	
	root.$ui = root._anyUiNoConflict = $ui;
	
	$ui.VERSION = '0.0.1';
	
	$ui.formatNumber = function(number, sign) {
		number = number + "";
		
	};
	
	$ui.handleAll = function(element) {
		this.handleInputs(element);
		this.replaceSlider(element);
	};
	
	$ui.handleInputs = function(element) {
		element = element || root;
		$mt.bind($a.all(element, 'input'), 'touch', function(event) {event.currentTarget.focus();console.log('focus');});
	};
	
	$ui.replaceSlider = function(element) {
		element = element || root;
		var sliders = $a.all(element, 'input[type=slider]');
		for(var i=0; i < sliders.length; i++) {
			var slider = new $ui.Slider(sliders[i]);
		}
	};
	
	/**
	 * slider
	 */
	$ui.Slider = function(element) {
		if(element instanceof HTMLElement) {
			this.parent = element.parentNode;
			this.attr = $a.data(element);
			this.insertBefore = element.nextSibling;
		} else if($a.isObj(element)) {
			this.parent = element.parent;
			this.attr = element;
		} else {
			throw 'got a wrong parameter';
		}
		
		this.createSlider();
		if(this.parent instanceof HTMLElement) {
			if(element instanceof HTMLElement) {
				this.parent.replaceChild(this.element, element);
			} else {
				this.parent.appendChild(this.element);
			}
		}
	};
	/*
	data-label_main="Mandate Amount"
	data-label_min="0.-"
	data-label_center="0"
	data-label_max="45'650.-"
	data-overflow_value="25"
	data-overflow_label="Expenditure"
	data-filler_width="25"
	data-filler_left="0"
	data-subfiller_value="60"
	data-subfiller_label="30%"
	data-value_min="0"
	data-value_max="10"
	data-value_initial="18'000.-"
	data-value_default="5"
	data-unit=" Years"
	data-accuracy="1 0.1 / 0.01 / 0.05">
	*/
	$ui.Slider.prototype.createSlider = function() {
		this.element = document.createElement('slider');
		this.label = document.createElement('label');
		this.label.innerHTML = this.attr.label_main;
		this.bar = document.createElement('bar');
		this.empty = document.createElement('empty');
		this.overflow = document.createElement('overflow');
		$a.css(this.overflow, {left: (100 - this.attr.overflow_value) + '%', width: this.attr.overflow_value + '%'});
		this.overflow.innerHTML = this.attr.overflow_label || this.attr.overflow_value;
		this.filler = document.createElement('filler');
		$a.css(this.filler, {left: this.attr.filler_left + '%', width: this.attr.filler_width + '%'});
		this.subfiller = document.createElement('subfiller');
		$a.css(this.subfiller, {width: this.attr.subfiller_value + '%'});
		this.subfiller.innerHTML = this.attr.subfiller_label || this.attr.subfiller_value;
		this.labelmin = document.createElement('labelmin');
		this.labelmin.innerHTML = this.attr.label_min || this.attr.value_min;
		this.labelmax = document.createElement('labelmax');
		this.labelmax.innerHTML = this.attr.label_max || this.attr.value_max;
		this.bubble = document.createElement('bubble');
		this.dragthis = document.createElement('dragthis');
		this.inputwrapper = document.createElement('inputwrapper');
		this.bubbleinput = document.createElement('input');
		this.bubbleinput.value = this.attr.value_initial;
		
		this.inputwrapper.appendChild(this.bubbleinput);
		this.bubble.appendChild(this.dragthis);
		this.bubble.appendChild(this.inputwrapper);
		this.filler.appendChild(this.subfiller);
		this.bar.appendChild(this.empty);
		this.bar.appendChild(this.overflow);
		this.bar.appendChild(this.filler);
		this.element.appendChild(this.label);
		this.element.appendChild(this.bar);
		this.element.appendChild(this.labelmin);
		this.element.appendChild(this.labelmax);
		this.element.appendChild(this.bubble);
	};
	
	/**
		keyboard
	*/
	$ui.Keyboard = function(element, input) {
		this.element = element;
		this.input = input;
		this.capslockEnabled = false;
		
		if( ! this.element.keyboard) {
			var lis = $a.all(this.element, 'li');
			$mt.bind(lis, 'touch', this.pressKey);
			$mt.bind(lis, 'touchstart', this.touchDown);
			$mt.bind(lis, 'touchend', this.touchUp);
		}
		
		this.element.keyboard = this;
	};

	$ui.Keyboard.ord = function(c) {
		return c.charCodeAt(0);
	};

	$ui.Keyboard.chr = function(o) {
	  return String.fromCharCode(o);
	};

	$ui.Keyboard.types = ['symbol', 'letter', 'delete', 'tab', 'capslock', 'return', 'space'];

	$ui.Keyboard.prototype.pressKey = function(event) {
		var el = event.currentTarget;
		for(var i=0; i < $ui.Keyboard.types.length; i++) {
			if($a.hasClass(el, $ui.Keyboard.types[i])) {
				el.parentNode.keyboard[$ui.Keyboard.types[i]](el);
			}
		}
	};

	$ui.Keyboard.prototype.touchDown = function(event) {
		$a.addClass(event.currentTarget, 'pressed');
		if($a.hasClass(event.currentTarget, 'shift')) {
			event.currentTarget.parentNode.keyboard.shift(event.currentTarget);
		}
	};

	$ui.Keyboard.prototype.touchUp = function(event) {
		$a.removeClass(event.currentTarget, 'pressed');
		if($a.hasClass(event.currentTarget, 'shift')) {
			event.currentTarget.parentNode.keyboard.shift(event.currentTarget);
		}
	};

	$ui.Keyboard.prototype.insert = function(sign) {
		this.input.selectionStart;
		this.input.selectionEnd;
		this.input.value += sign;
	};

	$ui.Keyboard.prototype.symbol = function(li) {
		this.insert($a.first(li, 'span.on').innerHTML.trim());
	};

	$ui.Keyboard.prototype.letter = function(li) {
		this.insert(li.innerHTML.trim());
	};

	$ui.Keyboard.prototype.delete = function(li) {
		if(this.input.selectionStart == this.input.selectionEnd) {
			this.input.value = this.input.value.substr(0, this.input.selectionStart - 1) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
		} else {
			this.input.value = this.input.value.substr(0, this.input.selectionStart) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
		}
		this.input.selectionEnd = this.input.selectionStart;
	};

	$ui.Keyboard.prototype.tab = function(li) {
		
	};

	$ui.Keyboard.prototype.capslock = function(li) {
		if(this.capslockEnabled) {
			li.style.backgroundColor = '';
			this.capslockEnabled = false;
			this.shift(li);
		} else {
			li.style.backgroundColor = 'gray';
			this.shift(li);
			this.capslockEnabled = true;
		}
	};

	$ui.Keyboard.prototype.return = function(li) {
		
	};

	$ui.Keyboard.prototype.shift = function(li) {
		if(this.capslockEnabled) return;
		console.debug('shift');
		var letters = $a.all(this.element, 'li.letter');
		for(var i=0; i < letters.length; i++) {
			var code = $ui.Keyboard.ord(letters[i].innerHTML);
			code = code < 91 ? code + 32 : code - 32;
			letters[i].innerHTML = $ui.Keyboard.chr(code);
		}

		var symbols = $a.all(this.element, 'li.symbol span');
		$a.toggleClass(symbols, 'on');
		$a.toggleClass(symbols, 'off');
	};

	$ui.Keyboard.prototype.space = function(li) {
		this.insert(' ');
	};
})(this._anyNoConflict, this._anyMtNoConflict);