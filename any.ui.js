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
	
	/******************************************************
	 * number - number
	 * attr - object {sign, prefix, suffix}
	 */
	$ui.formatNumber = function(number, attr) {
		attr = attr || {};
		var sign = attr.sign || '\'';
		var prefix = attr.prefix || '';
		var suffix = attr.suffix || '';
		number = number + "";
		var arr = [];
		var index = number.indexOf('.');
		if(index !== -1) {
			index -= 3;
			var len = number.length - index;
			arr.push(number.substr(index, len));
			number = number.substr(0, number.length - len);
		}
		while(number.length > 0) {
			var pos = number.length - 3;
			pos = pos < 0 ? 0 : pos;
			arr.push(number.substr(pos, 3));
			number = number.substr(0, number.length - 3);
		}
		arr.reverse();
		return prefix + arr.join(sign) + suffix;
	};
	
	$ui.handleAll = function(element) {
		this.handleInputs(element);
		this.replaceSlider(element);
	};
	
	$ui.handleInputs = function(element) {
		element = element || root;
		var inputs = $a.all(element, 'input');
		for(var i=0; i < inputs.length; i++) {
			inputs[i].autocomplete="off";
		}
		$mt.bind(inputs, 'touch', $ui.handleInputEvent);
	};
	
	$ui.handleInputEvent = function(event) {
		event.currentTarget.focus();
		if(event.currentTarget.form && $a.isFunc(event.currentTarget.form['on' + event.currentTarget.type])) {
			event.currentTarget.form['on' + event.currentTarget.type](event.currentTarget.form);
		} else if(event.currentTarget.form && $a.isFunc(event.currentTarget.form['on' + event.currentTarget.type])) {
			event.currentTarget.form[event.currentTarget.type](event.currentTarget.form);
		}
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
			this.attr = $a.data(element);
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
	data-accuracy="1 0.1 / 0.01 / 0.05"
	data-enabled="0">
	*/
	$ui.Slider.prototype.createSlider = function() {
		var enabled = parseInt(this.attr.enabled);
		enabled = isNaN(enabled) ? 1 : enabled;
		
		this.element = document.createElement('slider');
		this.element.slider = this;
		this.label = document.createElement('label');
		this.element.slider = this;
		this.label.innerHTML = this.attr.label_main;
		this.bar = document.createElement('bar');
		this.bar.slider = this;
		this.empty = document.createElement('empty');
		this.empty.slider = this;
		this.overflow = document.createElement('overflow');
		this.overflow.slider = this;
		var overflow_value = parseInt(this.attr.overflow_value || 0);
		$a.css(this.overflow, {left: (100 - overflow_value) + '%', width: overflow_value + '%'});
		this.overflow.innerHTML = this.attr.overflow_label || this.attr.overflow_value || '';
		this.filler = document.createElement('filler');
		this.filler.slider = this;
		var value_initial = parseInt(this.attr.value_initial || 0);
		var value_min = parseInt(this.attr.value_min || 0);
		var value_max = parseInt(this.attr.value_max || 0);
		var range = value_max - value_min;
		value_initial = value_initial < value_min ? value_min : value_initial;
		value_initial = value_initial > value_max ? value_max : value_initial;
		var value_percent = (100 - overflow_value) / range * (value_initial - value_min);
		$a.css(this.filler, {left: '0px', width: value_percent + '%'});
		
		if(this.attr.subfiller_value && this.attr.subfiller_label) {
			this.subfiller = document.createElement('subfiller');
			this.subfiller.slider = this;
			$a.css(this.subfiller, {width: this.attr.subfiller_value + '%'});
			this.subfiller.innerHTML = this.attr.subfiller_label || this.attr.subfiller_value || '';
			this.filler.appendChild(this.subfiller);
		}
		
		this.labelmin = document.createElement('labelmin');
		this.labelmin.slider = this;
		this.labelmin.innerHTML = this.attr.label_min || this.attr.value_min;
		this.labelmax = document.createElement('labelmax');
		this.labelmax.slider = this;
		this.labelmax.innerHTML = this.attr.label_max || this.attr.value_max;
		
		
		this.bar.appendChild(this.empty);
		this.bar.appendChild(this.overflow);
		this.bar.appendChild(this.filler);
		this.element.appendChild(this.label);
		this.element.appendChild(this.bar);
		this.element.appendChild(this.labelmin);
		this.element.appendChild(this.labelmax);
		
		if(enabled === 1) {
		 	this.bubble = document.createElement('bubble');
			this.bubble.slider = this;
			this.bubble.style.left = value_percent + '%';
			this.dragthis = document.createElement('dragthis');
			this.dragthis.slider = this;
			this.inputwrapper = document.createElement('inputwrapper');
			this.inputwrapper.slider = this;
			this.bubbleinput = document.createElement('input');
			this.bubbleinput.slider = this;
			this.bubbleinput.type = 'text';
			this.bubbleinput.value = $ui.formatNumber(this.attr.value_initial);
			this.input = document.createElement('input');
			this.input.type = 'hidden';
			this.input.value = this.attr.value_initial;
			this.input.name = this.attr.value_name;

			$mt.bind(this.bubble, 'touchstart', this.startBubble);
			$mt.bind(this.bubble, 'touchmove', this.moveBubble);
			$mt.bind(this.bubble, 'touchend', this.endBubble);
			$mt.bind(this.empty, 'touch', this.touchBar);

			this.inputwrapper.appendChild(this.bubbleinput);
			this.inputwrapper.appendChild(this.input);
			this.bubble.appendChild(this.dragthis);
			this.bubble.appendChild(this.inputwrapper);
			this.element.appendChild(this.bubble);
		}
	};
	
	$ui.Slider.prototype.startBubble = function(event) {
		event.currentTarget.bubblePosition = event.pageX;
		//event.currentTarget.slider.bubbleinput.focus();
	};
	
	$ui.Slider.prototype.moveBubble = function(ev) {
		//$a.requestAnimationFrame(function() {
			var slider = ev.currentTarget.slider;
			
			
			var diff = ev.pageX - ev.currentTarget.bubblePosition;
			if(diff == 0) return;
			
			var left = parseInt(slider.bubble.style.left) || 0;
			
			var overflow_value = parseInt(slider.attr.overflow_value) || 0;
			var min = parseInt(slider.attr.value_min) || 0;
			var max = parseInt(slider.attr.value_max) || 0;
			
			left += (100 - overflow_value) / slider.filler.clientWidth * diff;
			left = parseInt(left) || 1;
			left = left < 0 ? 0 : left;
			left = left > (100 - overflow_value) ? (100 - overflow_value) : left;

			slider.bubble.style.left = Math.round(left) + '%';
			slider.filler.style.width = Math.round(left) + '%';
			var number = max - min;
			var value = Math.round(min + (number / (100 - overflow_value) * left));
			if(slider.attr.accuracy) {
				value = Math.round(value / slider.attr.accuracy) * slider.attr.accuracy;
			}
			if(value != parseInt(slider.bubbleinput.value)) {
				slider.bubbleinput.value = $ui.formatNumber(value);
				slider.input.value = value;
			}
			ev.currentTarget.bubblePosition = ev.pageX;
		//});
	};
	
	$ui.Slider.prototype.endBubble = function(event) {
		delete event.currentTarget.bubblePosition;
		//data.bubbleinput.blur();
		$ui.fireEvent(event.currentTarget.slider.input, 'change');
	};
	
	$ui.Slider.prototype.touchBar = function(event) {
		var slider = event.currentTarget.slider;
		var left = 100 / event.currentTarget.clientWidth * event.layerX;
		slider.bubble.style.left = left + '%';
		slider.filler.style.width = left + '%';
		var number = parseInt(slider.attr.value_max) - parseInt(slider.attr.value_min);
		var value = Math.round(parseInt(slider.attr.value_min) + (number / 100 * left));
		if(value != parseInt(slider.bubbleinput.value)) {
			slider.bubbleinput.value = $ui.formatNumber(value);
			slider.input.value = value;
			$ui.fireEvent(slider.input, 'change');
		}
	};
	
	// event types: https://developer.mozilla.org/en/DOM/document.createEvent#Notes
	$ui.fireEvent = function(element, type) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(type, true, false);
		return element.dispatchEvent(evt);
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
			//$mt.bind(lis, 'touch', this.pressKey);
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

	$ui.Keyboard.types = ['symbol', 'letter', 'back', 'tab', 'capslock', 'enter', 'space', 'hidekeyboard'];

	$ui.Keyboard.prototype.show = function() {
		this.element.style.display = '';
		var element = this.element;
		window.setTimeout(function() {
			$a.animate(element, {property: 'all', duration: '1s', timingFunction: 'ease-in-out'}, {opacity: 1}); 
		}, 100);
	};
	
	$ui.Keyboard.prototype.hide = function() {
		var element = this.element;
		$a.animate(element, {property: 'all', duration: '1s', timingFunction: 'ease-in-out'}, {opacity: 0}, true, function(event){if(event.currentTarget.style.opacity == 0) event.currentTarget.style.display = 'none';});
	};
	
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
		
		var el = event.currentTarget;
		for(var i=0; i < $ui.Keyboard.types.length; i++) {
			if($a.hasClass(el, $ui.Keyboard.types[i])) {
				el.parentNode.keyboard[$ui.Keyboard.types[i]](el);
			}
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
		this.insert($a.first(li, 'span.off').innerHTML.trim());
	};

	$ui.Keyboard.prototype.letter = function(li) {
		this.insert(li.innerHTML.trim());
	};

	$ui.Keyboard.prototype.back = function(li) {
		if(this.input.selectionStart == this.input.selectionEnd) {
			this.input.value = this.input.value.substr(0, this.input.selectionStart - 1) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
		} else {
			this.input.value = this.input.value.substr(0, this.input.selectionStart) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
		}
		this.input.selectionEnd = this.input.selectionStart;
	};

	$ui.Keyboard.prototype.tab = function(li) {
		if(this.input.form) {
			for(var i=0; i < this.input.form.elements.length; i++) {
				if(this.input.form.elements[i] == this.input) {
					i++;
					if(i == this.input.form.elements[i]) i = 0;
					this.input.form.elements[i].focus();
					return;
				}
			}
		}
	};

	$ui.Keyboard.prototype.capslock = function(li) {
		if(this.capslockEnabled) {
			$a.removeClass(li, 'pressedcapslock');
			this.capslockEnabled = false;
			this.shift(li);
		} else {
			$a.addClass(li, 'pressedcapslock');
			this.shift(li);
			this.capslockEnabled = true;
		}
	};

	$ui.Keyboard.prototype.enter = function(li) {
		
	};

	$ui.Keyboard.prototype.shift = function(li) {
		if(this.capslockEnabled) return;
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
	
	$ui.Keyboard.prototype.hidekeyboard = function(li) {
		this.hide();
		this.input.blur();
	};
	
	// set default values for select
	$ui.setDefaultOnSelects = function(element) {
		var selects = $a.all(element, 'select[default]');
		for(var i=0; i < selects.length; i++) {
			var options = selects[i].options;
			for(var j=0; j < options.length; j++) {
				if(options[j].value == selects[i].getAttribute('default')) {
					options[j].setAttribute('selected', 'selected');
				}
			}
		}
	};
	
	// enable switch tags (like radio buttons)
	$ui.activeSwitchs = function(element) {
		var switches = $a.all(element, 'switch');
		for(var i=0; i < switches.length; i++) {
			var input = $a.first(switches[i], 'input');
			var options = $a.all(switches[i], 'switchoption');
			$a.removeClass(options, 'active');
			$mt.bind(options, 'touch', this.touchSwitchOption);
			for(var j=0; j < options.length; j++) {
				if(input.value == $a.data(options[j], 'value')) {
					$a.addClass(options[j], 'active');
					break;
				}
			}
		}
	};
	
	$ui.touchSwitchOption = function(event) {
		var options = $a.all(event.currentTarget.parentNode, 'switchoption');
		$a.removeClass(options, 'active');
		$a.addClass(event.currentTarget, 'active');
		var input = $a.first(event.currentTarget.parentNode, 'input');
		input.value = $a.data(event.currentTarget, 'value');
	};
})(this._anyNoConflict, this._anyMtNoConflict);