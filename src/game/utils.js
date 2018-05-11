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
