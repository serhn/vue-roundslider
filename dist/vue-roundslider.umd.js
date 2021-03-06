(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueRoundslider = {}));
}(this, (function (exports) { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
    props: {
      duration: {
        type: Number,
        default: 100,
      },
      diametr: {
        type: Number,
        default: 100,
      },
      widthCircle: {
        type: Number,
        default: 7,
      },
      colorLine: {
        type: String,
        default: "green",
      },
      position: {
        type: Number,
        default: 0,
      },
      onPosition: {
        type: Function,
        default: function () {},
      },
      onMouseMoveCenter: {
        type: Function,
        default: function () {},
      },
      onMouseClickCenter: {
        type: Function,
        default: function () {},
      },
      onMouseMovePosition: {
        type: Function,
        default: function () {},
      },
      formatTime: {
        type: Boolean,
        default: true,
      },
    },
    data: function data() {
      return {
        timePassed: 0,
        cursorPointer: false,
      };
    },

    computed: {
      radius: function radius() {
        return 50 - Math.ceil(this.widthCircle / 2);
      },
      width: function width() {
        return this.diametr;
      },
      height: function height() {
        return this.diametr;
      },
      circleDasharray: function circleDasharray() {
        return ((this.timeFraction) + " " + (this.fullDashArray));
      },
      fullDashArray: function fullDashArray() {
        return Math.round(this.radius * Math.PI * 2);
      },
      fontSize: function fontSize() {
        return this.width / 5;
      },

      formattedTimeStep: function formattedTimeStep() {
        if (this.formatTime) {
          var timePassed = this.position;
          var minutes = Math.floor(timePassed / 60);
          var seconds = timePassed % 60;

          if (seconds < 10) {
            seconds = "0" + seconds;
          }

          return (minutes + ":" + seconds);
        }
        return this.position;
      },

      timeFraction: function timeFraction() {
        var rawTimeFraction = this.position / this.duration;
        return rawTimeFraction * this.fullDashArray.toFixed(0);
      },

      radiusMin: function radiusMin() {
        this.radius;
        return Math.ceil(
          ((this.radius - this.widthCircle / 2) * this.diametr) / 100
        );
      },
      radiusMax: function radiusMax() {
        return Math.ceil(this.diametr / 2 - 1);
      },
    },

    watch: {
      // position(newValue) {
      //},
    },

    mounted: function mounted() {},

    methods: {
      moveCircle: function moveCircle(event) {
        var ref = this.coordinatesStrndartXY(event);
        var xClick = ref[0];
        var yClick = ref[1];
        var radiusMove = this.getRadius(xClick, yClick);
        if (radiusMove >= this.radiusMin && radiusMove <= this.radiusMax) {
          this.cursorPointer = true;
          this.onMouseMovePosition(event);
        } else if (radiusMove < this.radiusMin) {
          this.cursorPointer = true;
          this.onMouseMoveCenter(event);
        } else {
          this.cursorPointer = false;
        }
      },
      clickCircle: function clickCircle(event) {
        var ref = this.coordinatesStrndartXY(event);
        var xClick = ref[0];
        var yClick = ref[1];
        var radiusClick = this.getRadius(xClick, yClick);
        if (radiusClick >= this.radiusMin && radiusClick <= this.radiusMax) {
          var lenDiametr = Math.round(Math.PI * 2 * radiusClick);
          var lenCrc = this.getLen(xClick, yClick, radiusClick);
          var position = Math.round((lenCrc / lenDiametr) * this.duration);
          this.onPosition(position);
        } else if (radiusClick < this.radiusMin) {
          this.onMouseClickCenter(event);
        }
      },
      coordinatesStrndartXY: function coordinatesStrndartXY(event) {
        var xClick = event.layerX - Math.floor(this.width / 2);
        var yClick = (event.layerY - Math.floor(this.height / 2)) * -1;

        return [xClick, yClick];
      },
      getLen: function getLen(x, y, radius) {
        var xAbs = Math.abs(x);
        var yAbs = Math.abs(y);

        if (x >= 0 && y >= 0) {
          var len = Math.round(Math.atan(xAbs / yAbs) * radius);
          return len;
        }
        if (x >= 0 && y < 0) {
          var len = Math.round(Math.atan(yAbs / xAbs) * radius);
          return Math.round((radius * Math.PI) / 2) + len;
        }
        if (x < 0 && y < 0) {
          var len = Math.round(Math.atan(xAbs / yAbs) * radius);
          return Math.round(radius * Math.PI) + len;
        }
        if (x < 0 && y >= 0) {
          var len = Math.round(Math.atan(yAbs / xAbs) * radius);
          return Math.round(radius * (Math.PI + Math.PI / 2)) + len;
        }
      },
      getRadius: function getRadius(x, y) {
        return Math.round(Math.sqrt(x * x + y * y));
      },
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "base-timer",
        style: "width: " + _vm.width + "px; height: " + _vm.height + "px;"
      },
      [
        _c(
          "svg",
          {
            staticClass: "base-timer__svg",
            attrs: { viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg" }
          },
          [
            _c("g", { staticClass: "base-timer__circle" }, [
              _c("circle", {
                staticClass: "base-timer__path-elapsed",
                style: "stroke-width: " + _vm.widthCircle + "px;",
                attrs: { cx: "50", cy: "50", r: _vm.radius }
              }),
              _vm._v(" "),
              _c("path", {
                staticClass: "base-timer__path-remaining",
                style:
                  "stroke-width: " +
                  _vm.widthCircle +
                  "px; color:" +
                  _vm.colorLine +
                  ";",
                attrs: {
                  "stroke-dasharray": _vm.circleDasharray,
                  d:
                    "M 50, 50 m -" +
                    _vm.radius +
                    ", 0 a " +
                    _vm.radius +
                    "," +
                    _vm.radius +
                    " 0 1,0 " +
                    _vm.radius * 2 +
                    ",0 a " +
                    _vm.radius +
                    "," +
                    _vm.radius +
                    " 0 1,0 -" +
                    _vm.radius * 2 +
                    ",0"
                }
              })
            ])
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "base-timer__label",
            class: { cursorPointer: _vm.cursorPointer },
            style:
              "width: " +
              _vm.width +
              "px; height: " +
              _vm.height +
              "px; font-size: " +
              _vm.fontSize +
              "px;",
            on: { click: _vm.clickCircle, mousemove: _vm.moveCircle }
          },
          [_vm._t("default", [_vm._v(_vm._s(_vm.formattedTimeStep))])],
          2
        )
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-ee2aa3ca_0", { source: ".cursorPointer[data-v-ee2aa3ca] {\n  cursor: pointer;\n}\n.base-timer[data-v-ee2aa3ca] {\n  position: relative;\n}\n.base-timer__svg[data-v-ee2aa3ca] {\n  transform: scaleX(-1);\n}\n.base-timer__circle[data-v-ee2aa3ca] {\n  fill: none;\n  stroke: none;\n}\n.base-timer__path-elapsed[data-v-ee2aa3ca] {\n  stroke: grey;\n}\n.base-timer__path-remaining[data-v-ee2aa3ca] {\n  stroke-linecap: round;\n  transform: rotate(90deg);\n  transform-origin: center;\n  transition: 1s linear all;\n  fill-rule: nonzero;\n  stroke: currentColor;\n}\n.base-timer__label[data-v-ee2aa3ca] {\n  position: absolute;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/*# sourceMappingURL=vue-roundslider.vue.map */", map: {"version":3,"sources":["/Users/serh/doc/projects/vue-roundslider/src/vue-roundslider.vue","vue-roundslider.vue"],"names":[],"mappings":"AA0MA;EACA,eAAA;ACzMA;AD2MA;EACA,kBAAA;ACxMA;AD2MA;EACA,qBAAA;ACzMA;AD4MA;EACA,UAAA;EACA,YAAA;AC1MA;AD6MA;EACA,YAAA;AC3MA;AD8MA;EACA,qBAAA;EACA,wBAAA;EACA,wBAAA;EACA,yBAAA;EACA,kBAAA;EACA,oBAAA;AC5MA;AD+MA;EACA,kBAAA;EACA,MAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;AC7MA;;AAEA,8CAA8C","file":"vue-roundslider.vue","sourcesContent":["<template>\n  <div class=\"base-timer\" :style=\"'width: '+width+'px; height: '+height+'px;'\">\n    <!-- circleDasharray -->\n    <svg class=\"base-timer__svg\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\">\n      <g class=\"base-timer__circle\">\n        <circle\n          class=\"base-timer__path-elapsed\"\n          cx=\"50\"\n          cy=\"50\"\n          :r=\"radius\"\n          :style=\"'stroke-width: '+widthCircle+'px;'\"\n        />\n        <path\n          :stroke-dasharray=\"circleDasharray\"\n          class=\"base-timer__path-remaining\"\n          :style=\"'stroke-width: '+widthCircle+'px; color:'+colorLine+';'\"\n          :d=\"'M 50, 50 m -'+radius+', 0 a '+radius+','+radius+' 0 1,0 '+(radius*2)+',0 a '+radius+','+radius+' 0 1,0 -'+(radius*2)+',0'\"\n        />\n      </g>\n    </svg>\n    <div\n      :style=\"'width: '+width+'px; height: '+height+'px; font-size: '+fontSize+'px;'\"\n      :class=\"{'cursorPointer':cursorPointer}\"\n      @click=\"clickCircle\"\n      @mousemove=\"moveCircle\"\n      class=\"base-timer__label\"\n    >\n      <slot>{{ formattedTimeStep }}</slot>\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  props: {\n    duration: {\n      type: Number,\n      default: 100,\n    },\n    diametr: {\n      type: Number,\n      default: 100,\n    },\n    widthCircle: {\n      type: Number,\n      default: 7,\n    },\n    colorLine: {\n      type: String,\n      default: \"green\",\n    },\n    position: {\n      type: Number,\n      default: 0,\n    },\n    onPosition: {\n      type: Function,\n      default: function () {},\n    },\n    onMouseMoveCenter: {\n      type: Function,\n      default: function () {},\n    },\n    onMouseClickCenter: {\n      type: Function,\n      default: function () {},\n    },\n    onMouseMovePosition: {\n      type: Function,\n      default: function () {},\n    },\n    formatTime: {\n      type: Boolean,\n      default: true,\n    },\n  },\n  data() {\n    return {\n      timePassed: 0,\n      cursorPointer: false,\n    };\n  },\n\n  computed: {\n    radius() {\n      return 50 - Math.ceil(this.widthCircle / 2);\n    },\n    width() {\n      return this.diametr;\n    },\n    height() {\n      return this.diametr;\n    },\n    circleDasharray() {\n      return `${this.timeFraction} ${this.fullDashArray}`;\n    },\n    fullDashArray() {\n      return Math.round(this.radius * Math.PI * 2);\n    },\n    fontSize() {\n      return this.width / 5;\n    },\n\n    formattedTimeStep() {\n      if (this.formatTime) {\n        const timePassed = this.position;\n        const minutes = Math.floor(timePassed / 60);\n        let seconds = timePassed % 60;\n\n        if (seconds < 10) {\n          seconds = `0${seconds}`;\n        }\n\n        return `${minutes}:${seconds}`;\n      }\n      return this.position;\n    },\n\n    timeFraction() {\n      const rawTimeFraction = this.position / this.duration;\n      return rawTimeFraction * this.fullDashArray.toFixed(0);\n    },\n\n    radiusMin() {\n      this.radius;\n      return Math.ceil(\n        ((this.radius - this.widthCircle / 2) * this.diametr) / 100\n      );\n    },\n    radiusMax() {\n      return Math.ceil(this.diametr / 2 - 1);\n    },\n  },\n\n  watch: {\n    // position(newValue) {\n    //},\n  },\n\n  mounted() {},\n\n  methods: {\n    moveCircle(event) {\n      var [xClick, yClick] = this.coordinatesStrndartXY(event);\n      var radiusMove = this.getRadius(xClick, yClick);\n      if (radiusMove >= this.radiusMin && radiusMove <= this.radiusMax) {\n        this.cursorPointer = true;\n        this.onMouseMovePosition(event);\n      } else if (radiusMove < this.radiusMin) {\n        this.cursorPointer = true;\n        this.onMouseMoveCenter(event);\n      } else {\n        this.cursorPointer = false;\n      }\n    },\n    clickCircle(event) {\n      var [xClick, yClick] = this.coordinatesStrndartXY(event);\n      var radiusClick = this.getRadius(xClick, yClick);\n      if (radiusClick >= this.radiusMin && radiusClick <= this.radiusMax) {\n        var lenDiametr = Math.round(Math.PI * 2 * radiusClick);\n        var lenCrc = this.getLen(xClick, yClick, radiusClick);\n        const position = Math.round((lenCrc / lenDiametr) * this.duration);\n        this.onPosition(position);\n      } else if (radiusClick < this.radiusMin) {\n        this.onMouseClickCenter(event);\n      }\n    },\n    coordinatesStrndartXY(event) {\n      var xClick = event.layerX - Math.floor(this.width / 2);\n      var yClick = (event.layerY - Math.floor(this.height / 2)) * -1;\n\n      return [xClick, yClick];\n    },\n    getLen(x, y, radius) {\n      var xAbs = Math.abs(x);\n      var yAbs = Math.abs(y);\n\n      if (x >= 0 && y >= 0) {\n        var len = Math.round(Math.atan(xAbs / yAbs) * radius);\n        return len;\n      }\n      if (x >= 0 && y < 0) {\n        var len = Math.round(Math.atan(yAbs / xAbs) * radius);\n        return Math.round((radius * Math.PI) / 2) + len;\n      }\n      if (x < 0 && y < 0) {\n        var len = Math.round(Math.atan(xAbs / yAbs) * radius);\n        return Math.round(radius * Math.PI) + len;\n      }\n      if (x < 0 && y >= 0) {\n        var len = Math.round(Math.atan(yAbs / xAbs) * radius);\n        return Math.round(radius * (Math.PI + Math.PI / 2)) + len;\n      }\n    },\n    getRadius(x, y) {\n      return Math.round(Math.sqrt(x * x + y * y));\n    },\n  },\n};\n</script>\n\n<style scoped lang=\"scss\">\n.cursorPointer {\n  cursor: pointer;\n}\n.base-timer {\n  position: relative;\n  // background-color: aqua;\n\n  &__svg {\n    transform: scaleX(-1);\n  }\n\n  &__circle {\n    fill: none;\n    stroke: none;\n  }\n\n  &__path-elapsed {\n    stroke: grey;\n  }\n\n  &__path-remaining {\n    stroke-linecap: round;\n    transform: rotate(90deg);\n    transform-origin: center;\n    transition: 1s linear all;\n    fill-rule: nonzero;\n    stroke: currentColor;\n  }\n\n  &__label {\n    position: absolute;\n    top: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n}\n</style>\n",".cursorPointer {\n  cursor: pointer;\n}\n\n.base-timer {\n  position: relative;\n}\n.base-timer__svg {\n  transform: scaleX(-1);\n}\n.base-timer__circle {\n  fill: none;\n  stroke: none;\n}\n.base-timer__path-elapsed {\n  stroke: grey;\n}\n.base-timer__path-remaining {\n  stroke-linecap: round;\n  transform: rotate(90deg);\n  transform-origin: center;\n  transition: 1s linear all;\n  fill-rule: nonzero;\n  stroke: currentColor;\n}\n.base-timer__label {\n  position: absolute;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/*# sourceMappingURL=vue-roundslider.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-ee2aa3ca";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  // import vue component

  // Declare install function executed by Vue.use()
  function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component('VueRoundslider', __vue_component__);
  }

  // Create module definition for Vue.use()
  var plugin = {
    install: install
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.default = __vue_component__;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
