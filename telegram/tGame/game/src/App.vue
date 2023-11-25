<template>

  <Application ref="app" :width="1000" :height="900" :background-alpha="0">

    <demo />
  </Application>
</template>

<script>
import { defineComponent } from "vue";
import { Application } from 'vue3-pixi'
import Demo from "./DemoComp.vue";
// import { PIXIController, BUTTON, PLAYER } from 'pixi-controller';

// const app = new Application();
// document.body.appendChild(app.view);
// console.log(app);
// app.loader.add('example', 'example.jpg').load((loader, resources) => {
//     const Controller = new PIXIController();
//     const example = new Sprite(resources.example.texture);

//     app.stage.addChild(example);

//     Controller.Mouse.prevent(BUTTON.RIGHT);

//     app.ticker.add(() => {
//       if(Controller.Mouse.isButtonDown(BUTTON.LEFT)) {
//         console.log('left')
//       }

//       if(Controller.Mouse.isButtonDown(BUTTON.RIGHT)) {
//         console.log('right')
//       }

//       if (Controller.Keyboard.isKeyDown(...PLAYER.LEFT))
//         example.x -= 1;
//       if (Controller.Keyboard.isKeyDown(...PLAYER.RIGHT))
//         example.x += 1;
//       if (Controller.Keyboard.isKeyDown(...PLAYER.UP))
//         example.y -= 1;
//       if (Controller.Keyboard.isKeyDown(...PLAYER.DOWN))
//         example.y += 1;

//       Controller.update();
//     });
// });


export default defineComponent({
  components: {
    Demo,
    Application,
  },
  data() {
    return {
      app: null,
    };
  },

});
</script>
