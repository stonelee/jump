import MainMenuLayer from './MainMenuLayer';

class StartLayer extends Tiny.Container {
  constructor() {
    super();

    const { width, height } = Tiny.WIN_SIZE;

    const txtBtn = new Tiny.Text('⇪⇪\n返回', {
      fontFamily: 'Arial',
      fontSize: 48,
      align: 'center',
      fill: 'darkslategray',
    });
    txtBtn.setAnchor(0.5, 0);
    txtBtn.setPosition(width / 2, 20);
    txtBtn.setEventEnabled(true);
    txtBtn.on('tap', this.backToMainMenu);
    // 蜜蜂
    const hero = new Tiny.AnimatedSprite([
      Tiny.Texture.fromFrame('tileset-hero-1.png'),
      Tiny.Texture.fromFrame('tileset-hero-2.png'),
    ]);
    hero.animationSpeed = 0.05;
    hero.setAnchor(0.5);
    hero.setPosition(width / 2, height / 2);
    hero.play();

    this.addChild(txtBtn, hero);
  }

  backToMainMenu() {
    Tiny.app.replaceScene(new MainMenuLayer(), 'SlideInT', 800);
  }
}

export default StartLayer;
