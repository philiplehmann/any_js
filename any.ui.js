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
    if(number < 1000) {
      return prefix + number + suffix;
    }
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
  $ui.Slider = function(obj) {
    var className = '';
    if(obj instanceof HTMLElement) {
      this.parent = obj.parentNode;
      this.replace = obj;
      this.attr = $a.data(obj);
      this.insertBefore = obj.nextSibling;
      className = obj.className;
    } else if($a.isObj(obj)) {
      this.parent = obj.replace.parentNode;
      this.replace = obj.replace;
      if(obj.attr) {
        this.attr = obj.attr
      }
      if(this.attr.className) {
        className = this.attr.className;
      }
    } else {
      throw 'got a wrong parameter';
    }

    var el = this.createSlider();
    el.className = className;
    if(this.parent instanceof HTMLElement) {
      if(this.replace instanceof HTMLElement) {
        this.parent.replaceChild(el, this.replace);
      } else {
        this.parent.appendChild(el);
      }
    }
    el.slider = this;
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

    var element = document.createElement('slider');
    element.slider = this;
    this.label = document.createElement('label');
    this.label.innerHTML = this.attr.label_main || '';
    this.bar = document.createElement('bar');
    this.bar.slider = this;
    this.empty = document.createElement('empty');
    this.empty.slider = this;
    var overflow_value = parseInt(this.attr.overflow_value || 0);
    if(overflow_value > 0) {
      this.overflow = document.createElement('overflow');
      this.overflow.slider = this;
      $a.css(this.overflow, {left: (100 - overflow_value) + '%', width: overflow_value + '%'});
      this.overflow.innerHTML = this.attr.overflow_label || this.attr.overflow_value || '';
    }
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
    this.labelmin.innerHTML = this.attr.label_min || this.attr.value_min || '';
    this.labelmax = document.createElement('labelmax');
    this.labelmax.slider = this;
    this.labelmax.innerHTML = this.attr.label_max || this.attr.value_max || '';


    this.bar.appendChild(this.empty);
    if(this.overflow) this.bar.appendChild(this.overflow);
    this.bar.appendChild(this.filler);
    element.appendChild(this.label);
    element.appendChild(this.bar);
    element.appendChild(this.labelmin);
    element.appendChild(this.labelmax);

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
      this.input.slider = this;
      this.input.type = 'hidden';
      this.input.value = this.attr.value_initial;
      this.input.name = this.attr.value_name;

      $mt.bind(this.bubble, 'touchstart', this.startBubble);
      $mt.bind(this.bubble, 'touchmove', this.moveBubble);
      $mt.bind(this.bubble, 'touchend', this.endBubble);
      $mt.bind(this.bubble, 'touch', this.touchBubble);
      $a.bind(this.input, 'blur', this.blurInput);
      $mt.bind(this.bar, 'touch', this.touchBar);

      this.inputwrapper.appendChild(this.bubbleinput);
      this.inputwrapper.appendChild(this.input);
      this.bubble.appendChild(this.dragthis);
      this.bubble.appendChild(this.inputwrapper);
      element.appendChild(this.bubble);
    }
    return element;
  };

  $ui.Slider.prototype.getPositionByValue = function(value) {
    var overflow = this.overflow ? this.overflow.clientWidth : 0;
    var width = this.bar.clientWidth - overflow - 30;

    var min = parseFloat(this.attr.value_min) || 0;
    var max = parseFloat(this.attr.value_max) || 0;
    var range = max - min;

    value = value < min ? min : value;
    value = value > max ? max : value;

    value -= min;

    return width / range * value;
  };

  $ui.Slider.prototype.setValue = function(value, min, max) {
    if(min) this.attr.value_min = min;
    if(max) this.attr.value_max = max;
    var left = this.getPositionByValue(value);

    this.bubble.style.left = Math.round(left) + 'px';
    this.filler.style.width = Math.round(left+10) + 'px';
    var accuracy = parseFloat(this.attr.accuracy);
    if(accuracy) {
      value = Math.round(value / accuracy) * accuracy;
      if(accuracy < 1) {
        value = Math.round(value * 100) / 100;
      }
    }
    if(value != parseInt(this.input.value)) {
      this.bubbleinput.value = $ui.formatNumber(value);
      this.input.value = value;
    }
  };

  $ui.Slider.setValue = function(element, value, min, max) {
    return element.slider.setValue(value, min, max);
  };

  $ui.Slider.prototype.startBubble = function(event) {
    event.currentTarget.bubblePosition = event.pageX;
    //event.currentTarget.slider.bubbleinput.focus();
  };

  $ui.Slider.prototype.moveBubble = function(ev) {
    var slider = ev.currentTarget.slider;
    var diff = ev.pageX - ev.currentTarget.bubblePosition;
    if(diff == 0) return;

    var overflow = slider.overflow ? slider.overflow.clientWidth : 0;
    var width = slider.bar.clientWidth - overflow - 30;
    var left = parseInt(slider.bubble.style.left) || 0;

    var min = parseInt(slider.attr.value_min) || 0;
    var max = parseInt(slider.attr.value_max) || 0;
    var range = max - min;

    left += diff;
    left = left > width ? width : left;
    left = left < 0 ? 0 : left;
    var value = min + range / width * left;


    slider.bubble.style.left = Math.round(left) + 'px';
    slider.filler.style.width = Math.round(left+10) + 'px';
    var accuracy = parseFloat(slider.attr.accuracy);
    if(accuracy) {
      value = Math.round(value / accuracy) * accuracy;
      if(accuracy < 1) {
        value = Math.round(value * 100) / 100;
      }
    }
    if(value != parseFloat(slider.input.value)) {
      slider.bubbleinput.value = $ui.formatNumber(value);
      slider.input.value = value;
    }
    ev.currentTarget.bubblePosition = ev.pageX;
  };

  $ui.Slider.prototype.endBubble = function(event) {
    delete event.currentTarget.bubblePosition;
    $ui.fireEvent(event.currentTarget.slider.input, 'change');
  };

  $ui.Slider.prototype.touchBubble = function(event) {
    var slider = event.currentTarget.slider;
    slider.bubbleinput.type = 'hidden';
    slider.input.type = 'number';
    slider.input.focus();
  };

  $ui.Slider.prototype.blurInput = function(event) {
    var slider = event.currentTarget.slider;
    var value = parseInt(slider.input.value) || 0;
    var min = parseFloat(slider.attr.value_min) || 0;
    var max = parseFloat(slider.attr.value_max) || 0;
    value = value < min ? min : value;
    value = value > max ? max : value;
    slider.bubbleinput.value = $ui.formatNumber(value);
    slider.bubbleinput.type = 'text';
    slider.input.type = 'hidden';
    slider.input.value = value;

    var left = slider.getPositionByValue(value);
    slider.bubble.style.left = Math.round(left) + 'px';
    slider.filler.style.width = Math.round(left+10) + 'px';

    $ui.fireEvent(slider.input, 'change');
  };

  $ui.Slider.prototype.touchBar = function(event) {
    var slider = event.currentTarget.slider;
    var left = event.layerX;
    slider.bubble.style.left = left + 'px';
    slider.filler.style.width = (left + 10) + 'px';

    var overflow = slider.overflow ? slider.overflow.clientWidth : 0;
    var width = slider.bar.clientWidth - overflow - 30;

    var min = parseFloat(slider.attr.value_min) || 0;
    var max = parseFloat(slider.attr.value_max) || 0;
    var range = max - min;

    var value = Math.round(min + range / width * left);
    var accuracy = parseFloat(slider.attr.accuracy);
    if(accuracy) {
      value = Math.round(value / accuracy) * accuracy;
      if(accuracy < 1) {
        value = Math.round(value * 100) / 100;
      }
    }

    if(value != parseInt(slider.input.value)) {
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

  /***************************************************************************************************
   * keyboard

   * params {
   *   node - keyboard HTMLElement ul.keyboard
   *   input - input field
   *   show - function to call on show
   *   hide - function to call on hide
   * }
   **************************************************************************************************/
  $ui.Keyboard = function(params) {
    this.element = params.node;
    this.input = params.input;
    this.onShow = $a.isFunc(params.show) ? params.show : null;
    this.onHide = $a.isFunc(params.hide) ? params.hide : null;
    this.capslockEnabled = false;
    this.downcase = true;
    this.altkey = false;

    var lis = $a.all(this.element, 'li');
    for(var i=0; i < lis.length; i++) {
      lis[i].keyboard = this;
    }

    $mt.bind(lis, 'touchstart', this.touchDown);
    $mt.bind(lis, 'touchend', this.touchUp);

    this.element.keyboard = this;
  };

  $ui.Keyboard.ord = function(c) {
   return c.charCodeAt(0);
  };

  $ui.Keyboard.chr = function(o) {
    return String.fromCharCode(o);
  };

  $ui.Keyboard.types = ['symbol', 'letter', 'back', 'tab', 'capslock', 'enter', 'space', 'hidekeyboard', 'alt', 'previous', 'next'];
  $ui.Keyboard.convert = {amp: '&', lt: '<', gt: '>'};

  $ui.Keyboard.prototype = {
    show: function() {
      var self = this;
      $a.show(this.element);
      $a.show(this.element.parentNode);
      if(this.onShow) {
        this.onShow(this.element);
      } else {
        setTimeout(function() {
          $a.animate(self.element, {property: 'all', duration: '1s', timingFunction: 'ease-in-out'}, {opacity: 1});
        }, 100);
      }
      $ui.fireEvent(this.element, 'showkeyboard');
      $ui.fireEvent(this.input, 'showkeyboard');

      // select text with double touch
      $a.bind(this.input, 'dblclick', this.selectInput, true);
    },

    hide: function() {
      var element = this.element;
      if(this.onHide) {
        this.onHide(this.element)
      } else {
        $a.animate(element, {property: 'all', duration: '1s', timingFunction: 'ease-in-out'}, {opacity: 0}, true, function(event){
          if(this.style.opacity == 0) {
            $a.hide(this);
            $a.hide(this.parentNode);
          }
        });
      }
      if(this.input) {
        this.input.blur();
        // select text with double touch
        $a.unbind(this.input, 'dblclick', this.selectInput, true);
      }
      $ui.fireEvent(this.element, 'hidekeyboard');
      $ui.fireEvent(this.input, 'hidekeyboard');
    },

    pressKey: function(event) {
     for(var i=0; i < $ui.Keyboard.types.length; i++) {
       if($a.hasClass(el, $ui.Keyboard.types[i])) {
         this.keyboard[$ui.Keyboard.types[i]](this);
       }
     }
    },

    touchDown: function(event) {
      $a.addClass(this, 'pressed');
      if($a.hasClass(this, 'shift')) {
       this.keyboard.shift(this);
      } else if($a.hasClass(this, 'alt')) {
        //this.keyboard.alt(this);
      }

      for(var i=0; i < $ui.Keyboard.types.length; i++) {
       if($a.hasClass(this, $ui.Keyboard.types[i])) {
         this.keyboard[$ui.Keyboard.types[i]](this);
       }
      }

      if(this.keyboard.input) $ui.fireEvent(this.keyboard.input, 'keydown');
    },

    touchUp: function(event) {
      $a.removeClass(this, 'pressed');
      if($a.hasClass(this, 'shift')) {
        this.keyboard.shift(this);
      }
      var otherPressed = $a.all(this.parentNode, 'li.pressed');
      $a.removeClass(otherPressed, 'pressed');
      $ui.fireEvent(this.keyboard.input, 'keyup');
    },

    selectInput: function(event) {
      this.selectionStart = 0;
      this.selectionEnd = this.value.length;
    },

    insert: function(sign) {
     if(this.input.type == 'number' && ($ui.Keyboard.ord(sign) > 47 && $ui.Keyboard.ord(sign) < 58) == false) {
       return;
     }
     if(this.input.selectionStart != this.input.selectionEnd) {
       this.input.value = this.input.value.substr(0, this.input.selectionStart) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
     }

     for(key in $ui.Keyboard.convert) {
       sign = sign.replace('&' + key + ';', $ui.Keyboard.convert[key]);
     }

     this.input.value += sign;
      $ui.fireEvent(this.input, 'change');
    },

    symbol: function(li) {
     this.insert(li.innerHTML.trim());
    },

    letter: function(li) {
     this.insert(li.innerHTML.trim());
    },

    back: function(li) {
     if(this.input.selectionStart == this.input.selectionEnd) {
       this.input.value = this.input.value.substr(0, this.input.selectionStart - 1) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
     } else {
       this.input.value = this.input.value.substr(0, this.input.selectionStart) + this.input.value.substr(this.input.selectionEnd, this.input.value.length);
     }
     this.input.selectionEnd = this.input.selectionStart;
      $ui.fireEvent(this.input, 'change');
    },

    tab: function(li) {
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
    },

    capslock: function(li) {
      if(this.capslockEnabled) {
        $a.removeClass(li, 'pressedcapslock');
        this.capslockEnabled = false;
        this.shift(li);
      } else {
        $a.addClass(li, 'pressedcapslock');
        this.shift(li);
        this.capslockEnabled = true;
      }
    },

    getInputElement: function(input, next) {
      var index = 0;
      for(var i=0; i < input.form.elements.length; i++) {
        var el = this.input.form.elements[i];
        if(el == input) {
          index = i;
          break;
        }
      }
        index += next;
      while(index >= 0 && index < input.form.elements.length) {
        var el = input.form.elements[index];
        if(['hidden', 'submit', 'button', 'checkbox', 'radio'].indexOf(el.type) !== -1 || el.disabled == true || el.nodeName == 'SELECT') {
          index += next;
          continue;
        }
        return el;
      }
      return input;
    },

    previous: function(li) {
      $a.unbind(this.input, 'dblclick', this.selectInput, true);
      this.input = this.getInputElement(this.input, -1);
      $a.bind(this.input, 'dblclick', this.selectInput, true);
      $ui.fireEvent(this.input, 'showkeyboard');
      this.input.focus();
    },

    next: function(li) {
      $a.unbind(this.input, 'dblclick', this.selectInput, true);
      this.input = this.getInputElement(this.input, 1);
      $a.bind(this.input, 'dblclick', this.selectInput, true);
      $ui.fireEvent(this.input, 'showkeyboard');
      this.input.focus();
    },

    enter: function(li) {
     if((this.input.nodeName == 'INPUT' || this.input.nodeName == 'BUTTON') && this.input.form) {
       //this.input.form.submit();
        //$ui.fireEvent(this.input.form, 'submit');
       this.hide();
     } else if(this.input.nodeName == 'TEXTAREA') {
       this.insert($ui.Keyboard.chr(10));
     }
    },

    shift: function(li) {
      if(this.capslockEnabled) return;
      var symbols = $a.all(this.element, 'li.symbol');
      for(var i=0; i < symbols.length; i++) {
        symbols[i].innerHTML = this.downcase == true ? $a.data(symbols[i], 'shift') : $a.data(symbols[i], 'symbol');
      }
      var letters = $a.all(this.element, 'li.letter');
      for(var i=0; i < letters.length; i++) {
        letters[i].innerHTML = this.downcase == true ? $a.data(letters[i], 'letter').toUpperCase() : $a.data(letters[i], 'letter');
      }
      this.downcase = !this.downcase;
    },

    alt: function(li) {
      var symbols = $a.all(this.element, 'li.symbol');
      for(var i=0; i < symbols.length; i++) {
        symbols[i].innerHTML = this.altkey == true ? $a.data(symbols[i], 'alt') : $a.data(symbols[i], 'symbol');
      }
      var letters = $a.all(this.element, 'li.letter');
      for(var i=0; i < letters.length; i++) {
        letters[i].innerHTML = this.altkey == true ? $a.data(letters[i], 'alt') : $a.data(letters[i], 'letter');
      }
      this.altkey = !this.altkey;
    },

    space: function(li) {
     this.insert(' ');
    },

    hidekeyboard: function(li) {
     this.hide();
    }
  }

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
    if(input.value != $a.data(event.currentTarget, 'value')) {
      input.value = $a.data(event.currentTarget, 'value');
      $ui.fireEvent(input, 'change');
    }
  };

  /**
   * autocomplete for input fields
   *
   * node - htmlelement
   * source - url to source
   * callback - optional / function(object) {} / object { value: 1, desc: 'element1' }
   * min - optional / length of min search text default 3
   * limit - optional / count of results show default 10
   */
  var autocomplete_request = null;
  $ui.autocomplete = function(params) {
    var node = params.node;
    var source = params.source;
    var callback = params.callback;
    var min = params.min || 3;
    var limit = params.limit || 10;
    if(node.nodeName != 'INPUT') return; // just work with input fields
    var handlePress = function(evt) {
      if(this._autocomplete_value == this.value) return;

      this._autocomplete_value = this.value;
      var input = this;
      if(this.value.length < min) {
        if(input._ac) {
          $a.css(input._ac, {display: 'none'});
        }
        return;
      }
      if(autocomplete_request) {
        autocomplete_request.abort();
      }
      autocomplete_request = $a.ajax({url: source, data: {search: this.value, limit: limit}, onsuccess: function(request) {
        autocomplete_request = null;
        // exit, field does not have focus anymore
        if( ! node.hasFocus) return;
        // parse response
        var obj = JSON.parse(request.responseText);
        // response have wrong format
        if( ! $a.isObj(obj) || ! $a.isArr(obj.data) || ! $a.isNum(obj.count)) {
          throw 'type of result is not an array';
        }
        // exit if response does have an empty result
        if(obj.count == 0) {
          if(input._ac) {
            $a.css(input._ac, {display: 'none'});
          }
          return;
        }

        var ul = null;
        if( ! input._ac ) {
          input._ac = document.createElement('div');
          $a.css(input._ac, { left: input.offsetLeft + 'px', top: input.offsetTop + input.clientHeight + 'px', position: 'absolute', width: input.clientWidth + 'px' });

          $a.addClass(input._ac, 'autocompleter');
          ul = document.createElement('ul');
          input._ac.appendChild(ul);
        } else {
          ul = $a.first(input._ac, 'ul');
        }

        var all = $a.all(ul, 'li');
        for(var i=0; i < all.length; i++) {
          ul.removeChild(all[i]);
        }

        obj.data.forEach(function(o, i) {
          if($a.isFunc(callback)) {
            callback.call(ul, o);
          } else {
            var li = document.createElement('li');
            li.innerHTML = o.desc;
            $a.data(li, 'value', o.value);
            ul.appendChild(li);
          }
        });

        $a.bind($a.all(ul, 'li'), 'mousedown', function(evt) {
          self._autocomplete_value = node.value = $a.data(this, 'value');
          $a.css(node._ac, {display: 'none'});
          return;
        });

        if(obj.count > obj.data.length) {
          var li = document.createElement('li');
          li.innerHTML = obj.data.length + ' von ' + obj.count
          $a.addClass(li, 'info');
          ul.appendChild(li);
        }
        $a.css(input._ac, {display: ''});
        var next = node.nextElementSibling;
        if(next) {
          node.parentNode.insertBefore(input._ac, next);
        } else {
          node.parentNode.appendChild(input._ac);
        }
      }})
    };

    var handleArrows = function(evt) {
      // key up 38
      // key down 40
      // key enter 13
      if(this._ac && (evt.keyCode == 38 || evt.keyCode == 40)) {
        evt.preventDefault();
        var el = null;
        var active = $a.first(this._ac, 'li[data-value].active');
        if(!active) {
          el = $a.first(this._ac, 'li[data-value]:first-child');
        }
        if(active && evt.keyCode == 40) {
          el = active.nextElementSibling;
        } else if(active && evt.keyCode == 38) {
          el = active.previousElementSibling;
        }
        if(el && $a.data(el, 'value')) {
          if(active) $a.removeClass(active, 'active');
          $a.addClass(el, 'active');
        }
        return false;
      } else if(this._ac && evt.keyCode == 13) {
        evt.preventDefault();
        var active = $a.first(this._ac, 'li[data-value].active');
        if(active) {
          this._autocomplete_value = this.value = $a.data(active, 'value');
          $a.css(this._ac, {display: 'none'});
          return;
        }
      } if(this._ac && evt.keyCode == 27 /*esc*/) {
        evt.preventDefault();
        $a.css(this._ac, {display: 'none'});
        return;
      }
    };

    $a.bind(node, 'keydown', handleArrows);
    $a.bind(node, 'keyup', handlePress);
    //$a.bind(node, 'keypress', handlePress);
    $a.bind(node, 'focus', function(evt) {
      this.hasFocus = true;
    })
    $a.bind(node, 'blur', function(evt) {
      this.hasFocus = false;
      if(this._ac) {
        $a.css(this._ac, {display: 'none'});
      }
    });
  };
})(this._anyNoConflict, this._anyMtNoConflict);