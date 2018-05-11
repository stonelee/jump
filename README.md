# 仿微信「跳一跳」

> The Tiny.js game project build by tinyjs-cli

![](https://zos.alipayobjects.com/rmsportal/nJBojwdMJfUqpCWvwyoA.png@120w)

## 目录：
* [1. 简单实现](https://github.com/stonelee/jump/blob/master/docs/1.md)
* [2. 优化](https://github.com/stonelee/jump/blob/master/docs/2.md)
* [3. 斜 45 度地图](https://github.com/stonelee/jump/blob/master/docs/3.md)
* [4. 碰撞检测](https://github.com/stonelee/jump/blob/master/docs/4.md)
* [5. 碰撞后的细节优化](https://github.com/stonelee/jump/blob/master/docs/5.md)

## 命令

- `npm install`: 安装依赖
- `npm start`: 本地服务，默认端口：8017
- `npm build`: 执行编译

## 关于 Tiny.js

- `官网`: http://tinyjs.net
- `指南`: http://tinyjs.net/#/tutorial/start
- `API`: http://tinyjs.net/docs/

## 关于标准版

此项目由Tiny.js 本地开发工具 [tinyjs-cli](https://github.com/ant-tinyjs/tinyjs-cli) 使用 [Tiny.js 项目开发模版](https://github.com/ant-tinyjs/wei) 初始化，符合 [webpack 4](https://webpack.js.org/) 标准开发工程流。
项目已集成 [tinyjs-resource-loader](https://github.com/ant-tinyjs/tinyjs-resource-loader)，这是一个用于处理 Tiny.js 游戏资源的 webpack loader，让你更轻松的处理繁杂的资源文件。
当然，你完全可以基于此定制你熟悉的工作流。


> 注意：
>
> 由于 [tinyjs-resource-loader](http://tinyjs.net/#/tools/tinyjs-resource-loader) 依赖 [ImageMagick](https://www.imagemagick.org/script/download.php)，所以你需要安装 ImageMagick。
