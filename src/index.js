import * as resources from './game/resources';
import MainMenuLayer from './game/MainMenuLayer';

require('./css/index.less');

Tiny.app = new Tiny.Application({
  showFPS: true,
  referWidth: 375,
  dpi: 2,
  renderType: Tiny.RENDERER_TYPE.CANVAS,
  renderOptions: {
    backgroundColor: 0xbbbbbb,
  },
});

const main = {
  init () {
    console.log('init');
    Tiny.resources = resources;
    this.resourceLoad();
  },
  resourceLoad () {
    const progress = document.getElementById('progress');
    const percent = document.getElementById('percent');

    Tiny.Loader.run({
      resources: Object.values(resources),
      onProgress (pre, res) {
        // console.log('percent:', pre + '%', res.name);
        const num = ~~pre;
        //更新UI
        percent.innerHTML = `${num}%`;
        progress.style.width = `${num}%`;
      },
      onAllComplete () {
        // console.log('all complete');
        //clear DOM
        const body = document.body;
        body.removeChild(percent);
        body.removeChild(progress.parentNode);

        const mainMenuLayer = new MainMenuLayer();
        Tiny.app.run(mainMenuLayer);
        mainMenuLayer.emit('transitionend');
      },
    });
  },
};
main.init();

// 页面压后台，让游戏停下来
document.addEventListener('pause', function (e) {
  Tiny.app.pause();
}, false);

// 页面恢复运行，让游戏继续
document.addEventListener('resume', function (e) {
  Tiny.app.resume();
}, false);
