<script setup>
import { computed, reactive, ref } from 'vue'
import {  onTick, useScreen } from 'vue3-pixi'


// const joystick = new Joystick({
//   // outer: Sprite.from("outer"), // ("images/joystick.png")
//   // inner: Sprite.from("inner"), // ("images/joystick-handle.png")

//   outerScale: { x: 0.5, y: 0.5 },
//   innerScale: { x: 0.8, y: 0.8 },

//   onChange: (data) => {
//     console.log(data.angle); // Angle from 0 to 360
//     console.log(data.direction); // 'left', 'top', 'bottom', 'right', 'top_left', 'top_right', 'bottom_left' or 'bottom_right'.
//     console.log(data.power); // Power from 0 to 1
//   },

//   onStart: () => {
//     console.log('start')
//   },

//   onEnd: () => {
//     console.log('end')
//   },
// });

// const eventName = ref("none");
const stop = ref(false);
const speed = ref(1);
// const texture = Texture.from('https://pixijs.com/assets/button.png')



const screen = useScreen();

const maskRef = ref();
const position = reactive({ x: 310, y: 190 });
const target = reactive({ x: 0, y: 0 });

const full = computed(() => ({
  x: screen.value.width / 2,
  y: screen.value.height / 2,
  width: screen.value.width,
  height: screen.value.height,
  anchor: 0.5
}));

function reset() {
  target.x = Math.floor(Math.random() * screen.value.width);
  target.y = Math.floor(Math.random() * screen.value.height);
}



onTick(() => {
  if (!stop.value) {
    position.x += (target.x - position.x) * 0.03 * speed.value;
    position.y += (target.y - position.y) * 0.03 * speed.value;
    if (Math.abs(position.x - target.x) < 1) reset();
  }
});




const bunnies = reactive([
  { position: { x: 300, y: 300 }, move: false },
  { position: { x: 600, y: 300 }, move: false },
  { position: { x: 300, y: 600 }, move: false },
  { position: { x: 600, y: 600 }, move: false },
  { position: { x: 300, y: 900 }, move: false },
  { position: { x: 600, y: 900 }, move: false },
]);

const getRandomBunny = () => Math.floor(Math.random() * bunnies.length);

const startInterval = setInterval(() => {
  const randomBunny = getRandomBunny();
  pushAndDownBunny(randomBunny);
  }, 2000);


const pushAndDownBunny = (randomBunny) => {
  const { position } = bunnies[randomBunny];
  // bunnies[randomBunny].move = true,
  position.y -= 100
  setTimeout(() => {
    // bunnies[randomBunny].move = false,
    position.y += 100
  }, 500);
};

function eventHandler(bunny, val) {
  if (val) {
    clearInterval(startInterval);
  }
}


// reset();
</script>

<template>
  <sprite texture="https://pixijs.com/assets/bg_rotate.jpg" v-bind="full"/>
  <sprite
    v-for="(bunny, idx) in bunnies"
    :key="bunny"
    ref="maskRef"
    texture="https://pixijs.com/assets/bunny.png"
    :position="bunny.position"
    :scale="5"
    :anchor="1"
    @click="eventHandler(idx, bunny.move)"
  />
  <text
      :x="800" :y="10"
      :style="{
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
      }"
    >
      Уровень {{speed}}
  </text>
  <template v-if="stop">
    <text
      :x="screen.width / 2 - 130" :y="210"
      :style="{
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
      }"
    >
      Это ПОБЕДА!
    </text>
    <sprite texture="https://pixijs.com/assets/bg_plane.jpg"
      :x="screen.width / 2 - 150"
      :y="screen.height / 2 - 20" width="320" height="80"
      cursor="pointer"
      @click="eventHandler(true)"
    />
    <text
      :x="screen.width / 2 - 120"
      :y="screen.height / 2"
      :style="{
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        strokeThickness: 5,
        lineJoin: 'round',
      }"
    >
      Увеличить скорость
    </text>
  </template>


</template>
