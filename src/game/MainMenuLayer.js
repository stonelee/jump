import * as ui from 'tinyjs-plugin-ui';
import StartLayer from './StartLayer';

class MainMenuLayer extends Tiny.Container {
  constructor() {
    super();

    const { width, height } = Tiny.WIN_SIZE;

    // Logo
    this.logo = Tiny.Sprite.fromImage(Tiny.resources.logoPNG);
    this.logo.setAnchor(0.5, 0);
    this.logo.setPosition(width / 2, 40);

    // 开始按钮
    const startBtn = new ui.Button({
      background: Tiny.Sprite.fromFrame('tileset-vendor-start.png'),
      active: {
        scale: 1.4,
        callback: this.onReady,
      },
    });
    startBtn.setPivot(startBtn.width / 2, startBtn.height / 2);
    startBtn.setPosition(width / 2, height - 260);

    this.addChild(this.logo, startBtn);

    this.on('transitionend', function () {
      this.startAction();
    });
  }

  onReady() {
    // console.log('--- start ---');
    Tiny.app.replaceScene(new StartLayer(), 'SlideInB', 800);
  }

  startAction() {
    const { width, height } = Tiny.WIN_SIZE;
    const action = Tiny.MoveTo(1000, Tiny.point(width / 2, height / 2));
    action.setEasing(Tiny.TWEEN.Easing.Exponential.Out);

    this.logo.runAction(Tiny.RepeatForever(Tiny.Back(action), 1200));
  }
}

export default MainMenuLayer;
