//     any.ui.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.ui.js is freely distributable under the MIT license.
//     Portions of any.ui.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages


(function($a) {
	var root = this;
	
	var $ui = {};
	
	root.$ui = root._anyUiNoConflict = $ui;
	
	$ui.VERSION = '0.0.1';
	
	$ui.formatNumber = function(number, sign) {
		number = number + "";
		
	};
	
	$ui.replaceSlider = function() {
		var sliders = $a.all('input[type=slider]');
		for(var i=0; i < sliders.length; i++) {
			var slider = new $ui.Slider(sliders[i]);
		}
	};
	
	$ui.Slider = function(element){
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
		console.debug(this.attr);
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
	
})(this._anyNoConflict);