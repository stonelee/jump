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
