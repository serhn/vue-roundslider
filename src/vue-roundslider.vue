<template>
  <div class="base-timer" :style="'width: '+width+'px; height: '+height+'px;'">
    <!-- circleDasharray -->
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle
          class="base-timer__path-elapsed"
          cx="50"
          cy="50"
          :r="radius"
          :style="'stroke-width: '+widthCircle+'px;'"
        />
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          :style="'stroke-width: '+widthCircle+'px; color:'+colorLine+';'"
          :d="'M 50, 50 m -'+radius+', 0 a '+radius+','+radius+' 0 1,0 '+(radius*2)+',0 a '+radius+','+radius+' 0 1,0 -'+(radius*2)+',0'"
        />
      </g>
    </svg>
    <div
      :style="'width: '+width+'px; height: '+height+'px; font-size: '+fontSize+'px;'"
      :class="{'cursorPointer':cursorPointer}"
      @click="clickCircle"
      @mousemove="moveCircle"
      class="base-timer__label"
    >
      <slot>{{ formattedTimeStep }}</slot>
    </div>
  </div>
</template>

<script>
export default {
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
  data() {
    return {
      timePassed: 0,
      cursorPointer: false,
    };
  },

  computed: {
    radius() {
      return 50 - Math.ceil(this.widthCircle / 2);
    },
    width() {
      return this.diametr;
    },
    height() {
      return this.diametr;
    },
    circleDasharray() {
      return `${this.timeFraction} ${this.fullDashArray}`;
    },
    fullDashArray() {
      return Math.round(this.radius * Math.PI * 2);
    },
    fontSize() {
      return this.width / 5;
    },

    formattedTimeStep() {
      if (this.formatTime) {
        const timePassed = this.position;
        const minutes = Math.floor(timePassed / 60);
        let seconds = timePassed % 60;

        if (seconds < 10) {
          seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
      }
      return this.position;
    },

    timeFraction() {
      const rawTimeFraction = this.position / this.duration;
      return rawTimeFraction * this.fullDashArray.toFixed(0);
    },

    radiusMin() {
      this.radius;
      return Math.ceil(
        ((this.radius - this.widthCircle / 2) * this.diametr) / 100
      );
    },
    radiusMax() {
      return Math.ceil(this.diametr / 2 - 1);
    },
  },

  watch: {
    // position(newValue) {
    //},
  },

  mounted() {},

  methods: {
    moveCircle(event) {
      var [xClick, yClick] = this.coordinatesStrndartXY(event);
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
    clickCircle(event) {
      var [xClick, yClick] = this.coordinatesStrndartXY(event);
      var radiusClick = this.getRadius(xClick, yClick);
      if (radiusClick >= this.radiusMin && radiusClick <= this.radiusMax) {
        var lenDiametr = Math.round(Math.PI * 2 * radiusClick);
        var lenCrc = this.getLen(xClick, yClick, radiusClick);
        const position = Math.round((lenCrc / lenDiametr) * this.duration);
        this.onPosition(position);
      } else if (radiusClick < this.radiusMin) {
        this.onMouseClickCenter(event);
      }
    },
    coordinatesStrndartXY(event) {
      var xClick = event.layerX - Math.floor(this.width / 2);
      var yClick = (event.layerY - Math.floor(this.height / 2)) * -1;

      return [xClick, yClick];
    },
    getLen(x, y, radius) {
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
    getRadius(x, y) {
      return Math.round(Math.sqrt(x * x + y * y));
    },
  },
};
</script>

<style scoped lang="scss">
.cursorPointer {
  cursor: pointer;
}
.base-timer {
  position: relative;
  // background-color: aqua;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke: grey;
  }

  &__path-remaining {
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;
  }

  &__label {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
