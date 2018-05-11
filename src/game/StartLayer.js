import { caleRelateTargetPos, setPivot } from './utils';

class StartLayer extends Tiny.Container {
  constructor() {
    super();

    this.ant = this.createAnt();
    this.currentBox = this.createBox();
    // 将蚂蚁放到 box 组中
    this.currentBox.addChild(this.ant);
    // 位置也得调整下
    this.ant.setPosition(100, 50);

    this.deltaX = 300; // 每次跳跃，向右移动 300
    this.isJumping = false; // 在跳的过程中，不能再跳

    // 统一管理所有 box
    this.boxes = [];
    this.boxes.push(this.currentBox);

    // 再来一个盒子
    this.targetBox = this.dropBox();

    this.handleTouch();
  }

  createAnt() {
    // 使用图片生成一个 sprite
    const ant = Tiny.Sprite.fromImage(Tiny.resources.antPng);
    // canvas 默认旋转中心是在左上角，这样定位起来比较麻烦，所以这里将蚂蚁的脚底作为定位中心
    ant.setPivot(ant.width / 2, ant.height);
    // 先随便定个位置吧
    ant.setPosition(100, 300);
    ant.name = 'ant';

    // 加到 container 中来渲染
    this.addChild(ant);

    return ant;
  }

  createBox() {
    const box = Tiny.Sprite.fromImage(Tiny.resources.boxPng);
    box.setPivot(box.width / 2, box.height);
    // 位置得调整一下，使得蚂蚁能够正好站在盒子上
    box.setPosition(100, 400);
    box.name = 'box';

    // 如果使用 addChild，会发现盒子将蚂蚁盖起来了，所以使用 addChildAt 来将盒子放到蚂蚁下面
    this.addChildAt(box, 0);
    return box;
  }

  handleTouch() {
    const canvas = Tiny.app.view;
    const supportTouch = 'ontouchstart' in window;

    canvas.addEventListener(supportTouch ? 'touchstart' : 'mousedown', () => {
      // 蚂蚁压缩
      this.compress();
    });

    canvas.addEventListener(supportTouch ? 'touchend' : 'mouseup', () => {
      // 蚂蚁恢复
      this.compressRestore();

      // 跳的过程中就不能再跳了
      if (this.isJumping) return;

      this.isJumping = true;
      this.jump(this.deltaX, () => {
        // 跳完后
        this.isJumping = false;

        // 因为要更换 ant 的 group，所以要计算 ant 相对 targetBox 的位置
        var { x, y } = caleRelateTargetPos(this.ant, this.targetBox);
        this.ant.setPosition(x, y);
        this.targetBox.addChild(this.ant);

        this.currentBox = this.targetBox;
        this.boxes.push(this.currentBox);

        // 移动屏幕
        this.sceneMove();

        // 再来一个盒子
        this.targetBox = this.dropBox();
      });
    });
  }

  jump(deltaX, onComplete) {
    setPivot(this.ant, this.ant.width / 2, this.ant.height / 2);

    const maxHeight = 200; // 跳的最高点

    const ant = this.ant; // 上面创建的蚂蚁实例
    const originX = ant.position.x;
    const originY = ant.position.y;

    const tween = new Tiny.TWEEN.Tween({ // 起始值
      rotation: 0,
      x: originX,
      y: originY,
    }).to({ // 结束值
      // rotation: 360, // 旋转 1 周
      // x: originX + deltaX, // 向右移动 deltaX
      // y: [originY - maxHeight, originY], // 设置 2 个关键帧，一个是最高点，一个是最终点。效果就是蚂蚁跳起来然后落下

      rotation: [180, 320, 360], // 旋转 1 周
      x: [originX + deltaX * 0.5, originX + deltaX * 0.8, originX + deltaX], // 向右移动 deltaX
      y: [originY - maxHeight * 0.5, originY - maxHeight * 0.2, originY]
    }, 1000).onUpdate(function() {
      // 设置位置
      ant.setPosition(this.x, this.y);
      // 需要将角度转换为弧度，然后设置旋转
      ant.setRotation(Tiny.deg2radian(this.rotation));
    }).onComplete(function () {
      // 动画结束的回调
      onComplete();
    });

    // 动画开始
    tween.start();
  }

  compress() {
    // 动画 持续 1000ms，y 轴缩放到 0.7
    this.currentBox.runAction(Tiny.ScaleTo(1000, {
      scaleY: 0.7,
    }));
  }

  compressRestore() {
    this.currentBox.removeActions(); // 移除动画

    const action = Tiny.ScaleTo(500, Tiny.scale(1));
    action.setEasing(Tiny.TWEEN.Easing.Bounce.Out); // 回弹效果
    this.currentBox.runAction(action);
  }

  dropBox() {
    var box = Tiny.Sprite.fromImage(Tiny.resources.boxPng);
    box.setPivot(box.width / 2, box.height);
    box.name = 'box';

    const deltaY = 100; // 从 deltaY 开始掉落
    const x = this.currentBox.x + this.deltaX;
    const y = this.currentBox.y - deltaY;
    box.setPosition(x, y); // 设置初始位置

    // 下落动画
    const action = Tiny.MoveBy(500, {
      y: deltaY,
    });
    action.setEasing(Tiny.TWEEN.Easing.Bounce.Out); // 盒子落地有个弹性效果
    box.runAction(action);

    this.addChildAt(box, 0);
    return box;
  }

  sceneMove() {
    const action = Tiny.MoveBy(500, {
      x: -this.deltaX,
    });

    action.onComplete = (tween, object) => {
      const scenePostion = this.position;

      for (var i = this.boxes.length - 1; i >= 0; i--) {
        const box = this.boxes[i];
        // 屏幕外的 box 都删掉，防止内存泄露
        if ((box.x - box.pivot.x + box.width + scenePostion.x) < 0) {
          box.parent.removeChild(box);
          this.boxes.splice(i, 1);
        }
      }
    };

    this.runAction(action);
  }
}

export default StartLayer;
