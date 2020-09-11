<template>
  <div>
    <VueRoundslider
      :duration="duration"
      :position="position"
      :diametr="300"
      :widthCircle="10"
      :colorLine="colorLine"
      :onPosition="eventPosition"
      :onMouseMoveCenter="eventMouseMoveCenter"
      :onMouseClickCenter="eventMouseClickCenter"
      :onMouseMovePosition="eventMouseMovePosition"
    ></VueRoundslider>
  </div>
</template>

<script>
import VueRoundslider from "./../src/vue-roundslider";
const COLOR_LINE_DEFAULT = "green";
const COLOR_LINE_END = "blue";
export default {
  data: () => ({
    duration: 20,
    position: 5,
    colorLine: COLOR_LINE_DEFAULT,
    timerInterval: null,
    mouseMoveCenter: false,
  }),
  watch: {
    position: function (val) {
      if (val >= this.duration) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.colorLine = COLOR_LINE_END;
      } else {
        this.colorLine = COLOR_LINE_DEFAULT;

        if (!this.timerInterval) {
          this.positionInterval();
        }
      }
    },
    mouseMoveCenter: function (val) {
      if (val === true) {
        console.log("Mouse over center");
      } else {
        console.log("Mouse out center");
      }
    },
  },
  mounted() {
    this.positionInterval();
  },
  components: {
    VueRoundslider,
  },
  methods: {
    positionInterval() {
      this.timerInterval = setInterval(() => (this.position += 1), 1000);
    },
    eventPosition(position) {
      this.position = position;
    },
    eventMouseMoveCenter(event) {
      this.mouseMoveCenter = true;
    },
    eventMouseMovePosition(event) {
      this.mouseMoveCenter = false;
    },
    eventMouseClickCenter(event) {
      console.log("Click Center");
    },
  },
};
</script>

<style scoped lang="scss">
</style>
