import { vec2 } from 'gl-matrix';

export const direction = {
  left: -1,
  right: 1,
};

/**
 * 从 originPos 按照指定方向 direction，移动距离 delta，返回新的坐标
 * @param {object} originPos
 * @param {number} delta
 * @param {number} direction
 */
export function getTargetBoxPos(originPos, delta, direction) {
  const deg = 30;

  const x = originPos.x + direction * delta * Math.cos(Tiny.deg2radian(deg));
  const y = originPos.y - delta * Math.sin(Tiny.deg2radian(deg)); // 只能向上运动
  return { x, y };
}

/**
 * 得到 obj 在 targetContainer 中的相对坐标
 * @param {Tiny.DisplayObject} obj
 * @param {Tiny.DisplayObject} targetContainer
 */
export function caleRelateTargetPos(obj, targetContainer) {
  // 使用全局坐标来计算
  const objGlobalPos = obj.getGlobalPosition();
  const targetGlobalPos = targetContainer.getGlobalPosition();

  const newX = objGlobalPos.x - targetGlobalPos.x;
  const newY = objGlobalPos.y - targetGlobalPos.y;

  // 还要考虑缩放比率，不同配置中拿到的宽度是不同的
  const winW = Tiny.config.fixSize ? Tiny.config.width : window.innerWidth;
  const rate = winW / Tiny.WIN_SIZE.width;

  // 还要考虑 targetContainer 的中心点
  const targetPivot = targetContainer.getPivot();

  return {
    x: newX / rate + targetPivot.x,
    y: newY / rate + targetPivot.y,
  };
}

/**
 * 设置 obj 的中心点为 (x,y)，会自动重设其 position，使得视觉上的渲染位置保持不变
 * @param {Tiny.Sprite} obj
 * @param {number} x
 * @param {number} [y]
 */
export function setPivot(obj, x, y) {
  const { x: originPivotX, y: originPivotY } = obj.getPivot();

  obj.setPivot(x, y);

  obj.setPositionX(obj.position.x + x - originPivotX);
  obj.setPositionY(obj.position.y + y - originPivotY);
}

/**
 * 获取 obj 用于碰撞盒计算的坐标跟宽高
 * @param {Tiny.Sprite} obj
 */
export function getCollisionRegion(obj) {
  // 使用全局坐标来计算
  let { x, y } = obj.getGlobalPosition();

  // 还要考虑缩放比率，不同配置中拿到的宽度是不同的
  const winW = Tiny.config.fixSize ? Tiny.config.width : window.innerWidth;
  const rate = winW / Tiny.WIN_SIZE.width;

  // 还要考虑中心点
  const pivot = obj.getPivot();

  return {
    x: x / rate - pivot.x,
    y: y / rate - pivot.y,
    width: obj.width,
    height: obj.height,
  };
}

/**
 * 得到从 _c 点到 _a, _b 所构成的直线的距离
 * @param {number[]} _c
 * @param {number[]} _a
 * @param {number[]} _b
 */
export function getDistance(_c, _a, _b) {
  var c = vec2.fromValues(_c[0], _c[1]);
  var a = vec2.fromValues(_a[0], _a[1]);
  var b = vec2.fromValues(_b[0], _b[1]);

  var out = vec2.create();
  var v = vec2.sub(out, c, a);

  out = vec2.create();
  var n = vec2.sub(out, b, a);

  var _x = vec2.dot(v, n) / vec2.squaredDistance(b, a);

  out = vec2.create();
  var _v2 = vec2.scale(out, n, _x);

  out = vec2.create();
  var v2 = vec2.sub(out, v, _v2);

  return vec2.length(v2);
}
