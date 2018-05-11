import { getTargetBoxPos, direction, caleRelateTargetPos, setPivot, getCollisionRegion } from './utils';
import inside from 'point-in-polygon';

class StartLayer extends Tiny.Container {
  constructor() {
    super();

    this.init();
    this.handleTouch();
  }

  init() {
    this.ant = this.createAnt();
    this.currentBox = this.createBox();
    // 将蚂蚁放到 box 组中
    this.currentBox.addChild(this.ant);
    // 位置也得调整下
    this.ant.setPosition(100, 50);

    this.isJumping = false; // 在跳的过程中，不能再跳
    this.targetBoxDirection = direction.right; // 下一个盒子的方向
    this.targetBoxDelta = 200; // 下一个盒子的距离
    this.numInOneDirection = 2; // 在一个方向上的连续盒子数量

    // 统一管理所有 box
    this.boxes = [];
    this.boxes.push(this.currentBox);

    // 再来一个盒子
    this.targetBox = this.dropBox();
  }

  reset() {
    // 清空所有元素
    while (this.children.length > 0) {
      const b = this.children[this.children.length - 1];
      b.parent.removeChild(b);
    }

    // 恢复屏幕坐标
    this.setPosition(0, 0);

    // 重新加载初始元素
    this.init();
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
    box.setPosition(100, 600);
    box.name = 'box';

    // 如果使用 addChild，会发现盒子将蚂蚁盖起来了，所以使用 addChildAt 来将盒子放到蚂蚁下面
    this.addChildAt(box, 0);
    return box;
  }

  handleTouch() {
    const canvas = Tiny.app.view;
    const supportTouch = 'ontouchstart' in window;

    this.pressTime = +Date.now();
    canvas.addEventListener(supportTouch ? 'touchstart' : 'mousedown', () => {
      this.pressTime = +Date.now();
      // 蚂蚁压缩
      this.compress();
    });

    canvas.addEventListener(supportTouch ? 'touchend' : 'mouseup', () => {
      // 蚂蚁恢复
      this.compressRestore();

      // 跳的过程中就不能再跳了
      if (this.isJumping) return;
      this.isJumping = true;

      const deltaTime = +Date.now() - this.pressTime;
      var targetBoxDelta = 0.8 * deltaTime;
      const maxTargetDelta = 600;
      if (targetBoxDelta > maxTargetDelta) {
        targetBoxDelta = maxTargetDelta;
      }

      // var targetBoxDelta = 270;
      this.jump(targetBoxDelta, this.targetBoxDirection, () => {
        // 跳完后
        this.isJumping = false;

        const jumpSuccess = this.jumpResult();

        if (jumpSuccess) {
          this._jumpSuccess();
        } else {
          this._jumpFail();
        }
      });
    });
  }

  _jumpSuccess() {
    // 因为要更换 ant 的 group，所以要计算 ant 相对 targetBox 的位置
    var { x, y } = caleRelateTargetPos(this.ant, this.targetBox);
    this.ant.setPosition(x, y);
    this.targetBox.addChild(this.ant);

    this.currentBox = this.targetBox;
    this.boxes.push(this.currentBox);

    // 确定下一个盒子的方向和位移
    this.setTargetBoxDirectionAndDelta();

    // 移动屏幕
    this.sceneMove();

    // 再来一个盒子
    this.targetBox = this.dropBox();
  }

  _jumpFail() {
    this.reset();
  }

  jump(targetDelta, direction, onComplete) {
    setPivot(this.ant, this.ant.width / 2, this.ant.height / 2);

    const maxHeight = 200; // 跳的最高点

    const ant = this.ant; // 上面创建的蚂蚁实例
    const originX = ant.position.x;
    const originY = ant.position.y;
    const targetPos = getTargetBoxPos(this.ant.position, targetDelta, direction);
    const deltaX = targetPos.x - originX;

    const tween = new Tiny.TWEEN.Tween({ // 起始值
      rotation: 0,
      x: originX,
      y: originY,
    }).to({ // 结束值
      rotation: [180 * direction, 320 * direction, 360 * direction], // 旋转 1 周
      x: [originX + deltaX * 0.5, originX + deltaX * 0.8, originX + deltaX],
      y: [targetPos.y - maxHeight * 0.5, targetPos.y - maxHeight * 0.2, targetPos.y],
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

  jumpResult() {
    const antRegion = this.getAntRegion();
    const boxRegion = this.getBoxRegion();

    return inside(antRegion, boxRegion);
  }

  getAntRegion() {
    var { x, y, width, height } = getCollisionRegion(this.ant);
    x -= this.position.x;
    y -= this.position.y;

    const realX = x + width / 2 + 10; // 底部中点然后再微调下
    const realY = y + height;

    this._drawAntRegion(realX, realY);

    return [realX, realY];
  }
  _drawAntRegion(x, y) {
    var mask = new Tiny.Graphics();
    mask.lineStyle(4, 0x66FF33, 1);
    mask.drawCircle(x, y, 1);
    mask.endFill();

    this.addChild(mask);
  }

  getBoxRegion() {
    var {x, y, width} = getCollisionRegion(this.targetBox);
    x -= this.position.x;
    y -= this.position.y;
    var delta = 10; // 离边距需要隔一点距离

    var result = [
      [x + 133, y + delta], // 上
      [x + width - delta, y + 49], // 右
      [x + 133, y + 89 - delta], // 下
      [x + 54 + delta, y + 48], // 左
    ];

    this._drawBoxRegion(result);

    return result;
  }
  _drawBoxRegion(result) {
    var path = [];
    result.forEach((r) => {
      path = path.concat(r);
    });
    path = path.concat(result[0]);

    var mask = new Tiny.Graphics();
    mask.lineStyle(4, 0x66FF33, 1);
    mask.drawPolygon(path);
    mask.endFill();

    this.addChild(mask);
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

  setTargetBoxDirectionAndDelta() {
    this.numInOneDirection -= 1;
    if (this.numInOneDirection <= 0) {
      this.targetBoxDirection = -this.targetBoxDirection; // 反向
      this.numInOneDirection = Tiny.randomInt(1, 3);
    }

    this.targetBoxDelta = Tiny.randomInt(150, 300);
  }

  dropBox() {
    var box = Tiny.Sprite.fromImage(Tiny.resources.boxPng);
    box.setPivot(box.width / 2, box.height);
    box.name = 'box';

    const targetPos = getTargetBoxPos(this.currentBox.position, this.targetBoxDelta, this.targetBoxDirection);

    const deltaY = 100; // 从 deltaY 开始掉落
    box.setPosition(targetPos.x, targetPos.y - deltaY); // 设置初始位置

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
    const targetPos = getTargetBoxPos(this.position, this.targetBoxDelta, this.targetBoxDirection);
    const action = Tiny.MoveBy(500, {
      x: this.position.x - targetPos.x,
      y: this.position.y - targetPos.y,
    });

    action.onComplete = (tween, object) => {
      const scenePostion = this.position;

      for (var i = this.boxes.length - 1; i >= 0; i--) {
        const box = this.boxes[i];

        // 屏幕下方的 box 不会再出现了，所以可以删掉，防止内存泄露
        if ((box.y - box.height + scenePostion.y) > Tiny.WIN_SIZE.height) {
          box.parent.removeChild(box);
          this.boxes.splice(i, 1);
        }
      }
    };

    this.runAction(action);
  }
}

export default StartLayer;
